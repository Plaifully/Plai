"use server"

import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"
import { redis } from "~/services/redis"

const limiters = {
  stackAnalysis: new Ratelimit({
    redis,
    analytics: true,
    limiter: Ratelimit.slidingWindow(10, "12 h"), // 5 attempts per 12 hours
  }),

  submission: new Ratelimit({
    redis,
    analytics: true,
    limiter: Ratelimit.slidingWindow(3, "24 h"), // 3 submissions per day
  }),

  newsletter: new Ratelimit({
    redis,
    analytics: true,
    limiter: Ratelimit.slidingWindow(2, "24 h"), // 2 attempts per day
  }),
  
  "ai-search": new Ratelimit({
    redis,
    analytics: true,
    limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 searches per hour
  }),
}

/**
 * Get the IP address of the client
 * @returns IP address
 */
export const getIP = async () => {
  const FALLBACK_IP_ADDRESS = "0.0.0.0"
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS
  }

  return headersList.get("x-real-ip") ?? FALLBACK_IP_ADDRESS
}

/**
 * Check if the user is rate limited
 * @param id - The identifier to check
 * @param action - The action to check
 * @returns True if the user is rate limited, false otherwise
 */
export const isRateLimited = async (id: string, action: keyof typeof limiters) => {
  try {
    const { success } = await limiters[action].limit(id)
    return !success
  } catch (error) {
    console.error("Rate limiter error:", error)
    return false // Fail open to prevent blocking legitimate users
  }
}
