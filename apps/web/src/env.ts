import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  shared: {
    PORT: z.coerce.number().default(8000),
    VERCEL_URL: z
      .string()
      .optional()
      .transform(v => (v ? `https://${v}` : undefined)),
  },

  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).default("development"),
    
    // Database & Auth (Required)
    DATABASE_URL: z.string().min(1),
    DATABASE_URL_UNPOOLED: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_ALLOWED_EMAILS: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    
    // Redis (Required)
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    // S3 (Required for media storage)
    S3_BUCKET: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),

    // Optional services - make them optional
    GITHUB_TOKEN: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    FIRECRAWL_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    SCREENSHOTONE_ACCESS_KEY: z.string().optional(),
    BEEHIIV_API_KEY: z.string().optional(),
    BEEHIIV_PUBLICATION_ID: z.string().optional(),
    PLAUSIBLE_API_KEY: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().min(1),
    NEXT_PUBLIC_SITE_EMAIL: z.string().email().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
    NEXT_PUBLIC_PLAUSIBLE_HOST: z.string().url().optional(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  },

  experimental__runtimeEnv: {
    PORT: process.env.PORT,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_EMAIL: process.env.NEXT_PUBLIC_SITE_EMAIL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})

export const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production"
export const isDev = !isProd
