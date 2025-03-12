'use client'

import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader, CardFooter } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { H4 } from "~/components/common/heading"
import type { AdOne } from "~/server/web/ads/payloads"
import { cx } from "~/utils/cva"
import Link from "next/link"

type AdCardProps = ComponentProps<typeof Card> & {
  ad: AdOne
  className?: string
}

const AdCard = ({ ad, className, ...props }: AdCardProps) => {
  if (!ad) {
    return <AdCardSkeleton className={className} {...props} />
  }

  return (
    <Card 
      className={cx(
        "relative overflow-hidden border-2 border-orange-500 h-full flex flex-col", 
        className
      )} 
      style={{ animation: 'var(--animate-pulse-border)' }}
      asChild 
      {...props}
    >
      <Link href={ad.website} target="_blank" rel="noopener noreferrer" className="h-full flex flex-col">
        <CardHeader>
          <Favicon src={ad.faviconUrl} title={ad.name} />
          <H4 as="h3" className="truncate">
            {ad.name}
          </H4>
          {ad.description && (
            <CardDescription className="flex-grow min-h-[3rem]">
              {ad.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="mt-auto pt-4">
          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-sm font-medium">
            Sponsored
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

const AdCardSkeleton = ({ className, ...props }: ComponentProps<typeof Card>) => {
  return <Card className={cx("border-muted/30 h-full flex flex-col", className)} {...props} />
}

export { AdCard, AdCardSkeleton }
