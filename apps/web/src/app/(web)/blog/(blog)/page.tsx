import type { Metadata } from "next"
import { Suspense } from "react"
import { BlogListing } from "~/app/(web)/blog/(blog)/listing"
import { PostListSkeleton } from "~/components/web/posts/post-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "A collection of useful articles for developers and AI Agents enthusiasts. Learn about the latest trends and technologies in the AI Agents community.",
  openGraph: { ...metadataConfig.openGraph, url: "/blog" },
  alternates: { ...metadataConfig.alternates, canonical: "/blog" },
}

export default function BlogPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<PostListSkeleton />}>
        <BlogListing />
      </Suspense>
    </>
  )
} 