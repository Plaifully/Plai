"use server"

import { slugify } from "@curiousleaf/utils"
import { prisma } from "@plai/db"
import { ToolStatus } from "@plai/db/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { authedProcedure } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/validations"
import { inngest } from "~/services/inngest"

export const createTool = authedProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input }) => {
    const { categories, ...data } = input
    
    const tool = await prisma.tool.create({
      data: {
        ...data,
        slug: data.slug || slugify(data.name),
        categories: categories ? {
          connect: categories.map(id => ({ id }))
        } : undefined,
      },
    })

    revalidateTag("admin/tools")

    if (tool.publishedAt) {
      await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })
    }

    return tool
  })

export const updateTool = authedProcedure
  .createServerAction()
  .input(toolSchema.extend({ id: z.string() }))
  .handler(async ({ input }) => {
    try {
      const { id, categories, ...data } = input
      
      const tool = await prisma.tool.update({
        where: { id },
        data: {
          ...data,
          categories: categories ? {
            set: categories.map(id => ({ id }))
          } : undefined,
        },
      })

      revalidateTag("tools")
      revalidateTag(`tool-${tool.slug}`)

      return tool
    } catch (error) {
      console.error('Failed to update tool:', {
        error,
        toolId: input.id,
        data: input,
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  })

export const updateTools = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: toolSchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.tool.updateMany({
      where: { id: { in: ids } },
      data,
    })

    revalidateTag("tools")
    revalidateTag("tool")

    return true
  })

export const deleteTools = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await prisma.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await prisma.tool.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("tools")

    // Send an event to the Inngest pipeline
    for (const tool of tools) {
      await inngest.send({ name: "tool.deleted", data: { slug: tool.slug } })
    }

    return true
  })

export const scheduleTool = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string(), publishedAt: z.coerce.date() }))
  .handler(async ({ input: { id, publishedAt } }) => {
    const tool = await prisma.tool.update({
      where: { id },
      data: { status: ToolStatus.Scheduled, publishedAt },
    })

    revalidateTag("admin-tools")
    revalidateTag("schedule")
    revalidateTag(`tool-${tool.slug}`)

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })

    return true
  })

export const reuploadToolAssets = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await prisma.tool.findUniqueOrThrow({ where: { id } })

    const [faviconUrl, screenshotUrl] = await Promise.all([
      uploadFavicon(tool.website, `tools/${tool.slug}/favicon`),
      uploadScreenshot(tool.website, `tools/${tool.slug}/screenshot`),
    ])

    await prisma.tool.update({
      where: { id: tool.id },
      data: { faviconUrl, screenshotUrl },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return true
  })

export const analyzeToolStack = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await prisma.tool.findUniqueOrThrow({ where: { id } })

    // Since we removed repository field, we might want to analyze based on website URL instead
    // Or remove this function entirely if it's no longer needed
    throw new Error("Tool stack analysis is no longer supported")
  })
