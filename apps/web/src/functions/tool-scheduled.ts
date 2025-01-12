import { prisma } from "@plai/db"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolExpediteReminder from "~/emails/tool-expedite-reminder"
import EmailToolScheduled from "~/emails/tool-scheduled"
import { sendEmails } from "~/lib/email"
import { generateContent } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { getToolRepositoryData } from "~/lib/repositories"
import { firecrawlClient } from "~/services/firecrawl"
import { inngest } from "~/services/inngest"
import { waitForPremiumSubmission } from "~/utils/functions"

export const toolScheduled = inngest.createFunction(
  { id: "tool.scheduled", concurrency: { limit: 2 } },
  { event: "tool.scheduled" },

  async ({ event, step, logger }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Scrape website
    const scrapedData = await step.run("scrape-website", async () => {
      const data = await firecrawlClient.scrapeUrl(tool.website, { formats: ["markdown"] })

      if (!data.success) {
        throw new Error(data.error)
      }

      logger.info(`Scraped website for ${tool.name}`, { data })

      return data
    })

    // Run steps in parallel
    await Promise.all([
      step.run("generate-content", async () => {
        const { categories, alternatives, ...content } = await generateContent(scrapedData)

        return await prisma.tool.update({
          where: { id: tool.id },
          data: {
            ...content,
            categories: { connect: categories.map(({ id }) => ({ id })) },
            alternatives: { connect: alternatives.map(({ id }) => ({ id })) },
          },
        })
      }),

      step.run("fetch-repository-data", async () => {
        const data = await getToolRepositoryData(tool.repository)

        if (!data) return

        return await prisma.tool.update({
          where: { id: tool.id },
          data,
        })
      }),

      step.run("upload-favicon", async () => {
        const { id, slug, website } = tool
        const faviconUrl = await uploadFavicon(website, `tools/${slug}/favicon`)

        return await prisma.tool.update({
          where: { id },
          data: { faviconUrl },
        })
      }),

      step.run("upload-screenshot", async () => {
        const { id, slug, website } = tool
        const screenshotUrl = await uploadScreenshot(website, `tools/${slug}/screenshot`)

        return await prisma.tool.update({
          where: { id },
          data: { screenshotUrl },
        })
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await prisma.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("admin-tools")
      revalidateTag("schedule")
      revalidateTag(`tool-${tool.slug}`)
    })

    // If no submitter email, return early
    if (!tool.submitterEmail) {
      return
    }

    const to = tool.submitterEmail

    // Send initial email
    await step.run("send-email", async () => {
      const subject = `Great news! ${tool.name} is scheduled for publication on ${config.site.name} 🎉`

      return await sendEmails({
        to,
        subject,
        react: EmailToolScheduled({ to, subject, tool }),
      })
    })

    // Wait for 1 month and check if tool was expedited
    const oneMonthResult = await waitForPremiumSubmission(step, "30d")

    // Send first reminder if not expedited
    await step.run("send-first-reminder", async () => {
      if (!oneMonthResult) {
        const subject = `Skip the queue for ${tool.name} on ${config.site.name} 🚀`

        return await sendEmails({
          to,
          subject,
          react: EmailToolExpediteReminder({ to, subject, tool, monthsWaiting: 1 }),
        })
      }
    })

    // Wait for another month and check if tool was expedited
    const twoMonthResult = await waitForPremiumSubmission(step, "30d")

    // Send second reminder if not expedited
    await step.run("send-second-reminder", async () => {
      if (!twoMonthResult) {
        const subject = `Last chance to expedite ${tool.name} on ${config.site.name} ⚡️`

        return await sendEmails({
          to,
          subject,
          react: EmailToolExpediteReminder({ to, subject, tool, monthsWaiting: 2 }),
        })
      }
    })
  },
)
