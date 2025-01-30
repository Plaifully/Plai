import type { Metadata } from "next"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Card } from "~/components/web/ui/card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { PricingSection } from "~/components/web/pricing/pricing-section"

export const metadata: Metadata = {
  title: "Submit your AI Agent",
  description: `Help us grow the list of AI Agents. Contribute to ${config.site.name} by submitting a new AI Agent.`,
  openGraph: { ...metadataConfig.openGraph, url: "/submit" },
  alternates: { ...metadataConfig.alternates, canonical: "/submit" },
}

export default async function SubmitPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm />
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

      <div id="pricing" className="scroll-mt-16">
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
