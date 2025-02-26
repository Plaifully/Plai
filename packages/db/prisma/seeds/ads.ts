import { AdPlacement, AdType, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedAds() {
  const now = new Date()
  const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

  // Agent Ads
  const agentAds = [
    {
      name: "AI Assistant Pro",
      description: "Your personal AI assistant for productivity and task management",
      email: "contact@aiassistant.pro",
      website: "https://aiassistant.pro",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.Agent,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "SmartBot AI",
      description: "Intelligent chatbot solution for customer service automation",
      email: "info@smartbot.ai",
      website: "https://smartbot.ai",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.Agent,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "DataMind AI",
      description: "Advanced data analysis and insights powered by AI",
      email: "hello@datamind.ai",
      website: "https://datamind.ai",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.Agent,
      startsAt: now,
      endsAt: oneMonthFromNow,
    }
  ]

  // Banner Ads
  const bannerAds = [
    {
      name: "AI Cloud Platform",
      description: "Enterprise-grade AI infrastructure and tools",
      email: "sales@aicloud.tech",
      website: "https://aicloud.tech",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.FloatingTop,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Analytics Pro",
      description: "Real-time AI analytics and monitoring",
      email: "hello@aianalytics.pro",
      website: "https://aianalytics.pro",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.FloatingTop,
      imageUrl: "/placeholders/horizontal-468x60.svg",
      width: 468,
      height: 60,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Security Suite",
      description: "Enterprise AI security and compliance",
      email: "security@aisecurity.suite",
      website: "https://aisecurity.suite",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.CategoryPage,
      placement: AdPlacement.FloatingTop,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Development Suite",
      description: "Complete toolkit for AI application development",
      email: "contact@aidev.suite",
      website: "https://aidev.suite",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.HorizontalTop,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "Neural Network Tools",
      description: "Professional tools for neural network development",
      email: "info@neuraltools.ai",
      website: "https://neuraltools.ai",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.HorizontalMiddle,
      imageUrl: "/placeholders/horizontal-468x60.svg",
      width: 468,
      height: 60,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Research Lab",
      description: "Cutting-edge AI research and development",
      email: "research@ailab.science",
      website: "https://ailab.science",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.Homepage,
      placement: AdPlacement.HorizontalBottom,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Trading Platform",
      description: "AI-powered trading and market analysis",
      email: "trade@aitrading.finance",
      website: "https://aitrading.finance",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.VerticalLeft,
      imageUrl: "/placeholders/vertical-160x600.svg",
      width: 160,
      height: 600,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Education Hub",
      description: "Learn AI development from experts",
      email: "edu@aihub.education",
      website: "https://aihub.education",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.VerticalRight,
      imageUrl: "/placeholders/vertical-120x600.svg",
      width: 120,
      height: 600,
      startsAt: now,
      endsAt: oneMonthFromNow,
    }
  ]

  // Delete existing ads
  await prisma.ad.deleteMany()

  // Create new ads
  for (const ad of [...agentAds, ...bannerAds]) {
    await prisma.ad.create({
      data: ad
    })
  }

  console.log('✅ Ads seeded successfully')
} 