"use server"

import { slugify } from "@curiousleaf/utils"
import { prisma } from "@plai/db"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { uploadFavicon } from "~/lib/media"
import { authedProcedure } from "~/lib/safe-actions"
import { alternativeSchema } from "~/server/admin/alternatives/validations"
import { inngest } from "~/services/inngest"

export const createAlternative = authedProcedure
  .createServerAction()
  .input(alternativeSchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const alternative = await prisma.alternative.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        tools: { connect: tools?.map(id => ({ id })) },
      },
    })

    revalidateTag("alternatives")

    await inngest.send({ name: "alternative.created", data: { slug: alternative.slug } })

    return alternative
  })

export const updateAlternative = authedProcedure
  .createServerAction()
  .input(alternativeSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const alternative = await prisma.alternative.update({
      where: { id },
      data: {
        ...input,
        tools: { set: tools?.map(id => ({ id })) },
      },
    })

    revalidateTag("alternatives")
    revalidateTag(`alternative-${alternative.slug}`)

    return alternative
  })

export const updateAlternatives = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: alternativeSchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.alternative.updateMany({
      where: { id: { in: ids } },
      data,
    })

    revalidateTag("alternatives")
    revalidateTag(`alternative-${data.slug}`)

    return true
  })

export const deleteAlternatives = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const alternatives = await prisma.alternative.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await prisma.alternative.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("alternatives")

    for (const alternative of alternatives) {
      await inngest.send({ name: "alternative.deleted", data: { slug: alternative.slug } })
    }

    return true
  })

export const reuploadAlternativeAssets = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { id },
    })

    const faviconUrl = await uploadFavicon(
      alternative.website,
      `alternatives/${alternative.slug}/favicon`,
    )

    await prisma.alternative.update({
      where: { id: alternative.id },
      data: { faviconUrl },
    })

    revalidateTag("alternatives")
    revalidateTag(`alternative-${alternative.slug}`)

    return true
  })
