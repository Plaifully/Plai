import Script from "next/script"
import { type PropsWithChildren, Suspense } from "react"
import type { Graph } from "schema-dts"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Container } from "~/components/web/ui/container"
import { config } from "~/config"
import { env } from "~/env"

import "./styles.css"
import Providers from "~/app/(web)/providers"

export default function RootLayout({ children }: PropsWithChildren) {
  const url = config.site.url
  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}#/schema/organization/1`,
        name: config.site.name,
        url,
        logo: {
          "@type": "ImageObject",
          url: `${url}/logo.png`,
          width: "512",
          height: "512",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}#/schema/website/1`,
        url,
        name: config.site.name,
        description: config.site.description,
        publisher: {
          "@id": `${url}#/schema/organization/1`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#/schema/webpage/1`,
        url,
        name: config.site.name,
        description: config.site.description,
        isPartOf: { "@id": `${url}#/schema/website/1` },
        about: { "@id": `${url}#/schema/organization/1` },
      },
    ],
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-dvh">
        <Header />

        <Container asChild>
          <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <Footer />
          </main>
        </Container>
      </div>

      {/* <Bottom /> */}

      {/* JSON-LD */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Plausible */}
      <Script
        defer
        data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        data-api={`${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/api/event`}
        src={`${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/js/script.js`}
      />
    </Providers>
  )
}
