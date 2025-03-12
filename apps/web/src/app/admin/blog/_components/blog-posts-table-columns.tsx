"use client"

import { BlogPostStatus } from "@plai/db/client"
import { format } from "date-fns"
import { ArrowUpRightIcon, CheckIcon, ClockIcon, FileTextIcon, XIcon } from "lucide-react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "~/components/admin/ui/badge"
import { Button } from "~/components/admin/ui/button"
import { Checkbox } from "~/components/admin/ui/checkbox"
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header"
import { DataTableRowActions } from "~/components/admin/data-table/data-table-row-actions"

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

export const getColumns = (): ColumnDef<BlogPost>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return (
        <div className="flex max-w-[500px] items-center">
          <span className="truncate font-medium">{title}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as BlogPostStatus

      return (
        <div className="flex w-[100px] items-center">
          {status === BlogPostStatus.Draft && (
            <Badge variant="outline" className="gap-1">
              <FileTextIcon className="h-3 w-3 text-gray-500" />
              <span>Draft</span>
            </Badge>
          )}
          {status === BlogPostStatus.Scheduled && (
            <Badge variant="secondary" className="gap-1">
              <ClockIcon className="h-3 w-3 text-blue-500" />
              <span>Scheduled</span>
            </Badge>
          )}
          {status === BlogPostStatus.Published && (
            <Badge variant="success" className="gap-1">
              <CheckIcon className="h-3 w-3" />
              <span>Published</span>
            </Badge>
          )}
          {status === BlogPostStatus.Archived && (
            <Badge variant="destructive" className="gap-1">
              <XIcon className="h-3 w-3" />
              <span>Archived</span>
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "authorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => {
      const authorName = row.getValue("authorName") as string
      return <div className="max-w-[200px] truncate">{authorName}</div>
    },
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as Date | null
      return (
        <div className="w-[120px]">
          {publishedAt ? format(new Date(publishedAt), "MMM d, yyyy") : "—"}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date
      return (
        <div className="w-[120px]">{format(new Date(createdAt), "MMM d, yyyy")}</div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "categories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categories" />,
    cell: ({ row }) => {
      const categories = row.getValue("categories") as { id: string; name: string }[]
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Badge key={category.id} variant="outline" className="truncate max-w-[100px]">
                {category.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const blogPost = row.original
      const slug = blogPost.slug

      return (
        <DataTableRowActions
          actions={[
            {
              label: "Edit",
              href: `/admin/blog/${blogPost.id}`,
            },
            {
              label: "View",
              href: `/blog/${slug}`,
              icon: <ArrowUpRightIcon className="h-4 w-4" />,
              external: true,
            },
            {
              label: "Delete",
              variant: "destructive",
              onClick: () => {
                // This will be handled by the toolbar actions
                console.log("Delete", blogPost.id)
              },
            },
          ]}
        />
      )
    },
  },
] 