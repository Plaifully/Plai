'use client'

import Image from 'next/image'
import type { ComponentProps } from "react"
import type { AdOne } from "~/server/web/ads/payloads"
import { cx } from "~/utils/cva"

type BannerAdProps = ComponentProps<"div"> & {
  ad: AdOne
  className?: string
}

// Floating banner that sticks to the top of the screen
export const FloatingBannerAd = ({ ad, className, ...props }: BannerAdProps) => {
  if (!ad || !ad.imageUrl) {
    return null
  }

  return (
    <div 
      className={cx(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "flex justify-center items-center py-2 border-b",
        className
      )} 
      {...props}
    >
      <a 
        href={ad.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={ad.imageUrl}
          alt={ad.description || `Advertisement for ${ad.name}`}
          width={ad.width || 728}
          height={ad.height || 90}
          className="mx-auto"
          priority
        />
      </a>
    </div>
  )
}

// Horizontal banner that sits within the content flow
export const HorizontalBannerAd = ({ ad, className, ...props }: BannerAdProps) => {
  if (!ad || !ad.imageUrl) {
    return null
  }

  return (
    <div 
      className={cx(
        "w-full flex justify-center items-center py-4",
        className
      )} 
      {...props}
    >
      <a 
        href={ad.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={ad.imageUrl}
          alt={ad.description || `Advertisement for ${ad.name}`}
          width={ad.width || 728}
          height={ad.height || 90}
          className="mx-auto"
          priority
        />
      </a>
    </div>
  )
}

// Vertical banner that sits on the side
export const VerticalBannerAd = ({ ad, className, ...props }: BannerAdProps) => {
  if (!ad || !ad.imageUrl) {
    return null
  }

  return (
    <div 
      className={cx(
        "flex justify-center items-start py-4",
        className
      )} 
      {...props}
    >
      <a 
        href={ad.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={ad.imageUrl}
          alt={ad.description || `Advertisement for ${ad.name}`}
          width={ad.width || 160}
          height={ad.height || 600}
          className="mx-auto"
          priority
        />
      </a>
    </div>
  )
} 