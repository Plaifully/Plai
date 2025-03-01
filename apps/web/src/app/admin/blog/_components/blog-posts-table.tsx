"use client"

import { BlogPostStatus } from "@plai/db/client"
import { PlusIcon, FileTextIcon } from "lucide-react"
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
import { getColumns } from "./blog-posts-table-columns"
import { BlogPostsTableToolbarActions } from "./blog-posts-table-toolbar-actions"

// Define the BlogPost type based on our schema
interface BlogPost {
  id: string
  title: string
  slug: string
  description?: string | null
  status: BlogPostStatus
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  authorName: string
  categories: { id: string; name: string }[]
}

interface BlogPostsTableProps {
  blogPostsPromise: Promise<{
    blogPosts: BlogPost[]
    blogPostsTotal: number
    pageCount: number
  }>
}

export function BlogPostsTable({ blogPostsPromise }: BlogPostsTableProps) {
  const { blogPosts, blogPostsTotal, pageCount } = React.use(blogPostsPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<BlogPost>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter by title...",
    },
    {
      label: "Status",
      value: "status",
      options: [
        {
          label: "Draft",
          value: BlogPostStatus.Draft,
          icon: <FileTextIcon className="!text-gray-600" />,
        },
        {
          label: "Scheduled",
          value: BlogPostStatus.Scheduled,
          icon: <FileTextIcon className="!text-blue-600" />,
        },
        {
          label: "Published",
          value: BlogPostStatus.Published,
          icon: <FileTextIcon className="!text-green-600" />,
        },
        {
          label: "Archived",
          value: BlogPostStatus.Archived,
          icon: <FileTextIcon className="!text-red-600" />,
        },
      ],
    },
  ]

  const { table } = useDataTable({
    data: blogPosts,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: {
        right: ["actions"],
        left: ["select", "title", "status"],
      },
      columnVisibility: {
        description: false,
      },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Blog Posts"
        total={blogPostsTotal}
        callToAction={
          <Button prefix={<PlusIcon />} asChild>
            <Link href="/admin/blog/new">
              <span className="max-sm:sr-only">New blog post</span>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <BlogPostsTableToolbarActions table={table} />
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
} 