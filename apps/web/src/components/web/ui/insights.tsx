import { Slot } from "@radix-ui/react-slot"
import { type HTMLAttributes, type ReactNode, isValidElement } from "react"
import { cx } from "~/utils/cva"

type InsightsProps = HTMLAttributes<HTMLElement> & {
  insights: {
    label: string
    value: ReactNode
    icon?: ReactNode
  }[]
}

export const Insights = ({ className, insights, ...props }: InsightsProps) => {
  return (
    <ul className={cx("w-full text-xs", className)} {...props}>
      {insights.map(({ label, value, icon }) => {
        const valueComp = isValidElement(value) ? value : <span>{value}</span>
        return (
          <li key={label} className="flex items-center gap-3 py-1">
            <p className="flex items-center min-w-0 gap-1.5 text-muted">
              <Slot className="size-3.5 shrink-0 opacity-75">{icon}</Slot>
              <span className="flex-1 truncate">{label}</span>
            </p>

            <hr className="min-w-2 flex-1 border-dotted border-muted" />

            <Slot className="shrink-0 tabular-nums font-medium text-foreground">
              {valueComp}
            </Slot>
          </li>
        )
      })}
    </ul>
  )
}
