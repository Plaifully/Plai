import { PrismaClient, ToolStatus, ToolTier } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.tool.deleteMany()
  await prisma.category.deleteMany()
  await prisma.topic.deleteMany()

  // Create categories
  const aiCategory = await prisma.category.create({
    data: {
      name: "AI & Machine Learning",
      slug: "ai-ml",
      label: "AI",
    },
  })

  const devCategory = await prisma.category.create({
    data: {
      name: "Development",
      slug: "development",
      label: "Dev",
    },
  })

  // Create topics
  const topics = await Promise.all([
    prisma.topic.create({ data: { slug: "chatbot" } }),
    prisma.topic.create({ data: { slug: "productivity" } }),
    prisma.topic.create({ data: { slug: "coding" } }),
  ])

  // Create tools with different tiers
  await prisma.tool.create({
    data: {
      name: "ChatGPT",
      slug: "chatgpt",
      website: "https://chat.openai.com",
      tagline: "Advanced language model for conversation and assistance",
      description: "ChatGPT is an AI-powered chatbot that can engage in human-like conversations.",
      faviconUrl: "/openai-logo.png",
      status: ToolStatus.Published,
      tier: ToolTier.Premium,
      publishedAt: new Date(),
      categories: {
        connect: { id: aiCategory.id },
      },
      topics: {
        connect: [{ slug: "chatbot" }, { slug: "productivity" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "GitHub Copilot",
      slug: "github-copilot",
      website: "https://github.com/features/copilot",
      tagline: "AI pair programmer that helps you write better code",
      description: "GitHub Copilot uses OpenAI to suggest code and entire functions in real-time.",
      faviconUrl: "/github-logo.png",
      status: ToolStatus.Published,
      tier: ToolTier.Featured,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: devCategory.id }],
      },
      topics: {
        connect: [{ slug: "coding" }, { slug: "productivity" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "Claude",
      slug: "claude",
      website: "https://claude.ai",
      tagline: "Advanced AI assistant for various tasks",
      description: "Claude is an AI assistant that can help with writing, analysis, and coding.",
      faviconUrl: "/anthropic-logo.png",
      status: ToolStatus.Published,
      tier: ToolTier.Free,
      publishedAt: new Date(),
      categories: {
        connect: { id: aiCategory.id },
      },
      topics: {
        connect: [{ slug: "chatbot" }],
      },
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 