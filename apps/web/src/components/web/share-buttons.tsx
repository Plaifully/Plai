"use client"

import { usePathname } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"
import { H5 } from "~/components/common/heading"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandFacebookIcon } from "~/components/common/icons/brand-facebook"
import { BrandHackerNewsIcon } from "~/components/common/icons/brand-hackernews"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandRedditIcon } from "~/components/common/icons/brand-reddit"
import { BrandWhatsAppIcon } from "~/components/common/icons/brand-whatsapp"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { Button } from "~/components/web/ui/button"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import { config } from "~/config"

type Platform = "X" | "Bluesky" | "Facebook" | "LinkedIn" | "HackerNews" | "Reddit" | "WhatsApp"

type ShareOption = {
  platform: Platform
  url: (shareUrl: string, shareTitle: string) => string
  icon: ReactNode
}

const shareOptions: ShareOption[] = [
  {
    platform: "X",
    url: (url, title) => `https://x.com/intent/post?text=${title}&url=${url}`,
    icon: <BrandXIcon />,
  }
]

type ShareButtonsProps = Omit<ComponentProps<"div">, "title"> & {
  title: string
}

export const ShareButtons = ({ title, ...props }: ShareButtonsProps) => {
  const pathname = usePathname()

  const currentUrl = encodeURIComponent(`${config.site.url}${pathname}`)
  const shareTitle = encodeURIComponent(`${title} — ${config.site.name}`)

  return (
    <Stack {...props}>
      <H5 as="strong">Share:</H5>

      <Stack size="sm">
        <TooltipProvider delayDuration={500} disableHoverableContent>
          {shareOptions.map(({ platform, url, icon }) => (
            <Tooltip key={platform} tooltip={platform}>
              <Button size="sm" variant="secondary" prefix={icon} isAffixOnly asChild>
                <ExternalLink
                  href={url(currentUrl, shareTitle)}
                  eventName="click_share"
                  eventProps={{ url: currentUrl, platform }}
                />
              </Button>
            </Tooltip>
          ))}
        </TooltipProvider>
      </Stack>
    </Stack>
  )
}
