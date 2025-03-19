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
  // If no tools, show empty state
  if (!tools.length) {
    return (
      <Grid {...props}>
        <EmptyList>No tools found.</EmptyList>
      </Grid>
    );
  }

  // Create a copy of tools array to manipulate
  const toolsToRender = [...tools];

  return (
    <>
      {/* Mobile-first ad placement - show at the top */}
      {ads[0] && (
        <div className="md:hidden mb-5">
          <AdCard ad={ads[0]} />
        </div>
      )}

      <Grid {...props}>
        {/* First two tools in the first row */}
        {toolsToRender.slice(0, 2).map((tool, index) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
        
        {/* Desktop ad placement - top right position (3rd column, 1st row) */}
        {ads[0] && (
          <div className="hidden md:block">
            <AdCard ad={ads[0]} />
          </div>
        )}
        
        {/* Remaining tools */}
        {toolsToRender.slice(2).map((tool, index) => {
          // For remaining ads (after the first one)
          const adjustedIndex = index + 2; // Adjust index to account for first 2 tools
          const isThirdColumn = ((adjustedIndex + 1) % 3 === 0); // +1 because we've already placed an ad
          const adIndex = Math.floor(adjustedIndex / 3);
          const showDesktopAd = isThirdColumn && ads[adIndex] && adIndex > 0; // adIndex > 0 to skip first ad

          return (
            <Fragment key={tool.slug}>
              <ToolCard tool={tool} />
              
              {/* Additional desktop ad placements */}
              {showDesktopAd && (
                <div className="hidden md:block">
                  <AdCard ad={ads[adIndex]} />
                </div>
              )}
            </Fragment>
          );
        })}
      </Grid>
    </>
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
