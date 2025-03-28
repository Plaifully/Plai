"use client"

import { cx } from "cva"
import {
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SparklesIcon,
  FileTextIcon,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Nav } from "~/components/admin/nav"
import { NavMain } from "~/components/admin/nav-main"
import { Separator } from "~/components/admin/ui/separator"
import { siteConfig } from "~/config/site"
import { useIsMobile } from "~/hooks/use-mobile"

export const Sidebar = () => {
  const isMobile = useIsMobile()

  return (
    <div
      className={cx("sticky top-0 h-dvh z-40 flex flex-col border-r", isMobile ? "w-12" : "w-48")}
    >
      <Nav>
        <NavMain
          isCollapsed={isMobile}
          links={[
            {
              title: "Dashboard",
              href: "/admin",
              prefix: <LayoutDashboardIcon />,
            },
          ]}
        />
      </Nav>

      <Separator />

      <Nav>
        <NavMain
          isCollapsed={isMobile}
          links={[
            {
              title: "Tools",
              href: "/admin/tools",
              prefix: <GemIcon />,
            },
            {
              title: "Categories",
              href: "/admin/categories",
              prefix: <GalleryHorizontalEndIcon />,
            },
            {
              title: "Ads",
              href: "/admin/ads",
              prefix: <SparklesIcon />,
            },
            {
              title: "Blog",
              href: "/admin/blog",
              prefix: <FileTextIcon />,
            },
          ]}
        />
      </Nav>

      <Nav className="mt-auto">
        <NavMain
          isCollapsed={isMobile}
          links={[
            {
              title: "Visit Site",
              href: siteConfig.url,
              prefix: <GlobeIcon />,
            },
            {
              title: "Sign Out",
              href: "#",
              onClick: () => signOut(),
              prefix: <LogOutIcon />,
            },
          ]}
        />
      </Nav>
    </div>
  )
}
