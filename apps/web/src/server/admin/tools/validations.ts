import { ToolStatus, ToolTier } from "@plai/db/client"
import * as z from "zod"
import { repositorySchema } from "~/server/schemas"

export const searchParamsSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(50),
  sort: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z
    .enum(["and", "or"])
    .default("and")
    .transform(val => val.toUpperCase()),
})

export const getToolsSchema = searchParamsSchema

export type GetToolsSchema = z.infer<typeof getToolsSchema>

export const toolSchema = z.object({
  // Required fields (with red asterisks)
  name: z.string().min(1, "Name is required"),
  website: z.string().min(1, "Website is required").url(),
  submitterName: z.string().min(1, "Name is required"),
  submitterEmail: z.string().min(1, "Email is required").email(),
  
  // Optional fields (no asterisks)
  slug: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.preprocess((val) => val === "" ? undefined : val, z.string().url().optional()),
  screenshotUrl: z.preprocess((val) => val === "" ? undefined : val, z.string().url().optional()),
  submitterNote: z.string().optional(),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  categories: z.array(z.string()).optional(),
  tier: z.nativeEnum(ToolTier).default(ToolTier.Free),
  xAccountUrl: z.preprocess((val) => val === "" ? undefined : val, z.string().url().optional()),
  logoUrl: z.preprocess((val) => val === "" ? undefined : val, z.string().url().optional()),
  websiteScreenshotUrl: z.preprocess((val) => val === "" ? undefined : val, z.string().url().optional()),
  pricingType: z.enum(["Free", "Freemium", "Paid"]).default("Free"),
  pricingDetails: z.string().optional(),
  affiliateOptIn: z.boolean().default(false),
})

export type ToolSchema = z.infer<typeof toolSchema>
