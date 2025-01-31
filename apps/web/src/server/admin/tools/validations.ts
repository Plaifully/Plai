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
  
  // Optional fields (no asterisks)
  submitterName: z.string().transform(val => val || undefined).optional(),
  submitterEmail: z.string()
    .transform(val => val || undefined)
    .pipe(z.string().email("Invalid email format").optional())
    .optional(),
  slug: z.string().transform(val => val || undefined).optional(),
  tagline: z.string().transform(val => val || undefined).optional(),
  description: z.string().transform(val => val || undefined).optional(),
  content: z.string().transform(val => val || undefined).optional(),
  faviconUrl: z.string().transform(val => val || undefined).optional(),
  screenshotUrl: z.string().transform(val => val || undefined).optional(),
  submitterNote: z.string().transform(val => val || undefined).optional(),
  discountCode: z.string().transform(val => val || undefined).optional(),
  discountAmount: z.string().transform(val => val || undefined).optional(),
  publishedAt: z.coerce.date().optional(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  categories: z.array(z.string()).optional(),
  tier: z.nativeEnum(ToolTier).default(ToolTier.Free),
  xAccountUrl: z.string().transform(val => val || undefined).optional(),
  logoUrl: z.string().transform(val => val || undefined).optional(),
  websiteScreenshotUrl: z.string().transform(val => val || undefined).optional(),
  pricingType: z.enum(["Free", "Freemium", "Paid"]).default("Free"),
  pricingDetails: z.string().transform(val => val || undefined).optional(),
  affiliateOptIn: z.boolean().default(false),
})

export type ToolSchema = z.infer<typeof toolSchema>
