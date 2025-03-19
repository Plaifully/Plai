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
      name: "AI Analytics Pro",
      description: "Real-time AI analytics and monitoring",
      email: "hello@aianalytics.pro",
      website: "https://aianalytics.pro",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.Agent,
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
      placement: AdPlacement.Agent,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Content Creator",
      description: "Generate high-quality content with AI",
      email: "create@aicontent.studio",
      website: "https://aicontent.studio",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.BlogPost,
      placement: AdPlacement.Agent,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
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
    }, 
    {
      name: "AI Development Suite",
      description: "Complete toolkit for AI application development",
      email: "contact@aidev.suite",
      website: "https://aidev.suite",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.HorizontalTop,
      imageUrl: "/placeholders/horizontal-468x60.svg",
      width: 468,
      height: 60,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Development Suite",
      description: "Complete toolkit for AI application development",
      email: "contact@aidev.suite",
      website: "https://aidev.suite",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.ToolPage,
      placement: AdPlacement.HorizontalBottom,
      imageUrl: "/placeholders/horizontal-468x60.svg",
      width: 468,
      height: 60,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    // Blog Post Ads
    {
      name: "AI Writing Assistant",
      description: "Enhance your writing with AI-powered suggestions",
      email: "hello@aiwriting.app",
      website: "https://aiwriting.app",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.BlogPost,
      placement: AdPlacement.VerticalRight,
      imageUrl: "/placeholders/vertical-120x600.svg",
      width: 120,
      height: 600,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Blog Generator",
      description: "Create engaging blog content with AI",
      email: "info@aiblog.generator",
      website: "https://aiblog.generator",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.BlogPost,
      placement: AdPlacement.HorizontalTop,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
      startsAt: now,
      endsAt: oneMonthFromNow,
    },
    {
      name: "AI Content Analytics",
      description: "Analyze and optimize your content with AI",
      email: "support@aicontentanalytics.com",
      website: "https://aicontentanalytics.com",
      faviconUrl: "/plaiful-logo-white.png",
      type: AdType.BlogPost,
      placement: AdPlacement.HorizontalBottom,
      imageUrl: "/placeholders/horizontal-728x90.svg",
      width: 728,
      height: 90,
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