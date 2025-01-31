import { Metadata } from "next"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Card } from "~/components/web/ui/card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { PricingSection } from "~/components/web/pricing/pricing-section"
import { findCategories } from "~/server/web/categories/queries"

export const metadata: Metadata = {
  title: "Submit your agent",
  description: "Join the internet's largest and most relevant AI agent roster today.",
  openGraph: { ...metadataConfig.openGraph, url: "/submit" },
  alternates: { ...metadataConfig.alternates, canonical: "/submit" },
}

export default async function Submit() {
  const categories = await findCategories({})

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>Submit your agent</IntroTitle>
        <IntroDescription>
          Join the internet's largest and most relevant AI agent roster today.
        </IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm categories={categories} />
        </Section.Content>

        <Section.Sidebar>
          <Card hover={false}>
            <Prose className="text-sm/normal">
              <p>
                <strong>Note:</strong> Please make sure the AI Agent you're submitting is:
              </p>

              <ul className="[&_li]:p-0 list-inside p-0">
                <li>An AI-powered tool or agent</li>
                <li>Actively maintained and accessible</li>
                <li>Has a working website/landing page</li>
              </ul>
            </Prose>
          </Card>
        </Section.Sidebar>
      </Section>

      <div id="pricing" className="scroll-mt-16 pt-16">
        <Intro alignment="center">
          <IntroTitle size="h2">Get Featured Faster</IntroTitle>
          <IntroDescription>
            Choose a premium listing option to get faster review times and enhanced visibility
          </IntroDescription>
        </Intro>

        <PricingSection />
      </div>
    </>
  )
}
