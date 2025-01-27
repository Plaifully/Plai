"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ExternalLink } from "~/components/web/external-link"

export function XLogo() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex justify-center py-8">
      <ExternalLink
        href="https://x.com/plaiful"
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/twitter-logo.png"
          alt="Follow Plaiful on X"
          width={32}
          height={32}
          className={`border-none ${isDark ? "invert" : ""}`}
        />
      </ExternalLink>
    </div>
  )
} 