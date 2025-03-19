import { AdPlacement } from "./ad-placement"
import { findFloatingAd } from "~/server/web/ads/queries"

export async function FloatingAd() {
  const ad = await findFloatingAd()

  if (!ad) {
    return null
  }

  return <AdPlacement ad={ad} />
} 