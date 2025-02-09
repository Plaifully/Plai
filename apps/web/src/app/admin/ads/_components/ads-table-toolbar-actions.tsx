"use client"

import { type Ad } from "@plai/db/client"
import { type Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/admin/ui/button"
import { deleteAds } from "~/server/admin/ads/actions"

interface AdsTableToolbarActionsProps {
  table: Table<Ad>
}

export function AdsTableToolbarActions({ table }: AdsTableToolbarActionsProps) {
  const selectedRows = table.getSelectedRowModel().rows

  const { execute: deleteAdsAction, isPending: isDeletingAds } = useServerAction(deleteAds, {
    onSuccess: () => {
      toast.success("Ads successfully deleted")
      table.resetRowSelection()
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  if (!selectedRows.length) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8"
      isPending={isDeletingAds}
      onClick={() => {
        const ids = selectedRows.map(row => row.original.id)
        deleteAdsAction({ ids })
      }}
      prefix={<TrashIcon className="size-4" />}
    >
      Delete
    </Button>
  )
} 