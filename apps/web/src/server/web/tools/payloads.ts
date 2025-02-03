import { Prisma } from "@plai/db/client"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { topicManyPayload } from "~/server/web/topics/payloads"

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
})

export const toolTopicsPayload = Prisma.validator<Prisma.Tool$topicsArgs>()({
  select: topicManyPayload,
  orderBy: { slug: "asc" },
})

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  website: true,
  tagline: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  tier: true,
  discountCode: true,
  discountAmount: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
  categories: toolCategoriesPayload,
  topics: toolTopicsPayload,
})

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  tagline: true,
  faviconUrl: true,
  discountAmount: true,
  pricingType: true,
  publishedAt: true,
  updatedAt: true,
  categories: {
    select: {
      name: true,
      slug: true,
    },
  },
})

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
  publishedAt: true,
  updatedAt: true,
  categories: toolCategoriesPayload,
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>
