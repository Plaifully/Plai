import type { Metadata } from "next"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "About Us",
  description: "Welcome to Plaiful – the ultimate hub for discovering and connecting with AI Agents.",
  openGraph: { ...metadataConfig.openGraph, url: "/about" },
  alternates: { ...metadataConfig.alternates, canonical: "/about" },
} 