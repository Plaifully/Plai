"use server"

import { prisma } from "@plai/db"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { authedProcedure } from "~/lib/safe-actions"
import { adSchema } from "./validations"

export const createAd = authedProcedure
  .createServerAction()
  .input(adSchema)
  .handler(async ({ input }) => {
    console.log('Server: Creating ad with input:', input)
    try {
      const { categories, ...rest } = input
      const ad = await prisma.ad.create({
        data: {
          ...rest,
          categories: categories ? {
            connect: categories.map(id => ({ id }))
          } : undefined
        },
      })
      console.log('Server: Successfully created ad:', ad)
      revalidateTag("ads")
      return ad
    } catch (error) {
      console.error('Server: Error creating ad:', error)
      throw error
    }
  })

const updateAdSchema = z.intersection(
  z.object({ id: z.string() }),
  adSchema
)

export const updateAd = authedProcedure
  .createServerAction()
  .input(updateAdSchema)
  .handler(async ({ input }) => {
    console.log('Server: Updating ad with input:', input)
    try {
      const { id, categories, ...rest } = input
      const ad = await prisma.ad.update({
        where: { id },
        data: {
          ...rest,
          categories: categories ? {
            set: categories.map((categoryId: string) => ({ id: categoryId }))
          } : undefined
        },
      })
      console.log('Server: Successfully updated ad:', ad)
      revalidateTag("ads")
      return ad
    } catch (error) {
      console.error('Server: Error updating ad:', error)
      throw error
    }
  })

export const deleteAds = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await prisma.ad.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("ads")
    return true
  }) 