"use server"

import { prisma } from "@plai/db"
import { z } from "zod"
import { authedProcedure } from "~/lib/safe-actions"

export const searchItems = authedProcedure
  .createServerAction()
  .input(z.object({ query: z.string() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    const [tools, alternatives, categories, licenses] = await Promise.all([
      prisma.tool.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      prisma.alternative.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      prisma.category.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      prisma.license.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
    ])

    console.log(`Search took ${performance.now() - start}ms`)

    return { tools, alternatives, categories, licenses }
  })
