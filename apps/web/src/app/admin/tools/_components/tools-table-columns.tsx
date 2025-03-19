"use client";

import { formatDate } from "@curiousleaf/utils";
import { type Tool, type ToolTier, ToolStatus } from "@plai/db/client";
import type { ColumnDef } from "@tanstack/react-table";
import { ToolActions } from "~/app/admin/tools/_components/tool-actions";
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header";
import { DataTableLink } from "~/components/admin/data-table/data-table-link";
import { DataTableThumbnail } from "~/components/admin/data-table/data-table-thumbnail";
import { Checkbox } from "~/components/common/checkbox";
import { Badge } from "~/components/web/ui/badge";
import { cx } from "~/utils/cva";

// Define the type for a tool with categories
type ToolWithCategories = Tool & {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

const tierLabels: Record<ToolTier, string> = {
  Free: "Free",
  Featured: "Featured",
  Premium: "Premium",
};

export function getColumns(): ColumnDef<ToolWithCategories>[] {
  return [
    {
      accessorKey: "name",
      header: ({ table, column }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="my-auto mx-1.5"
          />
          <DataTableColumnHeader column={column} title="Name" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="my-auto mx-1.5"
          />
          <DataTableLink href={`/admin/tools/${row.original.slug}`}>
            {row.original.faviconUrl && (
              <DataTableThumbnail src={row.original.faviconUrl} />
            )}
            {row.getValue("name")}
          </DataTableLink>
        </div>
      ),
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tagline" />
      ),
      cell: ({ row }) => (
        <div className="max-w-96 truncate text-muted-foreground">
          {row.getValue("tagline")}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "categories",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categories" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.categories?.map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.getValue<Date>("createdAt"))}
        </span>
      ),
      size: 0,
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Published At" />
      ),
      cell: ({ row }) =>
        row.original.publishedAt ? (
          <span className="text-muted-foreground">
            {formatDate(row.getValue<Date>("publishedAt"))}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      size: 0,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as ToolStatus;
        return (
          <div className="flex items-center gap-2">
            <div
              className={cx(
                "flex items-center gap-1.5 px-2 py-1 rounded-md",
                status === ToolStatus.Published && "bg-green-700/20",
                status === ToolStatus.Draft && "bg-yellow-700/20",
                status === ToolStatus.Scheduled && "bg-red-700/20"
              )}
            >
              <div
                className={cx(
                  "h-2 w-2 rounded-full",
                  status === ToolStatus.Published && "bg-green-500",
                  status === ToolStatus.Draft && "bg-yellow-500",
                  status === ToolStatus.Scheduled && "bg-red-500"
                )}
              />
              <span
                className={cx(
                  "rounded-md text-xs font-medium",
                  status === ToolStatus.Published && "text-green-700",
                  status === ToolStatus.Draft && "text-yellow-700",
                  status === ToolStatus.Scheduled && "text-red-700"
                )}
              >
                {status}
              </span>
            </div>
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "submitterEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Submitter" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.getValue("submitterEmail")}
        </span>
      ),
      size: 0,
    },
    {
      accessorKey: "tier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tier" />
      ),
      cell: ({ row }) => {
        const tier = row.getValue("tier") as ToolTier;
        return (
          <span className="text-muted-foreground">{tierLabels[tier]}</span>
        );
      },
      size: 0,
    },
    {
      accessorKey: "pricingType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pricing" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("pricingType")}
        </span>
      ),
      size: 0,
    },
    {
      accessorKey: "xAccountUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="X Account" />
      ),
      cell: ({ row }) => {
        const url = row.getValue("xAccountUrl") as string;
        return url ? (
          <span className="text-muted-foreground text-sm">
            {new URL(url).pathname.slice(1)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ToolActions
          tool={row.original}
          row={row}
          className="float-right -my-0.5"
        />
      ),
      size: 0,
    },
  ];
}
