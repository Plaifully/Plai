"use client"

import { type Ad } from "@plai/db/client"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontalIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "~/components/admin/ui/badge"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import { Checkbox } from "~/components/common/checkbox"
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header"
import { Favicon } from "~/components/web/ui/favicon"

export function getColumns(): ColumnDef<Ad>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 0,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const ad = row.original

        return (
          <div className="flex items-center gap-2 max-w-[200px]">
            <Favicon src={ad.faviconUrl} title={ad.name} className="size-4 shrink-0" />
            <Link href={`/admin/ads/${ad.id}`} className="font-medium hover:underline truncate">
              {ad.name}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="size-3.5" />
            <span>{type}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id))
      },
      size: 0,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      size: 0,
    },
    {
      accessorKey: "website",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
      cell: ({ row }) => {
        const website = row.getValue("website") as string
        return (
          <Link href={website} className="hover:underline text-muted-foreground" target="_blank" rel="noopener noreferrer">
            {new URL(website).hostname}
          </Link>
        )
      },
      size: 0,
    },
    {
      accessorKey: "startsAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Starts" />,
      cell: ({ row }) => <span className="text-muted-foreground">{format(new Date(row.getValue("startsAt")), "MMM d, yyyy")}</span>,
      size: 0,
    },
    {
      accessorKey: "endsAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ends" />,
      cell: ({ row }) => <span className="text-muted-foreground">{format(new Date(row.getValue("endsAt")), "MMM d, yyyy")}</span>,
      size: 0,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => <span className="text-muted-foreground">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ad = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 p-0"
                prefix={<MoreHorizontalIcon className="size-4" />}
              >
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/ads/${ad.id}`}>Edit ad</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 0,
    },
  ]
} 