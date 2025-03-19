import { PrismaClient } from "@prisma/client"
import prompts from "prompts"
import { seedAds } from "./seeds/ads"
import { seedBlogPosts } from "./seeds/blog-posts"
import { seedTools } from "./seeds/tools"

const prisma = new PrismaClient()

async function main() {
  const response = await prompts({
    type: 'multiselect',
    name: 'seedTypes',
    message: 'What would you like to seed?',
    choices: [
      { title: 'Tools, Categories & Topics', value: 'tools', selected: false },
      { title: 'Ads', value: 'ads', selected: true },
      { title: 'Blog Posts', value: 'blogPosts', selected: true }
    ],
  })

  if (response.seedTypes.includes('tools')) {
    await seedTools()
  }
  
  if (response.seedTypes.includes('ads')) {
    await seedAds()
  }

  if (response.seedTypes.includes('blogPosts')) {
    await seedBlogPosts()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 