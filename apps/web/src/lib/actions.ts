import { createServerAction as createAction } from "zsa"
import { getIP } from "~/lib/rate-limiter"
import type { NextRequest } from "next/server"
import type { ZSAResponseMeta } from "zsa"

/**
 * Create a server action with IP address context
 */
export const createServerAction = () => {
  return createAction().handler(async ({ input, ctx, request, responseMeta, previousState }) => {
    const ip = await getIP()
    return { ip }
  })
} 