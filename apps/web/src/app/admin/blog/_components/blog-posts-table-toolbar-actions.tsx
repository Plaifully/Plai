"use client"

import { ArchiveIcon, CheckIcon, ClockIcon, FileTextIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import type { Table } from "@tanstack/react-table"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/admin/ui/alert-dialog"
import { BlogPostStatus } from "@plai/db/client"
import { deleteBlogPosts, updateBlogPostsStatus } from "~/server/admin/blog/actions"

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

interface BlogPostsTableToolbarActionsProps {
  table: Table<BlogPost>
}

export function BlogPostsTableToolbarActions({ table }: BlogPostsTableToolbarActionsProps) {
  const router = useRouter()
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleDelete = async () => {
    if (selectedCount === 0) return

    try {
      setIsDeleting(true)
      const ids = selectedRows.map((row) => row.original.id)
      await deleteBlogPosts(ids)
      table.resetRowSelection()
      router.refresh()
      toast.success(`${selectedCount} blog post(s) deleted`)
    } catch (error) {
      console.error("Failed to delete blog posts:", error)
      toast.error("Failed to delete blog posts")
    } finally {
      setIsDeleting(false)
      setIsDeleteAlertOpen(false)
    }
  }

  const handleUpdateStatus = async (status: BlogPostStatus) => {
    if (selectedCount === 0) return

    try {
      setIsUpdatingStatus(true)
      const ids = selectedRows.map((row) => row.original.id)
      await updateBlogPostsStatus({ ids, status })
      table.resetRowSelection()
      router.refresh()
      toast.success(`${selectedCount} blog post(s) updated`)
    } catch (error) {
      console.error("Failed to update blog posts:", error)
      toast.error("Failed to update blog posts")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            disabled={selectedCount === 0}
          >
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(BlogPostStatus.Draft)}
            disabled={isUpdatingStatus}
            className="cursor-pointer"
          >
            <FileTextIcon className="mr-2 h-4 w-4" /> Mark as Draft
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(BlogPostStatus.Scheduled)}
            disabled={isUpdatingStatus}
            className="cursor-pointer"
          >
            <ClockIcon className="mr-2 h-4 w-4" /> Mark as Scheduled
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(BlogPostStatus.Published)}
            disabled={isUpdatingStatus}
            className="cursor-pointer"
          >
            <CheckIcon className="mr-2 h-4 w-4" /> Mark as Published
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(BlogPostStatus.Archived)}
            disabled={isUpdatingStatus}
            className="cursor-pointer"
          >
            <ArchiveIcon className="mr-2 h-4 w-4" /> Mark as Archived
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteAlertOpen(true)}
            disabled={isDeleting}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected blog posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 