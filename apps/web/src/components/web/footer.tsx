import { formatNumber } from "@curiousleaf/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import Link from "next/link"
import type { HTMLAttributes } from "react"
import { H5, H6 } from "~/components/common/heading"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { NewsletterForm } from "~/components/web/newsletter-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/web/ui/dropdown-menu"
import { Image } from "~/components/web/ui/image"
import { NavLink } from "~/components/web/ui/nav-link"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import { config } from "~/config"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

type FooterProps = HTMLAttributes<HTMLElement> & {
  hideNewsletter?: boolean
}

export const Footer = ({ children, className, hideNewsletter, ...props }: FooterProps) => {
  return (
    <footer className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-foreground/10 md:pt-10 lg:pt-12">
      <div
        className={cx(
          "grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-[repeat(16,minmax(0,1fr))]",
          className,
        )}
        {...props}
      >
        <Stack
          direction="column"
          className="flex flex-col items-start gap-4 col-span-full md:col-span-6"
        >
          <Stack size="lg" direction="column" className="min-w-0 max-w-64">
            <H5 as="strong" className="px-0.5 font-medium">
              Subscribe to our newsletter
            </H5>

            <p className="-mt-2 px-0.5 text-sm text-muted first:mt-0">
              Join our founders mom and other agentic enthusiasts
            </p>

            <NewsletterForm medium="footer_form" />
          </Stack>

          <Stack className="text-sm/normal">
            <TooltipProvider delayDuration={500} disableHoverableContent>
              {/* <DropdownMenu modal={false}>
                <Tooltip tooltip="RSS Feeds">
                  <DropdownMenuTrigger aria-label="RSS Feeds" {...props}>
                    <RssIcon className="size-[1.44em] stroke-[1.25] text-muted hover:text-foreground" />
                  </DropdownMenuTrigger>
                </Tooltip>

                <DropdownMenuContent align="start" side="top">
                  {config.links.feeds.map(({ url, title }) => (
                    <DropdownMenuItem key={url} asChild>
                      <Link href={url} target="_blank" rel="nofollow noreferrer" prefetch={false}>
                        RSS &raquo; {title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu> */}

              <Tooltip tooltip="Contact us">
                <NavLink
                  href={`mailto:${config.site.email}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Contact us"
                >
                  <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on X/Twitter">
                <NavLink href={config.links.twitter} target="_blank" rel="nofollow noreferrer">
                  <BrandXIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip>

              {/* <Tooltip tooltip="Follow us on LinkedIn">
                <NavLink href={config.links.linkedin} target="_blank" rel="nofollow noreferrer">
                  <BrandLinkedInIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip> */}

              <Tooltip tooltip="View source code">
                <NavLink href={config.links.github} target="_blank" rel="nofollow noreferrer">
                  <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
                </NavLink>
              </Tooltip>
            </TooltipProvider>
          </Stack>
          <div className="flex flex-row flex-wrap items-end gap-x-4 w-full">
            <p className="text-xs text-muted">This website may contain affiliate links</p>
          </div>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>
          <NavLink href="/?sort=publishedAt.desc">Latest Tools</NavLink>
          <NavLink href="/categories">Categories</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
          <NavLink href="/submit">Add a Free Listing</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <Stack direction="column">
            <H6 as="strong">Legal:</H6>
            <NavLink href="/privacy-policy">Privacy Policy</NavLink>
            <NavLink href="/terms-and-conditions">Terms and Conditions</NavLink>
          </Stack>
        </Stack>
      </div>

      {children}
    </footer>
  )
}
