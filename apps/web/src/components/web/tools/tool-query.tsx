import { Pagination } from "~/components/web/pagination"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolList } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Input } from "~/components/web/ui/input"
import type { CategoryMany } from "~/server/web/categories/payloads"
import type { ToolMany } from "~/server/web/tools/payloads"
import type { AdOne } from "~/server/web/ads/payloads"

type ToolQueryProps = {
  tools: ToolMany[]
  categories?: CategoryMany[]
  perPage: number
  placeholder?: string
  ad?: AdOne
}

const ToolQuery = ({ tools, perPage, categories, placeholder, ad }: ToolQueryProps) => {
  const totalCount = tools.length

  return (
    <>
      <div className="flex flex-col gap-5">
        <ToolFilters categories={categories} placeholder={placeholder} />
        <ToolList tools={tools} ad={ad} />
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </>
  )
}

const ToolQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolQuery, ToolQuerySkeleton }
