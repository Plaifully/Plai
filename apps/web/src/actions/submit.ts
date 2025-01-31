"use server"

import { slugify } from "@curiousleaf/utils"
import { prisma } from "@plai/db"
import { PricingType, Prisma } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { createServerAction } from "zsa"
import { subscribeToNewsletter } from "~/actions/subscribe"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { submitToolSchema } from "~/server/schemas"
import { inngest } from "~/services/inngest"
import { isRealEmail } from "~/utils/helpers"

/**
 * Generates a unique slug by adding a numeric suffix if needed
 */
const generateUniqueSlug = async (baseName: string): Promise<string> => {
  const baseSlug = slugify(baseName)
  let slug = baseSlug
  let suffix = 2

  while (true) {
    // Check if slug exists
    if (!(await prisma.tool.findUnique({ where: { slug } }))) {
      return slug
    }

    // Add/increment suffix and try again
    slug = `${baseSlug}-${suffix}`
    suffix++
  }
}

/**
 * Submit a tool to the database
 * @param input - The tool data to submit
 * @returns The tool that was submitted
 */
export const submitTool = createServerAction()
  .input(submitToolSchema)
  .handler(async (args) => {
    console.log('Raw input args:', args)
    console.log('Input type:', typeof args)
    
    if (!args || typeof args !== 'object' || !('input' in args)) {
      console.error('Invalid input format:', args)
      return { 
        success: false, 
        error: 'Invalid input format' 
      }
    }

    const { input } = args
    // const ip = await getIP()

    // Rate limiting check
    // if (await isRateLimited(ip, "submission")) {
    //   throw new Error("Too many submissions. Please try again later.")
    // }

    const { newsletterOptIn, ...inputData } = input
    console.log('Processed input data:', inputData)
    const isValidEmail = await isRealEmail(inputData.submitterEmail)

    if (!isValidEmail) {
      throw new Error("Invalid email address, please use a real one")
    }

    if (newsletterOptIn) {
      await subscribeToNewsletter({
        email: inputData.submitterEmail,
        utm_medium: "submit_form",
        double_opt_override: "off",
        send_welcome_email: false,
      })
    }

    // Check if the tool already exists
    const existingTool = await prisma.tool.findFirst({
      where: { website: inputData.website },
    })

    // If the tool exists, redirect to the tool or submit page
    if (existingTool) {
      return existingTool
    }

    // Generate a unique slug
    const slug = await generateUniqueSlug(inputData.name)

    // Map the data to match Prisma schema
    const data: Prisma.ToolCreateInput = {
      name: inputData.name,
      website: inputData.website,
      submitterName: inputData.submitterName,
      submitterEmail: inputData.submitterEmail,
      slug,
      status: "Draft",
      pricingType: inputData.pricingType,
      affiliateOptIn: inputData.affiliateOptIn,
      // Optional fields - only include if they have non-empty values
      ...(inputData.xAccountUrl && inputData.xAccountUrl.trim() ? { xAccountUrl: inputData.xAccountUrl } : {}),
      ...(inputData.logoUrl && inputData.logoUrl.trim() ? { logoUrl: inputData.logoUrl } : {}),
      ...(inputData.websiteScreenshotUrl && inputData.websiteScreenshotUrl.trim() ? { websiteScreenshotUrl: inputData.websiteScreenshotUrl } : {}),
      ...(inputData.pricingDetails && inputData.pricingDetails.trim() ? { pricingDetails: inputData.pricingDetails } : {})
    }

    try {
      // Save the tool to the database
      try {
        const tool = await prisma.tool.create({ data })
        revalidateTag("admin-tools")

        return { success: true, data: tool }
      } catch (error) {
        // Log the raw error stack to avoid Next.js source map issues
        console.error('Raw error stack:', error instanceof Error ? error.stack : error)
        
        // Log Prisma-specific error details if available
        if (error instanceof Error && 'code' in error) {
          console.error('Prisma error details:', {
            name: error.name,
            code: (error as any).code,
            meta: (error as any).meta,
            clientVersion: (error as any).clientVersion,
            message: error.message
          })
        }
        throw error
      }

      // // Send an event to the Inngest pipeline
      // try {
      //   await inngest.send({ name: "tool.submitted", data: { slug } })
      // } catch (inngestError) {
      //   console.error('Error sending Inngest event:', inngestError)
      //   // Don't throw here, as the tool was created successfully
      // }

      // Revalidate cache

    } catch (error) {
      // Log the raw error stack to avoid Next.js source map issues
      console.error('Raw error stack:', error instanceof Error ? error.stack : error)
      
      // Return a structured error response with more details
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? {
          name: error.name,
          code: (error as any).code,
          meta: (error as any).meta
        } : undefined
      }
    }
  })
