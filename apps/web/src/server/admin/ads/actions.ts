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
    const ad = await prisma.ad.create({
      data: input,
    })

    revalidateTag("ads")
    return ad
  })

export const updateAd = authedProcedure
  .createServerAction()
  .input(adSchema.extend({ id: z.string() }))
  .handler(async ({ input }) => {
    const { id, ...data } = input
    
    const ad = await prisma.ad.update({
      where: { id },
      data,
    })

    revalidateTag("ads")
    return ad
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