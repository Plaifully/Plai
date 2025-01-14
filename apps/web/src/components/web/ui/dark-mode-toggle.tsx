"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/10">
        <span className="sr-only">Toggle dark mode</span>
      </button>
    )
  }

  return (
    <button
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      <motion.span
        initial={false}
        animate={{
          x: isDark ? 24 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className="inline-flex h-4 w-4 transform items-center justify-center rounded-full 
          bg-primary"
      />
      <span className="absolute inset-1.5 flex items-center justify-between text-[10px] text-white">
        <motion.span
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
          }}
          transition={{
            duration: 0.2
          }}
        >
          <SunIcon fill="white" className="h-3 w-3" />
        </motion.span>
        <motion.span
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
          }}
          transition={{
            duration: 0.2
          }}
        >
          <MoonIcon fill="white" className="h-3 w-3" />
        </motion.span>
      </span>
    </button>
  )
} 