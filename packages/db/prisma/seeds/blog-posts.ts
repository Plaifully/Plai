import { BlogPostStatus, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedBlogPosts() {
  console.log('Seeding blog posts...')

  // Set up dates
  const now = new Date()
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)
  
  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(now.getMonth() - 2)
  
  const futureDate = new Date(now)
  futureDate.setMonth(now.getMonth() + 1)

  // Find or create categories
  const developmentCategory = await prisma.category.findFirst({
    where: { slug: "development" }
  }) || await prisma.category.create({
    data: {
      name: "Development",
      slug: "development",
      label: "Dev",
    }
  })

  const aiCategory = await prisma.category.findFirst({
    where: { slug: "ai-ml" }
  }) || await prisma.category.create({
    data: {
      name: "AI & Machine Learning",
      slug: "ai-ml",
      label: "AI",
    }
  })

  const openSourceCategory = await prisma.category.findFirst({
    where: { slug: "open-source" }
  }) || await prisma.category.create({
    data: {
      name: "Open Source",
      slug: "open-source",
      label: "OSS",
    }
  })

  // Store categories for later use
  const categories = {
    development: developmentCategory,
    ai: aiCategory,
    openSource: openSourceCategory
  }

  // Delete existing blog posts
  await prisma.blogPost.deleteMany()

  // Sample blog posts
  const blogPosts = [
    {
      title: "Top 5 Open-Source Projects for Developers",
      slug: "top-5-open-source-projects-for-developers",
      description: "If you're a developer looking to improve your productivity, check out some outstanding open-source projects I've found. They can enhance your skills and streamline your workflow effectively.",
      content: `<div>
      <h1>Top 5 Open-Source Projects for Developers</h1>
      <p>Hey there, developers! We've got some awesome projects to share with you, created by talented coders just like you. No matter if you're new to the game or a seasoned pro, there's something here that'll catch your eye.</p>
      <p>These projects will help you with a variety of tasks like —</p>
      <ul>
        <li>Track, improve, and build better apps.</li>
        <li>Find and Fix code errors faster than ever</li>
        <li>Connect and organize your data for smarter decisions.</li>
        <li>See and fix issues in your app while keeping your data secure.</li>
        <li>Make your website analytics much easier and shareable.</li>
      </ul>
      <h2>1. PostHog</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/posthog.webp" alt="Posthog website og image" />
      </figure>
      <p>This project is a secret weapon for developers who want to build awesome websites and apps that users love to use.</p>
      <h2>2. Sentry</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/sentry.webp" alt="Sentry Hero Page" />
      </figure>
      <p>When your app has bugs, it can be frustrating and time-consuming to fix them. But with Sentry, you can resolve errors quickly and easily.</p>
      <h2>3. Airbyte</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/airbyte.webp" alt="Airbyte Landing Page" />
      </figure>
      <p>This project helps you make your data more useful, no matter where it is stored.</p>
      <h2>4. OpenReplay</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/openreplay.webp" alt="OpenReplay Hero Page" />
      </figure>
      <p>OpenReplay is like a time machine for your apps. It lets you watch exactly what your users are doing on your website or app.</p>
      <h2>5. Plausible</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/plausible.webp" alt="Plausible og image" />
      </figure>
      <p>Plausible is the cool, privacy-friendly analytics your website needs.</p>
      </div>`,
      image: "/content/top-5-open-source-projects-for-developers/thumbnail.webp",
      status: BlogPostStatus.Published,
      publishedAt: twoMonthsAgo,
      authorName: "Plaiful",
      authorImage: "/authors/plaiful-logo.png",
      authorTwitter: "PlaifulAi",
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
    },
    {
      title: "How AI Agents Companies Make Money?",
      slug: "how-open-source-companies-make-money",
      description: "Discover how companies and developers profit from AI Agents software despite its free nature. Explore the business models behind this tech revolution.",
      content: `<div>
      <h1>How AI Agents Companies Make Money?</h1>
      <p>In today's tech-driven world, AI Agents software has become a cornerstone of innovation and collaboration. From operating systems like Linux to web frameworks like React, AI Agents projects have revolutionized the way we develop and use technology. But amidst this culture of freely available code, a pressing question arises: <em>How do AI Agents companies actually make money?</em></p>
      <p>This article delves into the fascinating world of AI Agents business models, exploring <strong>six proven strategies that companies use to generate revenue</strong> while maintaining the spirit of open collaboration. Whether you're a developer considering launching an AI Agents project or a business leader looking to understand this unique ecosystem, read on to discover how companies turn free software into profitable ventures.</p>
      <figure>
        <img src="/content/open-source-money.avif" alt="Open Source Money" />
      </figure>
      <h2>1. Donations: The Power of Community Support</h2>
      <p>At its core, <strong>AI Agents is about community</strong>, and many projects rely on the generosity of their users for financial support. Platforms like <a href="/polar">Polar</a>, <a href="https://patreon.com">Patreon</a>, <a href="https://opencollective.com">Open Collective</a>, and <a href="https://github.com/sponsors">GitHub Sponsors</a> have made it easier than ever for individuals and organizations to contribute financially to the development and maintenance of AI Agents software.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>Projects set up donation pages or accounts on crowdfunding platforms.</li>
        <li>Users can make one-time or recurring donations.</li>
        <li>Funds are typically used for ongoing development, bug fixes, and infrastructure costs.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Allows passionate users to <strong>directly support</strong> projects they value.</li>
        <li>Can create a strong sense of <strong>community ownership</strong>.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Often <strong>unpredictable</strong> and may not provide a stable revenue stream.</li>
      </ul>
      </div>`,
      image: "/content/open-source-money.avif",
      status: BlogPostStatus.Published,
      publishedAt: oneMonthAgo,
      authorName: "Plaiful",
      authorImage: "/authors/plaiful-logo.png",
      authorTwitter: "PlaifulAi",
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
    },
    {
      title: "The Future of Web Development with AI",
      slug: "future-of-web-development-with-ai",
      description: "Explore how artificial intelligence is transforming web development practices and what developers need to know to stay ahead of the curve.",
      content: `<div>
      <h1>The Future of Web Development with AI</h1>
      <figure>
        <img src="/content/open-source-money.avif" alt="AI and Web Development" />
      </figure>
      <p>Artificial intelligence is rapidly changing how we build websites and web applications. From automated code generation to intelligent debugging tools, AI is becoming an essential part of the modern developer's toolkit.</p>
      <h2>Code Generation and Assistance</h2>
      <p>AI-powered tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code. These tools can suggest entire functions, help debug issues, and even explain complex code patterns.</p>
      <h2>Design Automation</h2>
      <p>AI is also transforming web design through tools that can generate layouts, suggest color schemes, and even create entire websites from simple text prompts.</p>
      <h2>Performance Optimization</h2>
      <p>Machine learning algorithms are being used to analyze website performance and suggest optimizations that can significantly improve loading times and user experience.</p>
      <h2>Personalization at Scale</h2>
      <p>AI enables websites to deliver highly personalized experiences to users based on their behavior, preferences, and history, all in real-time.</p>
      <h2>The Future is Collaborative</h2>
      <p>Rather than replacing developers, AI is becoming a collaborative partner that handles routine tasks and frees up human creativity for solving complex problems and innovation.</p>
      </div>`,
      image: "/content/open-source-money.avif", // Using a placeholder image
      status: BlogPostStatus.Draft,
      publishedAt: null,
      authorName: "Plaiful",
      authorImage: "/authors/plaiful-logo.png",
      authorTwitter: "PlaifulAi",
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Web Accessibility: Building for Everyone",
      slug: "web-accessibility-building-for-everyone",
      description: "Learn why web accessibility matters and how to implement inclusive design principles in your next project.",
      content: `<div>
      <h1>Web Accessibility: Building for Everyone</h1>
      <figure>
        <img src="/content/open-source-money.avif" alt="Web Accessibility" />
      </figure>
      <p>Web accessibility is not just a legal requirement but a moral imperative for developers. Creating websites that everyone can use, regardless of their abilities, is essential in our digital-first world.</p>
      <h2>Understanding WCAG Guidelines</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) provide a framework for making web content more accessible. Understanding these guidelines is the first step toward building inclusive websites.</p>
      <h2>Semantic HTML</h2>
      <p>Using proper HTML elements for their intended purpose provides a strong foundation for accessibility. Screen readers and other assistive technologies rely on semantic markup to interpret content correctly.</p>
      <h2>Keyboard Navigation</h2>
      <p>Ensuring that all interactive elements can be accessed and operated using only a keyboard is crucial for users who cannot use a mouse or touchscreen.</p>
      <h2>Color Contrast and Visual Design</h2>
      <p>Proper color contrast ensures that text is readable for users with visual impairments. Tools like contrast checkers can help verify that your design meets accessibility standards.</p>
      <h2>Testing with Real Users</h2>
      <p>The most effective way to ensure accessibility is to test with real users who have disabilities. Their feedback can provide insights that automated testing tools might miss.</p>
      </div>`,
      image: "/content/open-source-money.avif", // Using a placeholder image
      status: BlogPostStatus.Scheduled,
      publishedAt: futureDate,
      authorName: "Plaiful",
      authorImage: "/authors/plaiful-logo.png",
      authorTwitter: "PlaifulAi",
      createdAt: now,
      updatedAt: now,
    },
  ]

  // Create new blog posts
  for (const post of blogPosts) {
    const blogPost = await prisma.blogPost.create({
      data: {
        ...post,
        categories: {
          connect: [
            // Connect appropriate categories based on content
            ...(post.title.includes("Open-Source") || post.title.includes("Open Source") ? [{ id: categories.openSource.id }] : []),
            ...(post.title.includes("AI") || post.content.includes("AI") ? [{ id: categories.ai.id }] : []),
            ...(post.title.includes("Developers") || post.title.includes("Development") || post.title.includes("Web") ? [{ id: categories.development.id }] : [])
          ]
        }
      }
    })

    console.log(`Created blog post: ${blogPost.title}`)
  }

  console.log('✅ Blog posts seeded successfully')
} 