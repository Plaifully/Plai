import { AdType } from "@plai/db/client"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { findCategories } from "~/server/admin/categories/queries"
import type { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"
import { searchAllPublishedTools } from "~/server/web/tools/queries"
import { HomeSearchAndListing } from "~/components/web/home-search-and-listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"

export default async function Home() {
  // Fetch all data needed for the page
  const toolsPromise = searchAllPublishedTools({})
  const categoriesPromise = findCategories({})
  const adPromise = findAd({ where: { type: AdType.Homepage } })
  
  // Wait for all promises to resolve
  const [tools, categories, ad] = await Promise.all([
    toolsPromise,
    categoriesPromise,
    adPromise,
  ])

  // Format categories to include the _count property
  const formattedCategories = categories.categories.map(cat => ({
    ...cat,
    _count: { tools: 0 }, // Adding missing _count property
  }))

  return (
    <>
      <section className="flex flex-col gap-y-8 w-full mb-6">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:text-5xl/[1.1]!">
            {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>
      </section>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <HomeSearchAndListing 
          tools={tools} 
          categories={formattedCategories} 
          ad={ad as AdOne} 
        />
      </Suspense>
    </>
  )
}
