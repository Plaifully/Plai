import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import type { AdOne } from "~/server/web/ads/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"
import { findCategories } from "~/server/web/categories/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
  ad: AdOne | null
}

export const CategoryToolListing = async ({ category, searchParams, ad }: CategoryToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  // Fetch tools and categories in parallel
  const [{ tools }, categories] = await Promise.all([
    searchTools(parsedParams, {
      where: { categories: { some: { slug: category.slug } } },
    }),
    findCategories({})
  ])

  return (
      <ToolQuery
        tools={tools}
        categories={categories}
        perPage={parsedParams.perPage}
        placeholder={`Search in ${category.label?.toLowerCase()}...`}
        ad={ad || undefined}
      />
  )
}
