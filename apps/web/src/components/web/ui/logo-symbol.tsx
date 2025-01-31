"use client"

import type { ComponentProps } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const LogoSymbol = ({ className, ...props }: ComponentProps<"svg">) => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Image 
        src="/plaiful-logo-white.png"
        alt="Logo" 
        width={18} 
        height={18} 
        className={className}
      />
    )
  }

  return (
    <Image 
      src={!isDark ? "/plaiful-logo-black.png" : "/plaiful-logo-white.png"} 
      alt="Logo" 
      width={18} 
      height={18} 
      className={className}
    />
  )
}
