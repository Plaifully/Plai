import { PrismaClient, ToolStatus, ToolTier, PricingType } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedTools() {
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

  const productivityCategory = await prisma.category.create({
    data: {
      name: "Productivity",
      slug: "productivity",
      label: "Productivity",
    },
  })

  // Create topics
  const topics = await Promise.all([
    prisma.topic.create({ data: { slug: "chatbot" } }),
    prisma.topic.create({ data: { slug: "productivity" } }),
    prisma.topic.create({ data: { slug: "coding" } }),
    prisma.topic.create({ data: { slug: "ai-assistant" } }),
    prisma.topic.create({ data: { slug: "code-generation" } }),
    prisma.topic.create({ data: { slug: "ai-tools" } }),
  ])

  // Create tools with different tiers
  await prisma.tool.create({
    data: {
      name: "ChatGPT",
      slug: "chatgpt",
      website: "https://chat.openai.com",
      tagline: "Advanced language model for conversation and assistance",
      description: "ChatGPT is an AI-powered chatbot developed by OpenAI that can engage in human-like conversations, answer questions, generate content, and assist with various tasks.",
      content: `<h1>ChatGPT</h1>

<p>ChatGPT is a state-of-the-art language model developed by OpenAI, designed to understand and generate human-like text based on the input it receives.</p>

<h2>Key Features</h2>

<ul>
  <li><strong>Natural Conversations</strong>: Engage in flowing, coherent conversations on virtually any topic</li>
  <li><strong>Content Generation</strong>: Create essays, stories, poems, scripts, and more</li>
  <li><strong>Problem Solving</strong>: Get help with math problems, coding challenges, and logical puzzles</li>
  <li><strong>Information Retrieval</strong>: Access knowledge about a wide range of topics (with some limitations)</li>
  <li><strong>Language Translation</strong>: Translate between numerous languages</li>
  <li><strong>Summarization</strong>: Condense long texts into concise summaries</li>
  <li><strong>Code Assistance</strong>: Get help writing and debugging code in various programming languages</li>
</ul>

<h2>Versions</h2>

<ul>
  <li><strong>ChatGPT (Free)</strong>: Access to GPT-3.5 with basic features</li>
  <li><strong>ChatGPT Plus</strong>: Premium subscription offering GPT-4, DALL-E image generation, web browsing, and more</li>
</ul>

<p>ChatGPT has transformed how people interact with AI, making powerful language models accessible to everyone from students and professionals to creative writers and developers.</p>`,
      faviconUrl: "/seed/chatgpt-logo.jpg",
      status: ToolStatus.Published,
      tier: ToolTier.Premium,
      pricingType: PricingType.Freemium,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: productivityCategory.id }],
      },
      topics: {
        connect: [{ slug: "chatbot" }, { slug: "productivity" }, { slug: "ai-assistant" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "GitHub Copilot",
      slug: "github-copilot",
      website: "https://github.com/features/copilot",
      tagline: "AI pair programmer that helps you write better code",
      description: "GitHub Copilot is an AI-powered code completion tool that helps developers write code faster and with fewer errors by suggesting whole lines or blocks of code as you type.",
      content: `<h1>GitHub Copilot</h1>

<p>GitHub Copilot is an AI pair programmer that helps you write code faster and with less work. It draws context from comments and code to suggest individual lines and whole functions instantly.</p>

<h2>Key Features</h2>

<ul>
  <li><strong>Code Suggestions</strong>: Offers real-time code completions based on context and comments</li>
  <li><strong>Multiple Languages</strong>: Supports dozens of programming languages including Python, JavaScript, TypeScript, Ruby, Go, and more</li>
  <li><strong>IDE Integration</strong>: Works in Visual Studio Code, Visual Studio, JetBrains IDEs, and Neovim</li>
  <li><strong>Function Generation</strong>: Can generate entire functions based on descriptive comments</li>
  <li><strong>Test Generation</strong>: Helps create unit tests for your code</li>
  <li><strong>Documentation</strong>: Assists in writing documentation for your code</li>
  <li><strong>Learning Tool</strong>: Great for learning new programming languages and frameworks</li>
</ul>

<h2>How It Works</h2>

<p>GitHub Copilot is powered by OpenAI's Codex model, which was trained on billions of lines of public code. It understands both code and natural language, allowing it to generate code from descriptions.</p>

<h2>Pricing</h2>

<ul>
  <li><strong>Individual</strong>: $10/month or $100/year</li>
  <li><strong>Business</strong>: $19/user/month</li>
  <li><strong>Enterprise</strong>: Custom pricing</li>
  <li><strong>Free for verified students, teachers, and maintainers of popular open source projects</strong></li>
</ul>

<p>GitHub Copilot has revolutionized the coding experience for developers worldwide, significantly increasing productivity and helping programmers focus on higher-level problems rather than routine coding tasks.</p>`,
      faviconUrl: "/seed/github-copilot-logo.png",
      status: ToolStatus.Published,
      tier: ToolTier.Featured,
      pricingType: PricingType.Paid,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: devCategory.id }],
      },
      topics: {
        connect: [{ slug: "coding" }, { slug: "productivity" }, { slug: "code-generation" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "Claude",
      slug: "claude",
      website: "https://claude.ai",
      tagline: "Advanced AI assistant for various tasks",
      description: "Claude is an AI assistant created by Anthropic that excels at thoughtful, nuanced conversations and complex tasks including writing, analysis, and coding.",
      content: `<h1>Claude</h1>

<p>Claude is an AI assistant created by Anthropic, designed to be helpful, harmless, and honest. It's capable of a wide range of tasks from simple conversations to complex reasoning.</p>

<h2>Key Features</h2>

<ul>
  <li><strong>Thoughtful Conversations</strong>: Engage in nuanced, detailed discussions on complex topics</li>
  <li><strong>Long Context Window</strong>: Claude 3 Opus can process up to 200,000 tokens (roughly 150,000 words)</li>
  <li><strong>Document Analysis</strong>: Upload and analyze documents, spreadsheets, images, and more</li>
  <li><strong>Code Generation</strong>: Write, explain, and debug code in various programming languages</li>
  <li><strong>Content Creation</strong>: Draft essays, stories, marketing copy, and other written content</li>
  <li><strong>Research Assistance</strong>: Summarize articles, extract insights, and synthesize information</li>
  <li><strong>Multimodal Capabilities</strong>: Understand and respond to both text and images</li>
</ul>

<h2>Claude Models</h2>

<ul>
  <li><strong>Claude 3 Opus</strong>: Most powerful model with exceptional intelligence and reasoning</li>
  <li><strong>Claude 3 Sonnet</strong>: Balanced model offering strong performance with greater efficiency</li>
  <li><strong>Claude 3 Haiku</strong>: Fastest and most compact model for high-volume, rapid-response use cases</li>
</ul>

<h2>Availability</h2>

<p>Claude is available through:</p>
<ul>
  <li>Web interface at claude.ai</li>
  <li>API access for developers</li>
  <li>Integrations with platforms like Slack, Discord, and various enterprise solutions</li>
</ul>

<p>Claude stands out for its thoughtful responses, strong reasoning capabilities, and commitment to safety and ethical AI development.</p>`,
      faviconUrl: "/seed/claude-logo.svg",
      status: ToolStatus.Published,
      tier: ToolTier.Featured,
      pricingType: PricingType.Freemium,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: productivityCategory.id }],
      },
      topics: {
        connect: [{ slug: "chatbot" }, { slug: "ai-assistant" }, { slug: "productivity" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "Plaiful",
      slug: "plaiful",
      website: "https://plaiful.com",
      tagline: "Discover and compare the best AI tools for your needs",
      description: "Plaiful is a comprehensive directory of AI tools and resources, helping users discover, compare, and choose the right AI solutions for their specific needs.",
      content: `<h1>Plaiful</h1>

<p>Plaiful is your go-to platform for discovering and comparing the best AI tools available today. Whether you're a developer, marketer, designer, or business owner, Plaiful helps you find the perfect AI solutions to enhance your workflow.</p>

<h2>Key Features</h2>

<ul>
  <li><strong>Comprehensive Directory</strong>: Browse hundreds of AI tools across multiple categories</li>
  <li><strong>Detailed Comparisons</strong>: Compare features, pricing, and user reviews of similar tools</li>
  <li><strong>Expert Reviews</strong>: Get insights from AI experts on the strengths and limitations of each tool</li>
  <li><strong>Community Ratings</strong>: See what real users think about each tool</li>
  <li><strong>Latest Updates</strong>: Stay informed about new AI tools and major updates to existing ones</li>
  <li><strong>Personalized Recommendations</strong>: Receive tool suggestions based on your specific needs</li>
  <li><strong>Resource Library</strong>: Access guides, tutorials, and best practices for using AI tools effectively</li>
</ul>

<h2>Categories</h2>

<p>Plaiful covers AI tools in numerous categories including:</p>
<ul>
  <li>Content Generation</li>
  <li>Image & Video Creation</li>
  <li>Code Assistance</li>
  <li>Data Analysis</li>
  <li>Customer Support</li>
  <li>Marketing & SEO</li>
  <li>Design & UX</li>
  <li>Productivity</li>
  <li>And many more</li>
</ul>

<h2>Why Plaiful?</h2>

<p>In the rapidly evolving AI landscape, finding the right tools can be overwhelming. Plaiful cuts through the noise, saving you time and helping you make informed decisions about which AI tools to incorporate into your workflow.</p>

<p>Whether you're just starting to explore AI or looking to optimize your existing AI stack, Plaiful is your trusted guide to the world of artificial intelligence tools.</p>`,
      faviconUrl: "/seed/plaiful-logo-white.png",
      status: ToolStatus.Published,
      tier: ToolTier.Premium,
      pricingType: PricingType.Free,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: productivityCategory.id }],
      },
      topics: {
        connect: [{ slug: "ai-tools" }, { slug: "productivity" }],
      },
    },
  })

  await prisma.tool.create({
    data: {
      name: "Stack AI",
      slug: "stack-ai",
      website: "https://stack-ai.com",
      tagline: "Build AI apps without code",
      description: "Stack AI is a no-code platform that allows anyone to build, deploy, and share AI applications without writing a single line of code.",
      content: `<h1>Stack AI</h1>

<p>Stack AI is a powerful no-code platform that democratizes AI application development, allowing anyone to build sophisticated AI workflows and applications without coding experience.</p>

<h2>Key Features</h2>

<ul>
  <li><strong>Visual Workflow Builder</strong>: Create complex AI pipelines through an intuitive drag-and-drop interface</li>
  <li><strong>Pre-built Components</strong>: Access a library of ready-to-use AI components for various tasks</li>
  <li><strong>Model Integration</strong>: Easily incorporate models from OpenAI, Anthropic, Stability AI, and more</li>
  <li><strong>Custom Functions</strong>: Add custom Python functions when needed for advanced use cases</li>
  <li><strong>Data Connections</strong>: Connect to databases, APIs, and various data sources</li>
  <li><strong>One-Click Deployment</strong>: Deploy your AI applications with a single click</li>
  <li><strong>Sharing & Collaboration</strong>: Share your applications with team members or the public</li>
  <li><strong>Usage Analytics</strong>: Track how your applications are being used</li>
</ul>

<h2>Use Cases</h2>

<ul>
  <li><strong>Content Generation</strong>: Create systems for generating articles, marketing copy, or creative content</li>
  <li><strong>Data Processing</strong>: Build workflows that extract, transform, and analyze data</li>
  <li><strong>Customer Support</strong>: Develop AI-powered chatbots and support systems</li>
  <li><strong>Research Assistance</strong>: Create tools for literature review, data analysis, and insight generation</li>
  <li><strong>Personalization</strong>: Build recommendation systems and personalized experiences</li>
  <li><strong>Document Processing</strong>: Develop applications for extracting information from documents</li>
</ul>

<h2>Pricing</h2>

<ul>
  <li><strong>Free Tier</strong>: Limited usage for personal projects</li>
  <li><strong>Pro</strong>: $29/month for individuals with higher usage limits</li>
  <li><strong>Team</strong>: $99/month for collaborative teams</li>
  <li><strong>Enterprise</strong>: Custom pricing for organizations with advanced needs</li>
</ul>

<p>Stack AI is transforming how AI applications are built, making powerful AI capabilities accessible to everyone from entrepreneurs and creators to researchers and enterprise teams.</p>`,
      faviconUrl: "/seed/stack-ai-logo.png",
      status: ToolStatus.Published,
      tier: ToolTier.Free,
      pricingType: PricingType.Freemium,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: aiCategory.id }, { id: devCategory.id }],
      },
      topics: {
        connect: [{ slug: "ai-tools" }, { slug: "productivity" }],
      },
    },
  })

  console.log('✅ Tools, categories, and topics seeded successfully')
} 