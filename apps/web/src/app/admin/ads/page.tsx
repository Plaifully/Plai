import { AdsTable } from "~/app/admin/ads/_components/ads-table"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { findAds } from "~/server/admin/ads/queries"

export default async function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const adsPromise = findAds(await searchParams)

  return (
    <Wrapper>
      <AdsTable adsPromise={adsPromise} />
    </Wrapper>
  )
} 