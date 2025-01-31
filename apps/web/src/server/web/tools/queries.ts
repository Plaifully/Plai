import { performance } from "node:perf_hooks"
import { prisma } from "@plai/db"
import { type Prisma, type Tool, ToolStatus } from "@plai/db/client"
import type { inferParserType } from "nuqs/server"
import { cache } from "~/lib/cache"
import {
  toolManyExtendedPayload,
  toolManyPayload,
  toolOnePayload,
} from "~/server/web/tools/payloads"
import type { toolsSearchParams } from "~/server/web/tools/search-params"

export const searchTools = cache(
  async (
    { q, category, page, sort, perPage }: inferParserType<typeof toolsSearchParams>,
    { where, ...args }: Prisma.ToolFindManyArgs,
  ) => {
    const start = performance.now()
    const skip = (page - 1) * perPage
    const take = perPage
    const [sortBy, sortOrder] = (sort?.split(".") ?? []) as [
      keyof Prisma.ToolOrderByWithRelationInput | undefined,
      Prisma.SortOrder | undefined,
    ]

    const whereQuery: Prisma.ToolWhereInput = {
      status: ToolStatus.Published,
      ...(category && { categories: { some: { slug: category } } }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      }),
    }

    const orderBy: Prisma.ToolOrderByWithRelationInput | Prisma.ToolOrderByWithRelationInput[] = 
      sortBy && sortOrder 
        ? { [sortBy]: sortOrder }
        : [{ tier: "desc" }, { publishedAt: "desc" }]

    const [tools, totalCount] = await prisma.$transaction([
      prisma.tool.findMany({
        ...args,
        orderBy,
        where: { ...whereQuery, ...where },
        select: toolManyPayload,
        take,
        skip,
      }),

      prisma.tool.count({
        where: { ...whereQuery, ...where },
      }),
    ])

    console.log("searchTools", performance.now() - start)

    return { tools, totalCount }
  },
  ["tools"],
)

export const findTools = cache(
  async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
    return prisma.tool.findMany({
      ...args,
      where: { status: ToolStatus.Published, ...where },
      orderBy: orderBy ?? [
        { tier: "desc" },
        { publishedAt: "desc" }
      ],
      select: toolManyPayload,
    })
  },
  ["tools"],
)

export const findToolsWithCategories = cache(
  async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
    return prisma.tool.findMany({
      ...args,
      where: { status: ToolStatus.Published, ...where },
      select: toolManyExtendedPayload,
    })
  },
  ["tools"],
)

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countUpcomingTools = cache(
  async ({ where, ...args }: Prisma.ToolCountArgs) => {
    return prisma.tool.count({
      ...args,
      where: { status: { in: [ToolStatus.Scheduled, ToolStatus.Draft] }, ...where },
    })
  },
  ["schedule"],
)

export const findToolBySlug = (slug: string, { where, ...args }: Prisma.ToolFindFirstArgs = {}) =>
  cache(
    async (slug: string) => {
      return prisma.tool.findFirst({
        ...args,
        where: { slug, status: { not: ToolStatus.Draft }, ...where },
        select: toolOnePayload,
      })
    },
    ["tool", `tool-${slug}`],
  )(slug)

export const findRandomTool = async () => {
  const tools = await prisma.$queryRaw<Array<Tool>>`
    SELECT "id", "name", "slug", "website", "tagline", "description", "content",
           "faviconUrl", "screenshotUrl", "status", "publishedAt", "createdAt", "updatedAt"
    FROM "Tool"
    WHERE status = 'Published'
    GROUP BY id
    ORDER BY RANDOM()
    LIMIT 1
  `

  return tools[0]
}
