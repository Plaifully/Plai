import type { Metadata } from "next"
import Link from "next/link"
import { AdsPicker } from "~/components/web/ads-picker"
import { Advertisers } from "~/components/web/advertisers"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { findAds } from "~/server/web/ads/queries"
import { PricingSection } from "~/components/web/pricing/pricing-section"

export const metadata: Metadata = {
  title: `Advertise on ${config.site.name}`,
  description: `Promote your AI tool on ${config.site.name} and reach our growing community of developers and tech enthusiasts.`,
  openGraph: { ...metadataConfig.openGraph, url: "/advertise" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise" },
}

export default async function AdvertisePage() {
  const ads = await findAds({})

  return (
    <div className="flex flex-col gap-16">
      <Intro alignment="center">
        <IntroTitle>{metadata.title as string}</IntroTitle>
        <IntroDescription className="max-w-3xl">
          Choose the perfect plan to feature your agent to your target customers.
        </IntroDescription>
      </Intro>

      <PricingSection />

      <Stats className="py-8" />

      {config.ads.testimonials.map(testimonial => (
        <Testimonial key={testimonial.quote} {...testimonial} />
      ))}

      <div className="flex flex-col items-center text-center gap-8" id="advertisers">
        <p className="text-lg text-muted-foreground">
          Join these companies in advertising their business on {config.site.name}
        </p>

        <Advertisers />
      </div>

      <hr className="my-8" />

      <Intro alignment="center">
        <IntroTitle size="h2" as="h3">
          Need a custom partnership?
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button variant="fancy" size="lg" className="mt-8" asChild>
          <Link href={`mailto:${config.site.email}`} target="_blank" rel="noopener noreferrer">
            Contact us
          </Link>
        </Button>
      </Intro>
    </div>
  )
}
