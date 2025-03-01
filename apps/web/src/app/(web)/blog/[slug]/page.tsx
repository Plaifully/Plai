import { formatDate, getReadTime } from "@curiousleaf/utils"
import { AdType } from "@plai/db/client"
import { AdPlacement } from "@prisma/client"
import { type Post, allPosts } from "content-collections"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { AdBanner, AdBannerSkeleton } from "~/components/web/ads/ad-banner"
import {
  AlternativePreview,
  AlternativePreviewSkeleton,
} from "~/components/web/alternatives/alternative-preview"
import { MDX } from "~/components/web/mdx"
import { ShareButtons } from "~/components/web/share-buttons"
import { Author } from "~/components/web/ui/author"
import { Image } from "~/components/web/ui/image"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const findPostBySlug = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const post = allPosts.find(({ _meta }) => _meta.path === slug)

  if (!post) {
    notFound()
  }

  return post
})

export const generateStaticParams = () => {
  return allPosts.map(({ _meta }) => ({ slug: _meta.path }))
}

const getMetadata = (post: Post): Metadata => {
  return {
    title: post.title,
    description: post.description,
  }
}

export const generateMetadata = async (props: PageProps) => {
  const post = await findPostBySlug(props)
  const url = `/blog/${post._meta.path}`

  return {
    ...getMetadata(post),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function BlogPostPage(props: PageProps) {
  const [
    post, 
    agentAd, 
    verticalRightAd, 
    horizontalTopAd, 
    horizontalBottomAd
  ] = await Promise.all([
    findPostBySlug(props),
    findAd({ where: { type: AdType.BlogPost, placement: AdPlacement.Agent } }),
    findAd({ where: { type: AdType.BlogPost, placement: AdPlacement.VerticalRight } }),
    findAd({ where: { type: AdType.BlogPost, placement: AdPlacement.HorizontalTop } }),
    findAd({ where: { type: AdType.BlogPost, placement: AdPlacement.HorizontalBottom } }),
  ])

  return (
    <>
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
        <Section>
          <Section.Content>
            <Intro className="w-full">
              <IntroTitle>{post.title}</IntroTitle>
              <IntroDescription>{post.description}</IntroDescription>

              <Stack className="mt-2 text-sm text-muted">
                {/* <Badge size="lg" variant="outline">Uncategorized</Badge> */}

                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="">
                    {formatDate(post.publishedAt)}
                  </time>
                )}

                <span className="-mx-1">&bull;</span>

                <span>{getReadTime(post.content)} min read</span>
              </Stack>
            </Intro>

            {/* Horizontal Top Banner Ad */}
            {horizontalTopAd && (
              <Suspense fallback={<AdBannerSkeleton orientation="horizontal" />}>
                <AdBanner ad={horizontalTopAd as AdOne} orientation="horizontal" />
              </Suspense>
            )}
            
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={1920}
                height={1080}
                className="w-full h-auto aspect-video object-cover rounded-lg"
              />
            )}

            <MDX code={post.content} />

            {/* Horizontal Bottom Banner Ad */}
            {horizontalBottomAd && (
              <Suspense fallback={<AdBannerSkeleton orientation="horizontal" />}>
                <AdBanner ad={horizontalBottomAd as AdOne} orientation="horizontal" />
              </Suspense>
            )}

            <ShareButtons title={post.title} />
          </Section.Content>

          <Section.Sidebar>
            <Stack direction="column">
              <H6 as="strong" className="text-muted">
                Written by
              </H6>

              <a
                href={`https://twitter.com/${post.author.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group"
              >
                <Author
                  name={post.author.name}
                  image={post.author.image}
                  title={`@${post.author.twitterHandle}`}
                />
              </a>
            </Stack>

            {/* <TOC title="On this page" content={post.content} className="flex-1 overflow-y-auto" /> */}

            {/* Agent Advertisement */}
            <Suspense fallback={<AdCardSkeleton />}>
              <AdCard ad={agentAd as AdOne} />
            </Suspense>
            
            {/* Vertical Right Banner Ad */}
            {verticalRightAd && (
              <Suspense fallback={<AdBannerSkeleton orientation="vertical" />}>
                <AdBanner 
                  ad={verticalRightAd as AdOne} 
                  orientation="vertical" 
                />
              </Suspense>
            )}
          </Section.Sidebar>
        </Section>
      </div>
    </>
  )
}
