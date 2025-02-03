'use client'

import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { H4 } from "~/components/common/heading"
import { Badge } from "~/components/web/ui/badge"
import type { AdOne } from "~/server/web/ads/payloads"

type AdCardProps = ComponentProps<typeof Card> & {
  ad: AdOne
  className?: string
}

const AdCard = ({ ad, className, ...props }: AdCardProps) => {
  if (!ad) {
    return <AdCardSkeleton className={className} {...props} />
  }

  return (
    <Card className={className} asChild {...props}>
      <a href={ad.website} target="_blank" rel="noopener noreferrer">
        <CardHeader>
          <Favicon src={ad.faviconUrl} title={ad.name} />
          <H4 as="h3" className="truncate">
            {ad.name}
          </H4>
          <Badge variant="outline" size="sm" className="ml-auto">
            Sponsored
          </Badge>
        </CardHeader>
        {ad.description && <CardDescription>{ad.description}</CardDescription>}
      </a>
    </Card>
  )
}

const AdCardSkeleton = ({ className, ...props }: ComponentProps<typeof Card>) => {
  return <Card className={className} {...props} />
}

export { AdCard, AdCardSkeleton }
