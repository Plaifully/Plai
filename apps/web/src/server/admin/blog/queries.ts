"use server"

import { prisma } from "@plai/db"
import { BlogPostStatus } from "@plai/db/client"
import { cache } from "react"

// Find blog posts with filtering and pagination
export const findBlogPosts = cache(
  async (params: { [key: string]: string | string[] | undefined }) => {
    const {
      title,
      status,
      page = "1",
      per_page = "10",
      sort = "createdAt",
      order = "desc",
    } = params

    const pageNumber = Number(page)
    const perPage = Number(per_page)
    const skip = (pageNumber - 1) * perPage

    // Build where clause based on filters
    const where: any = {}

    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive",
      }
    }

    if (status && Object.values(BlogPostStatus).includes(status as BlogPostStatus)) {
      where.status = status
    }

    // Create a properly formatted orderBy object based on the sort and order parameters
    let orderBy: any;
    
    // Handle different sort fields explicitly
    switch (sort) {
      case "createdAt":
        orderBy = { createdAt: order };
        break;
      case "updatedAt":
        orderBy = { updatedAt: order };
        break;
      case "publishedAt":
        orderBy = { publishedAt: order };
        break;
      case "title":
        orderBy = { title: order };
        break;
      case "status":
        orderBy = { status: order };
        break;
      default:
        // Default to createdAt if sort field is not recognized
        orderBy = { createdAt: order };
    }

    // Get blog posts with pagination
    const [blogPosts, blogPostsTotal] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: perPage,
        orderBy,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ])

    return {
      blogPosts,
      blogPostsTotal,
      pageCount: Math.ceil(blogPostsTotal / perPage),
    }
  }
)

// Find a single blog post by ID
export const findBlogPostById = cache(async (id: string) => {
  const blogPost = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return blogPost
})

// Find all categories for dropdown selection
export const findCategoryList = cache(async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  })

  return categories
}) 