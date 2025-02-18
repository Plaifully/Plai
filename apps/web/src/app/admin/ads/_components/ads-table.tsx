"use client"

import { type Ad, AdType } from "@plai/db/client"
import { PlusIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/admin/data-table/data-table-view-options"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/admin/ui/button"
import { useDataTable } from "~/hooks/use-data-table"
import type { DataTableFilterField } from "~/types"
import { getColumns } from "./ads-table-columns"
import { AdsTableToolbarActions } from "./ads-table-toolbar-actions"

interface AdsTableProps {
  adsPromise: Promise<{
    ads: Ad[]
    adsTotal: number
    pageCount: number
  }>
}

export function AdsTable({ adsPromise }: AdsTableProps) {
  const { ads, adsTotal, pageCount } = React.use(adsPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Ad>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter by name...",
    },
    {
      label: "Type",
      value: "type",
      options: [
        {
          label: "Banner",
          value: AdType.Banner,
          icon: <SparklesIcon className="!text-blue-600" />,
        },
        {
          label: "Homepage",
          value: AdType.Homepage,
          icon: <SparklesIcon className="!text-green-600" />,
        },
        {
          label: "Tool Page",
          value: AdType.ToolPage,
          icon: <SparklesIcon className="!text-yellow-600" />,
        },
        {
          label: "Blog Post",
          value: AdType.BlogPost,
          icon: <SparklesIcon className="!text-purple-600" />,
        },
      ],
    },
  ]

  const { table } = useDataTable({
    data: ads,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: {
        right: ["actions"],
        left: ["select", "name", "type"],
      },
      columnVisibility: {
        email: false,
      },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Ads"
        total={adsTotal}
        callToAction={
          <Button prefix={<PlusIcon />} asChild>
            <Link href="/admin/ads/new">
              <span className="max-sm:sr-only">New ad</span>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <AdsTableToolbarActions table={table} />
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
} 