'use client'

import type { ComponentProps } from "react"
import type { AdOne } from "~/server/web/ads/payloads"
import { FloatingBannerAd, HorizontalBannerAd, VerticalBannerAd } from "./banner-ads"

type AdPlacementProps = ComponentProps<"div"> & {
  ad: AdOne
  className?: string
}

export const AdPlacement = ({ ad, className, ...props }: AdPlacementProps) => {
  if (!ad) {
    return null
  }

  switch (ad.placement) {
    case "FloatingTop":
      return <FloatingBannerAd ad={ad} className={className} {...props} />
    case "HorizontalTop":
    case "HorizontalMiddle":
    case "HorizontalBottom":
      return <HorizontalBannerAd ad={ad} className={className} {...props} />
    case "VerticalLeft":
    case "VerticalRight":
      return <VerticalBannerAd ad={ad} className={className} {...props} />
    default:
      return null
  }
} 