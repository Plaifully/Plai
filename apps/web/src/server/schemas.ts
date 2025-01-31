import { getRepositoryString, githubRegex } from "@plai/github"
import { PricingType } from "@prisma/client"
import { z } from "zod"
import { config } from "~/config"

// Create a mapping of the enum values
const pricingTypeValues = {
  Free: "Free",
  Freemium: "Freemium",
  Paid: "Paid"
} as const

export const repositorySchema = z
  .string()
  .min(1, "Repository is required")
  .trim()
  .toLowerCase()
  .regex(githubRegex, "Please enter a valid GitHub repository (e.g. https://github.com/owner/name)")

// Base tool schema with common fields
const baseToolSchema = {
  name: z.string().min(1, "Name is required"),
  website: z.string().min(1, "Website is required").url("Invalid URL").trim(),
  xAccountUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteScreenshotUrl: z.string().optional(),
  pricingType: z.enum(["Free", "Freemium", "Paid"]).default("Free"),
  pricingDetails: z.string().optional(),
  affiliateOptIn: z.boolean().optional().default(false),
}

// Schema for submitting new tools (requires submitter info)
export const submitToolSchema = z.object({
  ...baseToolSchema,
  submitterName: z.string().min(1, "Your name is required"),
  submitterEmail: z
    .string()
    .min(1, "Your email is required")
    .email("Invalid email address, please use a correct format."),
  newsletterOptIn: z.boolean().optional().default(true),
})

// Schema for updating existing tools (submitter info optional)
export const updateToolSchema = z.object({
  ...baseToolSchema,
  submitterName: z.string().optional(),
  submitterEmail: z.string().email("Invalid email address").optional(),
  status: z.enum(["Draft", "Published", "Scheduled"]).optional(),
  publishedAt: z.date().optional().nullable(),
  tier: z.enum(["Free", "Featured", "Premium"]).optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  referring_site: z.string().optional().default(config.site.url),
  utm_source: z.string().optional().default(config.site.name),
  utm_medium: z.string().optional().default("subscribe_form"),
  utm_campaign: z.string().optional().default("organic"),
  double_opt_override: z.string().optional(),
  reactivate_existing: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
})

export const stackAnalyzerSchema = z.object({
  repository: repositorySchema.transform(getRepositoryString),
})

export type SubmitToolSchema = z.infer<typeof submitToolSchema>
export type NewsletterSchema = z.infer<typeof newsletterSchema>
export type StackAnalyzerSchema = z.infer<typeof stackAnalyzerSchema>
