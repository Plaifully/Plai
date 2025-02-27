import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategoryBySlug, findCategorySlugs } from "~/server/web/categories/queries"
import { findAd } from "~/server/web/ads/queries"
import { AdType } from "@plai/db/client"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return category
})

const getCategoryAd = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  return findAd({
    where: {
      type: AdType.CategoryPage,
      categories: {
        some: { slug }
      },
      startsAt: { lte: new Date() },
      endsAt: { gt: new Date() }
    }
  })
})

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `${name}`,
    description: `A curated collection of the ${category._count.tools} best AI Agents ${name} for inspiration and reference. Each listing includes a website screenshot along with a detailed review of its features.`,
  }
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const category = await getCategory(props)
  const url = `/categories/${category.slug}`

  return {
    ...getMetadata(category),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const [category, ad] = await Promise.all([
    getCategory(props),
    getCategoryAd(props)
  ])
  const { title, description } = getMetadata(category)

  return (
    <>
      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing category={category} searchParams={props.searchParams} ad={ad} />
      </Suspense>
    </>
  )
}
