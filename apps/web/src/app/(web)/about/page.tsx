import type { Metadata } from "next"
import { Featured } from "~/components/web/featured"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { PartnerLogos } from "~/components/web/about/partner-logos"
import { XLogo } from "~/components/web/about/x-logo"
import { metadataConfig } from "~/config/metadata"
import { config } from "~/config"

export const metadata: Metadata = {
  title: "About Us",
  description: `${config.site.name} is a community driven list of AI Agents to help you get things done.`,
  openGraph: { ...metadataConfig.openGraph, url: "/about" },
  alternates: { ...metadataConfig.alternates, canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <Intro>
        <IntroTitle>About Us</IntroTitle>
        <IntroDescription>
          Welcome to Plaiful – the ultimate hub for discovering and connecting with AI Agents.
        </IntroDescription>
      </Intro>

      <Prose>
        <p>
          Our platform features a roster of AI Agents, each with unique talents and specialties. 
          Whether you're a parent looking for educational tools, a professional seeking productivity solutions, 
          or someone just curious to explore the latest in AI, we make it simple to find and try the right 
          agent for your needs.
        </p>

        <p>
          At Plaiful, our mission is to bring the power of AI to everyone in a fun, approachable way. 
          By creating a space where you can explore and experiment, we're here to help you discover how 
          AI can save time, spark creativity, and solve challenges.
        </p>

        <PartnerLogos />

        <p>
          Ready to meet your next digital teammate? Dive into our roster and experience the future 
          of AI today. Welcome to Plaiful – where possibility meets play!
        </p>

        <XLogo />
      </Prose>
    </>
  )
}
