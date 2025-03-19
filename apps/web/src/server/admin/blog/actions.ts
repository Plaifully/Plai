"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@plai/db"
import { BlogPostStatus } from "@plai/db/client"
import type { z } from "zod"
import type { blogPostSchema } from "./validations"

// Delete multiple blog posts
export async function deleteBlogPosts(ids: string[]) {
  try {
    await prisma.blogPost.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    revalidatePath("/admin/blog")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete blog posts:", error)
    return { success: false, error: "Failed to delete blog posts" }
  }
}

// Update status for multiple blog posts
export async function updateBlogPostsStatus({
  ids,
  status,
}: {
  ids: string[]
  status: BlogPostStatus
}) {
  try {
    await prisma.blogPost.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status,
        ...(status === BlogPostStatus.Published
          ? { publishedAt: new Date() }
          : status === BlogPostStatus.Scheduled
          ? {}
          : { publishedAt: null }),
      },
    })

    revalidatePath("/admin/blog")
    return { success: true }
  } catch (error) {
    console.error("Failed to update blog posts status:", error)
    return { success: false, error: "Failed to update blog posts status" }
  }
}

// Create a new blog post
export async function createBlogPost(data: z.infer<typeof blogPostSchema>) {
  try {
    const { categories, ...blogPostData } = data

    const blogPost = await prisma.blogPost.create({
      data: {
        ...blogPostData,
        categories: {
          connect: Array.isArray(categories)
            ? categories.map(id => ({ id }))
            : [],
        },
      },
    })

    revalidatePath("/admin/blog")
    return { success: true, blogPost }
  } catch (error) {
    console.error("Failed to create blog post:", error)
    throw new Error("Failed to create blog post")
  }
}

// Update an existing blog post
export async function updateBlogPost({
  id,
  ...data
}: z.infer<typeof blogPostSchema> & { id: string }) {
  try {
    const { categories, ...blogPostData } = data

    // First disconnect all categories
    await prisma.blogPost.update({
      where: { id },
      data: {
        categories: {
          set: [],
        },
      },
    })

    // Then update the blog post with new data and connect new categories
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...blogPostData,
        categories: {
          connect: Array.isArray(categories)
            ? categories.map(id => ({ id }))
            : [],
        },
      },
    })

    revalidatePath("/admin/blog")
    revalidatePath(`/admin/blog/${id}`)
    return { success: true, blogPost }
  } catch (error) {
    console.error("Failed to update blog post:", error)
    throw new Error("Failed to update blog post")
  }
} 