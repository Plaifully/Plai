import { prisma } from "@plai/db"
import type { Prisma } from "@plai/db/client"
import { cache } from "~/lib/cache"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"
import { AdPlacement } from "@prisma/client"

export const findAds = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
    return prisma.ad.findMany({
      ...args,
      orderBy: orderBy ?? { startsAt: "desc" },
      select: adManyPayload,
    })
  },
  ["ads"],
)

export const findAd = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
    return prisma.ad.findFirst({
      ...args,
      orderBy: orderBy ?? { startsAt: "desc" },
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
      select: adOnePayload,
    })
  },
  ["ad"],
  { revalidate: 60 * 60 },
)

export const findHomePageAds = cache(async () => {
  const now = new Date()

  const [agentAds, floatingTopAd, horizontalTopAd, horizontalBottomAd] = await Promise.all([
    // Fetch ads for agent listings - these will be mixed with tools
    prisma.ad.findMany({
      where: {
        placement: AdPlacement.Agent,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      select: adOnePayload,
    }),

    // Fetch one floating top banner (above header)
    prisma.ad.findFirst({
      where: {
        placement: AdPlacement.FloatingTop,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: adOnePayload,
    }),

    // Fetch one horizontal top banner (below filters)
    prisma.ad.findFirst({
      where: {
        placement: AdPlacement.HorizontalTop,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: adOnePayload,
    }),

    // Fetch one horizontal bottom banner (after last row)
    prisma.ad.findFirst({
      where: {
        placement: AdPlacement.HorizontalBottom,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: adOnePayload,
    }),
  ])

  return {
    agentAds,
    floatingTopAd,
    horizontalTopAd,
    horizontalBottomAd,
  }
}, ["homepage-ads"], { revalidate: 60 * 60 })
