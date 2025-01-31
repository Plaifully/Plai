import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryListing } from "~/app/(web)/categories/(categories)/listing"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "AI Agents Categories",
  description: "Browse top categories to find your best AI Agents options.",
  openGraph: { ...metadataConfig.openGraph, url: "/categories" },
  alternates: { ...metadataConfig.alternates, canonical: "/categories" },
}

export default function Categories() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListing />
      </Suspense>
    </>
  )
}
