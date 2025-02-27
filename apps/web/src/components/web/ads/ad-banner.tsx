'use client'

import type { ComponentProps } from "react"
import { ExternalLink } from "~/components/web/external-link"
import { Image } from "~/components/web/ui/image"
import type { AdOne } from "~/server/web/ads/payloads"
import { cx } from "~/utils/cva"

type AdBannerProps = {
  ad: AdOne
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const AdBanner = ({ ad, className, orientation = 'horizontal', ...props }: AdBannerProps) => {
  if (!ad) {
    return <AdBannerSkeleton className={className} orientation={orientation} />
  }

  return (
    <div className={cx("w-full", orientation === 'horizontal' ? "my-6 px-4 md:px-0" : "mt-4", className)}>
      <ExternalLink 
        href={ad.website}
        className={cx(
          "block", 
          orientation === 'horizontal' ? "mx-auto max-w-[728px]" : ""
        )}
        eventName={`click_${orientation}_ad`}
        eventProps={{ adName: ad.name }}
      >
        <div className="relative overflow-hidden rounded-md border border-border">
          <Image 
            src={ad.imageUrl || ''}
            alt={ad.name} 
            width={ad.width || (orientation === 'horizontal' ? 728 : 120)} 
            height={ad.height || (orientation === 'horizontal' ? 90 : 600)}
            className="w-full h-auto"
          />
          <div className="absolute top-1 left-1 bg-background/80 text-xs px-1 py-0.5 rounded text-muted-foreground">
            Sponsored
          </div>
        </div>
      </ExternalLink>
    </div>
  )
}

export const AdBannerSkeleton = ({ 
  className, 
  orientation = 'horizontal' 
}: { 
  className?: string, 
  orientation?: 'horizontal' | 'vertical' 
}) => {
  return (
    <div className={cx(
      "w-full", 
      orientation === 'horizontal' ? "my-6 px-4 md:px-0" : "mt-4", 
      className
    )}>
      <div className={cx(
        orientation === 'horizontal' ? "mx-auto max-w-[728px] h-[90px]" : "w-full h-[600px]", 
        "rounded-md border border-border bg-muted/20 animate-pulse"
      )}></div>
    </div>
  )
}
