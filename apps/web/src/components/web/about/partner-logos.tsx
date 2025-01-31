"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ExternalLink } from "~/components/web/external-link"

const aiPartners = [
  {
    name: "OpenAI",
    logo: "/openai-logo.png",
    url: "https://openai.com",
  },
  {
    name: "Perplexity",
    logo: "/perplexity-logo.png",
    url: "https://perplexity.ai",
  },
  {
    name: "Grok",
    logo: "/grok-logo.png",
    url: "https://grok.x.ai",
  },
]

export function PartnerLogos() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const getLogoClass = (partnerName: string) => {
    const baseClasses = "h-10 w-auto object-contain border-none"
    if (!isDark) return baseClasses

    // Only Perplexity needs special treatment
    if (partnerName === "Perplexity") {
      return `${baseClasses} brightness-0 invert`
    }
    
    // Simple inversion for other logos
    return `${baseClasses} invert`
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-8 py-8">
        {aiPartners.map((partner) => (
          <div
            key={partner.name}
            className="flex items-center justify-center"
          >
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={2200}
              height={598}
              className="h-10 w-auto object-contain border-none"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-8 py-8">
      {aiPartners.map((partner) => (
        <ExternalLink
          key={partner.name}
          href={partner.url}
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={2200}
            height={598}
            className={getLogoClass(partner.name)}
          />
        </ExternalLink>
      ))}
    </div>
  )
} 