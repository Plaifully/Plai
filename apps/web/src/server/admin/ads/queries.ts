import { isTruthy } from "@curiousleaf/utils"
import { prisma } from "@plai/db"
import { type Prisma, AdType } from "@plai/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { cache } from "~/lib/cache"
import { searchParamsSchema } from "./validations"

export const findAds = cache(
  async (searchParams: SearchParams) => {
    const search = searchParamsSchema.parse(searchParams)
    const { page, per_page, sort, name, type, operator, from, to } = search

    // Offset to paginate the results
    const offset = (page - 1) * per_page

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? ["createdAt", "desc"]) as [
      keyof Prisma.AdOrderByWithRelationInput | undefined,
      "asc" | "desc" | undefined,
    ]

    // Convert the date strings to date objects
    const fromDate = from ? startOfDay(new Date(from)) : undefined
    const toDate = to ? endOfDay(new Date(to)) : undefined

    const expressions: (Prisma.AdWhereInput | undefined)[] = [
      // Filter by name
      name ? { name: { contains: name, mode: "insensitive" } } : undefined,

      // Filter by type
      type ? { type: type as AdType } : undefined,

      // Filter by createdAt
      fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
    ]

    const where: Prisma.AdWhereInput = {
      [operator]: expressions.filter(isTruthy),
    }

    // Transaction is used to ensure both queries are executed in a single transaction
    const [ads, adsTotal] = await prisma.$transaction([
      prisma.ad.findMany({
        where,
        orderBy: column ? { [column]: order } : undefined,
        take: per_page,
        skip: offset,
      }),

      prisma.ad.count({
        where,
      }),
    ])

    const pageCount = Math.ceil(adsTotal / per_page)
    return { ads, adsTotal, pageCount }
  },
  ["admin-ads", "ads"],
)

export const findAdById = (id: string) =>
  cache(
    async (id: string) => {
      return prisma.ad.findUnique({
        where: { id },
        include: {
          categories: true
        }
      })
    },
    [`ad-${id}`],
  )(id) 