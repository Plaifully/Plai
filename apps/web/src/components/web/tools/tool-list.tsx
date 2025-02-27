'use client'

import { type ComponentProps, Fragment } from "react"
import { AdCard } from "~/components/web/ads/ad-card"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { ToolMany } from "~/server/web/tools/payloads"
import type { AdOne } from "~/server/web/ads/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
  ads?: AdOne[]
}

const ToolList = ({ tools, ads = [], ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map((tool, index) => (
        <Fragment key={tool.slug}>
          <ToolCard tool={tool} />
          {(index + 1) % 2 === 0 && ads[Math.floor(index / 2)] && (
            <AdCard ad={ads[Math.floor(index / 2)]} />
          )}
        </Fragment>
      ))}

      {!tools.length && <EmptyList>No tools found.</EmptyList>}
    </Grid>
  )
}

const ToolListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <Grid>
      {[...Array(count)].map((_, index) => (
        <ToolCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { ToolList, ToolListSkeleton }
