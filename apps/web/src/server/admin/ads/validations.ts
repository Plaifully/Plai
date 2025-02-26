import { AdType } from "@prisma/client"
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

export const AdPlacement = {
  Agent: "Agent",
  FloatingTop: "FloatingTop",
  HorizontalTop: "HorizontalTop",
  HorizontalMiddle: "HorizontalMiddle",
  HorizontalBottom: "HorizontalBottom",
  VerticalLeft: "VerticalLeft",
  VerticalRight: "VerticalRight",
} as const

export type AdPlacement = typeof AdPlacement[keyof typeof AdPlacement]

type BannerPlacement = Exclude<AdPlacement, typeof AdPlacement.Agent>

export const adSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url(),
  faviconUrl: z.string().url().optional(),
  type: z.nativeEnum(AdType),
  placement: z.enum([
    AdPlacement.Agent,
    AdPlacement.FloatingTop,
    AdPlacement.HorizontalTop,
    AdPlacement.HorizontalMiddle,
    AdPlacement.HorizontalBottom,
    AdPlacement.VerticalLeft,
    AdPlacement.VerticalRight,
  ]),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  categories: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
}).refine(
  (data) => {
    if (data.placement === AdPlacement.Agent) return true
    return !!(data.imageUrl && data.width && data.height)
  },
  (data) => ({
    message: data.placement === AdPlacement.Agent 
      ? "Invalid ad data"
      : "Image URL, width, and height are required for banner ads",
  })
)

export type AdSchema = z.infer<typeof adSchema> 