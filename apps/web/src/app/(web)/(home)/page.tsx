import { AdType } from "@plai/db/client"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { HomeToolListing } from "~/app/(web)/(home)/listing"
import { NewsletterForm } from "~/components/web/newsletter-form"
import { NewsletterProof } from "~/components/web/newsletter-proof"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { findCategories } from "~/server/admin/categories/queries"
import { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"
import { searchAllPublishedTools } from "~/server/web/tools/queries"

export default async function Home() {
  const [tools, categories, ad] = await Promise.all([
    searchAllPublishedTools({}),
    findCategories({}),
    findAd({ where: { type: AdType.Homepage } }),
  ])

  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh]">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:text-5xl/[1.1]!">
            {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>

        <NewsletterForm
          size="lg"
          className="max-w-sm mx-auto items-center text-center"
          buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
        >
          <NewsletterProof />
        </NewsletterForm>
      </section>
      <Suspense fallback={<ToolQuerySkeleton />}>
        <HomeToolListing
          tools={tools}
          perPage={10}
          categories={categories.categories.map(cat => ({
            ...cat,
            _count: { tools: 0 }, // Adding missing _count property
          }))}
          ad={ad as AdOne}
        />
      </Suspense>
    </>
  )
}
