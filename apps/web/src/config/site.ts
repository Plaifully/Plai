import { env } from "~/env"

export const siteConfig = {
  name: "Plaiful",
  tagline: "Plaiful - Find the perfect AI agent",
  description:
    "Discover more with our curated collection of the best AI agents across dozens of categories and use cases.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",
  toolsPerPage: 35,
  alternativesPerPage: 54,

  affiliateUrl: "https://go.plai.co",
}
