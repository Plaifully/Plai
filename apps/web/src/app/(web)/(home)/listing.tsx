import { ToolQuery } from "~/components/web/tools/tool-query"
import type { AdOne } from "~/server/web/ads/payloads"
import type { CategoryMany } from "~/server/web/categories/payloads"
import type { ToolMany } from "~/server/web/tools/payloads"

type HomeToolListingProps = {
  tools: ToolMany[]
  perPage: number
  categories: CategoryMany[]
  ad?: AdOne
}

export const HomeToolListing = async ({ tools, perPage, categories, ad }: HomeToolListingProps) => {
  return (
    <ToolQuery
      tools={tools}
      perPage={perPage}
      categories={categories}
      ad={ad}
    />
  )
}
