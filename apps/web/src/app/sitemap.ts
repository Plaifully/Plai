import { allPosts as posts } from "content-collections"
import type { MetadataRoute } from "next"
import { config } from "~/config"
import { findCategorySlugs } from "~/server/web/categories/queries"
import { findToolSlugs } from "~/server/web/tools/queries"
import { findTopicSlugs } from "~/server/web/topics/queries"

type Entry = MetadataRoute.Sitemap[number]

const createEntry = (path: string, lastModified: Date, options?: Partial<Entry>): Entry => ({
  url: `${config.site.url}${path}`,
  lastModified,
  changeFrequency: "weekly",
  ...options,
})

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories, topics] = await Promise.all([
    findToolSlugs({}),
    findCategorySlugs({}),
    findTopicSlugs({}),
  ])

  const pages = ["/about", "/advertise", "/submit", "/newsletter"]
  const now = new Date()

  return [
    // Home
    createEntry("", now, { changeFrequency: "daily", priority: 1 }),

    // Static pages
    ...pages.map(p => createEntry(p, now, { changeFrequency: "monthly" })),

    // Posts
    createEntry("/blog", now),
    ...posts.map(p => createEntry(`/blog/${p._meta.path}`, new Date(p.updatedAt ?? p.publishedAt))),

    // AI Agents
    ...tools.map(t => createEntry(`/${t.slug}`, t.updatedAt)),

    // Categories
    createEntry("/categories", now),
    ...categories.map(c => createEntry(`/categories/${c.slug}`, c.updatedAt)),

    // Topics
    ...config.site.alphabet.split("").map(letter => createEntry(`/topics/letter/${letter}`, now)),
    ...topics.map(t => createEntry(`/topics/${t.slug}`, t.updatedAt)),
  ]
}
