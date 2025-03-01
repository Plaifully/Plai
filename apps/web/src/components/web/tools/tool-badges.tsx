import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import { ClockIcon, ZapIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import type { ToolMany, ToolManyExtended } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany | ToolManyExtended
  size?: "sm" | "md"
}

export const ToolBadges = ({ tool, size, children, className, ...props }: ToolBadgesProps) => {
  const publishedAt = tool.publishedAt
  const now = new Date().toISOString()

  const publishedDiff = publishedAt ? differenceInDays(new Date(now), new Date(publishedAt)) : null

  const isNew = publishedDiff !== null && publishedDiff <= 30 && publishedDiff >= 0
  const isScheduled = publishedAt !== null && publishedAt > new Date(now)

  return (
    <TooltipProvider delayDuration={500} disableHoverableContent>
      <Stack size={size} className={cx("flex-nowrap justify-end text-lg", className)} {...props}>
        {isNew && (
          <Tooltip tooltip="Published in the last 30 days">
            <div className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-md px-1.5 py-0.5 shadow-sm">
              <ZapIcon className="size-3 mr-0.5 stroke-[3]" />
              NEW
            </div>
          </Tooltip>
        )}

        {isScheduled && (
          <Tooltip tooltip={`Scheduled for ${formatDate(publishedAt)}`}>
            <ClockIcon className="text-yellow-500" />
          </Tooltip>
        )}

        {children}
      </Stack>
    </TooltipProvider>
  )
}
