import { prisma } from "@plai/db"
import { type Prisma, BlogPostStatus } from "@plai/db/client"
import { cache } from "~/lib/cache"
import { blogPostManyPayload, blogPostOnePayload } from "~/server/web/blog/payloads"

export const findBlogPosts = cache(
  async ({ where, orderBy, ...args }: Prisma.BlogPostFindManyArgs) => {
    return prisma.blogPost.findMany({
      ...args,
      orderBy: orderBy ?? { publishedAt: "desc" },
      where: { 
        status: BlogPostStatus.Published,
        publishedAt: {
          lte: new Date(),
        },
        ...where 
      },
      select: blogPostManyPayload,
    })
  },
  ["blogPosts"],
)

export const findBlogPostSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.BlogPostFindManyArgs) => {
  return prisma.blogPost.findMany({
    ...args,
    orderBy: orderBy ?? { publishedAt: "desc" },
    where: { 
      status: BlogPostStatus.Published,
      publishedAt: {
        lte: new Date(),
      },
      ...where 
    },
    select: { slug: true, updatedAt: true },
  })
}

export const findBlogPostBySlug = (
  slug: string,
  { where, ...args }: Prisma.BlogPostFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return prisma.blogPost.findFirst({
        ...args,
        where: { 
          slug, 
          status: BlogPostStatus.Published,
          publishedAt: {
            lte: new Date(),
          },
          ...where 
        },
        select: blogPostOnePayload,
      })
    },
    ["blogPost", `blogPost-${slug}`],
  )(slug) 