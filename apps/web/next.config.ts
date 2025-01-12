import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` },
    ],
  },

  async rewrites() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    return [
      // RSS rewrites
      {
        source: "/rss.xml",
        destination: `${siteUrl}/rss/tools.xml`,
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/latest",
        destination: "/?sort=publishedAt.desc",
        permanent: true,
      },
      {
        source: "/topics",
        destination: "/topics/letter/a",
        permanent: true,
      },
      {
        source: "/languages",
        destination: "/stacks",
        permanent: true,
      },
      {
        source: "/languages/:slug",
        destination: "/stacks/:slug",
        permanent: true,
      },
      {
        source: "/newsletter",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sponsor",
        destination: "/advertise",
        permanent: true,
      },
    ]
  },
}

export default withContentCollections(nextConfig)
