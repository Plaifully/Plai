import { env } from "~/env"

export const siteConfig = {
  name: "Plaiful",
  tagline: "Plaiful - Find and hire the perfect AI agent", // Deprecated -> This is now hardcoded in the homepage
  description:
    "Finding an agent has never been easier",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",
  toolsPerPage: 35,
  alternativesPerPage: 54,

  affiliateUrl: "https://go.plai.co",
}
