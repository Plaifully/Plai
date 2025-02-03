import { HashIcon, TagIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Badge } from "~/components/web/ui/badge"
import { Card, CardDescription, CardHeader, CardFooter } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { Insights } from "~/components/web/ui/insights"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const insights = [
    {
      label: "Category",
      value: tool.categories?.[0]?.name ?? "Uncategorized",
      icon: <HashIcon className="size-3.5" />,
    },
    {
      label: "Pricing",
      value: tool.pricingType ?? "Free",
      icon: <TagIcon className="size-3.5" />,
    },
  ]

  return (
    <Card asChild {...props}>
      <Link href={`/${tool.slug}`} prefetch={false}>
        <CardHeader>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          <ToolBadges tool={tool} size="sm" className="ml-auto text-base">
            {tool.discountAmount && <Badge variant="success">Get {tool.discountAmount}!</Badge>}
          </ToolBadges>
        </CardHeader>

        {tool.tagline && <CardDescription>{tool.tagline}</CardDescription>}

        <CardFooter className="mt-auto pt-4 w-full">
          <Insights insights={insights} />
        </CardFooter>
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { 
      label: "Category",
      value: <Skeleton className="h-3.5 w-16" />,
      icon: <HashIcon className="size-3.5" />
    },
    {
      label: "Pricing",
      value: <Skeleton className="h-3.5 w-14" />,
      icon: <TagIcon className="size-3.5" />
    },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <CardFooter className="mt-auto pt-4 w-full">
        <Insights insights={insights} className="w-full text-xs animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
