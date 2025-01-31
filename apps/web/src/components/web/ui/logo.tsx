import Link from "next/link"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Logo = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack size="sm" className={cx("group/logo text-foreground gap-0  ", className)} asChild {...props}>
      <Link className="gap-2" href="/" prefetch={false}>
        <LogoSymbol className="duration-300! ease-in-out! will-change-transform group-hover/logo:rotate-90" />
        <span className="font-medium text-sm">{config.site.name}</span>
      </Link>
    </Stack>
  )
}
