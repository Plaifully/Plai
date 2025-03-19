import { z } from "zod"
import { BlogPostStatus } from "@plai/db/client"

// Define the blog post schema
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional().nullable(),
  status: z.nativeEnum(BlogPostStatus, {
    required_error: "Status is required",
  }),
  publishedAt: z.date().optional().nullable(),
  authorName: z.string().min(1, "Author name is required"),
  authorImage: z.string().optional().nullable(),
  authorTwitter: z.string().optional().nullable(),
  categories: z.array(z.string()).optional().default([]),
})

// Type for blog post data
export type BlogPostFormValues = z.infer<typeof blogPostSchema> 