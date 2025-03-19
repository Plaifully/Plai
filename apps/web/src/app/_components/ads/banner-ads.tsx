'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ComponentProps } from "react"
import type { AdOne } from "~/server/web/ads/payloads"
import { cx } from "~/utils/cva"

type BannerAdProps = ComponentProps<"div"> & {
  ad: AdOne
  className?: string
}

// Floating banner that sits above the header
export const FloatingBannerAd = ({ ad, className, ...props }: BannerAdProps) => {
  if (!ad) {
    return null
  }

  return (
    <div 
      className={cx(
        "w-full py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )} 
      {...props}
    >
      <div className="relative w-full max-w-[64rem] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={ad.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3 bg-[#1C1C1C] hover:bg-[#242424] transition-colors rounded-b-xl border border-[#2A2A2A] px-3 sm:px-6 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative">
            <div className="text-xs font-medium bg-[#141414] text-white/80 px-2 py-0.5 rounded-md border border-[#2C2C2C]">Ad</div>
            
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {ad.faviconUrl && (
                  <Image
                    src={ad.faviconUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 flex-shrink-0"
                  />
                )}
                <span className="text-sm font-medium text-white/90 truncate">{ad.name}</span>
              </div>
              {ad.description && (
                <div className="hidden md:flex items-center">
                  <span className="text-white/30 mx-1.5">—</span>
                  <span className="text-sm text-white/50 truncate">{ad.description}</span>
                </div>
              )}
            </div>

            <div className="text-xs font-medium bg-[#141414] text-white/90 hover:bg-[#1A1A1A] px-2 sm:px-3 py-1 rounded-md transition-colors border border-[#2C2C2C] whitespace-nowrap flex-shrink-0">
              Learn More
            </div>
          </div>
        </Link>
      </div>
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
      <Link
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
      </Link>
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
      <Link
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
      </Link>
    </div>
  )
} 