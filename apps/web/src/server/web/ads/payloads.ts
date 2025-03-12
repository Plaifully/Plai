import type { Ad, AdType, AdPlacement } from "@prisma/client"

export type AdOne = {
  name: string
  description: string | null
  website: string
  faviconUrl: string | null
  type: AdType
  placement: AdPlacement
  imageUrl: string | null
  width: number | null
  height: number | null
}

export type AdMany = {
  id: string
  name: string
  description: string | null
  website: string
  faviconUrl: string | null
  type: AdType
  placement: AdPlacement
  imageUrl: string | null
  width: number | null
  height: number | null
  startsAt: Date
  endsAt: Date
  createdAt: Date
  updatedAt: Date
}

export const adOnePayload = {
  name: true,
  description: true,
  website: true,
  faviconUrl: true,
  type: true,
  placement: true,
  imageUrl: true,
  width: true,
  height: true,
} as const

export const adManyPayload = {
  id: true,
  name: true,
  description: true,
  website: true,
  faviconUrl: true,
  type: true,
  placement: true,
  imageUrl: true,
  width: true,
  height: true,
  startsAt: true,
  endsAt: true,
  createdAt: true,
  updatedAt: true,
} as const
