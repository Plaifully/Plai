import { AdType, ToolTier } from "@plai/db/client"
import { HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import type { ImageObject } from "schema-dts"
import { FeaturedTools } from "~/app/(web)/[slug]/featured-tools"
import { H1, H5 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { ShareButtons } from "~/components/web/share-buttons"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { FaviconImage } from "~/components/web/ui/favicon"
import { Image } from "~/components/web/ui/image"
import { IntroDescription } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Tag } from "~/components/web/ui/tag"
import { metadataConfig } from "~/config/metadata"
import { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findToolBySlug, findToolSlugs } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne): Metadata => {
  return {
    title: `${tool.name}`,
    description: tool.description,
  }
}

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({})
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/${tool.slug}`

  return {
    ...getMetadata(tool),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { url, type: "website" },
  }
}

export default async function ToolPage(props: PageProps) {
  const [tool, ad] = await Promise.all([
    getTool(props),
    findAd({ where: { type: AdType.ToolPage } }),
  ])
  const { title } = getMetadata(tool)
  const jsonLd: ImageObject[] = []

  if (tool.screenshotUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: tool.screenshotUrl,
      contentUrl: tool.screenshotUrl,
      width: "1280",
      height: "720",
      caption: `A screenshot of ${tool.name}`,
    })
  }

  if (tool.faviconUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: tool.faviconUrl,
      contentUrl: tool.faviconUrl,
      width: "144",
      height: "144",
      caption: `A favicon of ${tool.name}`,
    })
  }

  return (
    <div className="flex flex-col gap-12">
      <Section>
        <Section.Content className="max-md:contents">
          <div className="flex flex-1 flex-col items-start gap-4 max-md:order-1 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <FaviconImage src={tool.faviconUrl} title={tool.name} />

                <div className="flex flex-1">
                  <H1 className="!leading-snug truncate">{tool.name}</H1>
                </div>

                <ToolBadges tool={tool}>
                  {tool.discountAmount && (
                    <Badge size="lg" variant="success">
                      {tool.discountCode
                        ? `Use code ${tool.discountCode} for ${tool.discountAmount}!`
                        : `Get ${tool.discountAmount} with our link!`}
                    </Badge>
                  )}
                </ToolBadges>
              </Stack>

              {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
            </div>

            <Stack size="sm">
              {tool.website && (
                <Button asChild>
                  <ExternalLink
                    href={tool.website}
                    rel={tool.tier === ToolTier.Featured ? "noopener noreferrer" : undefined}
                    eventName="click_website"
                    eventProps={{ url: tool.website }}
                  >
                    Visit {tool.name}
                  </ExternalLink>
                </Button>
              )}
            </Stack>
          </div>

          {tool.screenshotUrl && (
            <Image
              key={tool.screenshotUrl}
              src={tool.screenshotUrl}
              alt={`A screenshot of ${tool.name}`}
              width={1280}
              height={1024}
              loading="lazy"
              className="aspect-video h-auto w-full rounded-md border object-cover object-top max-md:order-2"
            />
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-5" />}

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-7">
              <H5 as="strong">Categories:</H5>

              <Stack>
                {tool.categories?.map(({ slug, name }) => (
                  <Tag key={slug} href={`/categories/${slug}`} prefix={<HashIcon />}>
                    {name}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Topics */}
          {!!tool.topics.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-8">
              <H5 as="strong">Related topics:</H5>

              <Stack>
                {tool.topics.map(({ slug }) => (
                  <Tag key={slug} href={`/topics/${slug}`} prefix={<HashIcon />}>
                    {slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <ShareButtons title={`${title}`} className="max-md:order-9" />
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-4" />}>
            <AdCard ad={ad as AdOne} className="max-md:order-4" />
          </Suspense>

          {/* Featured */}
          <Suspense>
            <FeaturedTools className="max-md:order-10" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
