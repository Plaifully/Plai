import { Prisma, BlogPostStatus } from "@plai/db/client"

export const blogPostOnePayload = Prisma.validator<Prisma.BlogPostSelect>()({
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  image: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  authorName: true,
  authorImage: true,
  authorTwitter: true,
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
})

export const blogPostManyPayload = Prisma.validator<Prisma.BlogPostSelect>()({
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  image: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  authorName: true,
  authorImage: true,
  authorTwitter: true,
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
})

export type BlogPostOne = Prisma.BlogPostGetPayload<{ select: typeof blogPostOnePayload }>
export type BlogPostMany = Prisma.BlogPostGetPayload<{ select: typeof blogPostManyPayload }> 