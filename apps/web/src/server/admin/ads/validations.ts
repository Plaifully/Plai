import { AdType } from "@plai/db/client"
import { z } from "zod"

export const searchParamsSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
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

export const getAdsSchema = searchParamsSchema

export type GetAdsSchema = z.infer<typeof getAdsSchema>

export const adSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email(),
  description: z.string().optional(),
  website: z.string().min(1, "Website is required").url(),
  faviconUrl: z.string().optional(),
  type: z.nativeEnum(AdType).default(AdType.Homepage),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
})

export type AdSchema = z.infer<typeof adSchema> 