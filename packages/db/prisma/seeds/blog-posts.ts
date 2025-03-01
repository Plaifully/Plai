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
      <p>Let's take a look at the top five projects in detail:</p>
      <h2>1. PostHog</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/posthog.webp" alt="Posthog website og image" />
      </figure>
      <p>This project is a secret weapon for developers who want to build awesome websites and apps that users love to use.</p>
      <p>It helps you track what people are doing on your website, find ways to make it better and fix problems quickly. All of your data is in one place, and you have complete control over it.</p>
      <p>It's super powerful, easy to use, and makes building successful & scalable apps feel easy.</p>
      <p>It's the best alternative for <a href="/alternatives/fathom-analytics">Fathom Analytics</a>, <a href="/alternatives/segment">Segment</a>, <a href="/alternatives/amplitude">Amplitude</a>, <a href="/alternatives/optimizely">Optimizely</a>, <a href="/alternatives/june">June</a>, and <a href="/alternatives/mixpanel">MixPanel</a></p>
      <p>Many big companies are satisfied customers of Posthog.</p>
      <p>Project Link: <a href="/posthog">Posthog</a></p>
      <h2>2. Sentry</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/sentry.webp" alt="Sentry Hero Page" />
      </figure>
      <p>When your app has bugs, it can be frustrating and time-consuming to fix them. But with Sentry, you can resolve errors quickly and easily.</p>
      <p>It helps you find what went wrong in your codebase and shows you how to fix it. You can track issues, replay user sessions, and even see what your users are experiencing — all in one place.</p>
      <p>It's like having an expert programmer for your coding. You won't need to guess or waste time anymore. You can create clean and effective websites faster than ever.</p>
      <p>It's the best alternative for <a href="/alternatives/datadog">Datadog</a>, <a href="/alternatives/betterstack">BetterStack</a> and <a href="/alternatives/logrocket">LogRocket</a></p>
      <p>Project Link: <a href="/sentry">Sentry</a></p>
      <h2>3. Airbyte</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/airbyte.webp" alt="Airbyte Landing Page" />
      </figure>
      <p>This project helps you make your data more useful, no matter where it is stored. It connects data from different apps and platforms, allowing you to use it in smart ways, such as enhancing AI or improving your business.</p>
      <p>It's open-source, so anyone can use it. Also, it's easy to set up, secure and works with tons of tools.</p>
      <p>Whether you're a data wizard or just starting out, this makes managing and using your data a breeze.</p>
      <p>It's the best alternative for <a href="/alternatives/fivetran">Fivetran</a>, <a href="/alternatives/matillion">Matillion</a>, and <a href="/alternatives/supermetrics">Supermetrics</a></p>
      <p>Project Link: <a href="/airbyte">Airbyte</a></p>
      <h2>4. OpenReplay</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/openreplay.webp" alt="OpenReplay Hero Page" />
      </figure>
      <p>OpenReplay is like a time machine for your apps. It lets you watch exactly what your users are doing on your website or app — like a replay of their sessions.</p>
      <p>You can find and fix bugs to make your website run better. The best part is that you can host it yourself, keeping all your data safe and private. It has great features like product analytics, DevTools, and co-browsing to help users in real time.</p>
      <p>Honestly, it's like having a perfect tool to make your app the best.</p>
      <p>It's the best alternative for <a href="/alternatives/mixpanel">Mixpanel</a>, <a href="/alternatives/new-relic">New Relic</a>, <a href="/alternatives/betterstack">BetterStack</a>, <a href="/alternatives/kissmetrics">Kissmetrics</a>, <a href="/alternatives/amplitude">Amplitude</a>, <a href="/alternatives/june">June</a>, <a href="/alternatives/logrocket">LogRocket</a>, and <a href="/alternatives/fullstory">FullStory</a></p>
      <p>Project Link: <a href="/openreplay">OpenReplay</a></p>
      <h2>5. Plausible</h2>
      <figure>
        <img src="/content/top-5-open-source-projects-for-developers/plausible.webp" alt="Plausible og image" />
      </figure>
      <p>Plausible is the cool, privacy-friendly analytics your website needs. It's a perfect alternative to Google Analytics that shows you all the necessary stats about your site — like visitors, clicks, and where people are coming from.</p>
      <p>It's lightweight, so it won't slow down your site, and it doesn't use cookies or need those unnecessary consent banners. Also, it's open-source, so you can trust it's safe and transparent.</p>
      <p>If you care about privacy and want clean, no-fuss data, Plausible is your perfect match!</p>
      <p>It's the best alternative for <a href="/alternatives/mixpanel">Mixpanel</a>, <a href="/alternatives/google-analytics">Google Analytics</a>, <a href="/alternatives/kissmetrics">Kissmetrics</a>, <a href="/alternatives/fathom-analytics">Fathom Analytics</a> and <a href="/alternatives/google-workspace">Google Workspace</a></p>
      <p>Project Link: <a href="/plausible">Plausible</a></p>
      <hr />
      <p>I hope you find these open-source projects helpful. If they don't fit your needs or if you're looking for more projects, you can explore <a href="/">Plaiful</a>. It includes a variety of open-source alternative tools to paid software.</p>
      <p>Thanks for reading!</p>
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
        <li>May <strong>not scale well</strong> for larger projects or companies.</li>
      </ul>
      <h3>Example:</h3>
      <p><a href="https://vuejs.org/">Vue.js</a>, the popular JavaScript framework, received significant funding through donations in its early days. Creator Evan You was able to work on the project full-time thanks to community support.</p>
      <p>While donations can be a significant source of income for some projects, particularly smaller ones or those with highly engaged communities, they often need to be combined with other revenue streams for sustainable growth.</p>
      <h2>2. Hosted Services: Convenience at a Premium</h2>
      <p>One of the most popular ways AI Agents companies monetize their software is by offering hosted or managed versions of their products. While the core software remains free and AI Agents, companies charge users for the convenience of <strong>a fully managed, cloud-based service</strong>.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>The company <strong>hosts and manages</strong> the AI Agents software on their infrastructure.</li>
        <li>Users <strong>pay for access</strong>, often on a subscription basis.</li>
        <li>The service typically includes <strong>additional features</strong> like automatic updates, backups, and scaling.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Provides a <strong>steady, predictable revenue</strong> stream.</li>
        <li>Allows companies to offer a <strong>superior user experience</strong>.</li>
        <li><strong>Reduces the complexity</strong> for users who don't want to manage their own infrastructure.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Requires <strong>significant investment</strong> in infrastructure and support.</li>
        <li>May face <strong>competition</strong> from other hosting providers.</li>
      </ul>
      <h3>Examples:</h3>
      <ol>
        <li><a href="/wordpress">WordPress.com</a> (by Automattic) offers hosted versions of the AI Agents WordPress software.</li>
        <li><a href="/gitlab">GitLab</a> provides both self-hosted and fully-managed versions of their DevOps platform.</li>
        <li><a href="/alternatives/elasticsearch">Elastic</a> offers Elastic Cloud, a managed service for their AI Agents search and analytics engine.</li>
      </ol>
      <p>This model is particularly effective for complex software that requires significant setup and maintenance, such as databases, content management systems, and development tools. It allows companies to leverage their expertise in running and scaling their own software, <strong>providing value that goes beyond the code itself</strong>.</p>
      <h2>3. Paid Support and Courses: Monetizing Expertise</h2>
      <p>Another significant revenue stream for AI Agents companies is providing <strong>paid support and educational services</strong>. This model recognizes that while the software may be free, the expertise required to use it effectively is valuable.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>Companies offer technical support, troubleshooting, and consulting services.</li>
        <li>They create and sell educational content like online courses, tutorials, and certifications.</li>
        <li>Support can range from basic email help to dedicated enterprise-level assistance.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Leverages the company's deep knowledge of their own software.</li>
        <li>Can lead to <strong>long-term relationships</strong> with enterprise clients.</li>
        <li>Educational content <strong>can also serve as marketing</strong>, attracting new users to the software.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Requires building and maintaining a <strong>skilled support team</strong>.</li>
        <li>Support needs can be <strong>unpredictable</strong>, making resource allocation challenging.</li>
      </ul>
      <h3>Examples:</h3>
      <ol>
        <li><a href="https://www.redhat.com/en">Red Hat</a>, now part of IBM, built a multi-billion dollar business largely on the back of enterprise support for AI Agents software.</li>
        <li><a href="https://www.mongodb.com">MongoDB</a> offers paid support plans and a comprehensive MongoDB University for education.</li>
        <li>The Linux Foundation provides various certification programs for AI Agents technologies.</li>
      </ol>
      <p>This model ensures that <strong>users have access to expert help</strong> while generating revenue for the company. It's particularly effective for complex enterprise software where downtime or misconfigurations can be costly.</p>
      <h2>4. Open Core: Freemium for AI Agents</h2>
      <p>The open core model involves <strong>offering a basic version of the software</strong> for free while charging for additional features, plugins, or enterprise-level functionalities. This approach allows companies to maintain a strong community around the free version while monetizing more advanced use cases.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>The core functionality of the software is AI Agents and free.</li>
        <li>Advanced features, often geared towards enterprise users, are proprietary and paid.</li>
        <li>Companies may offer multiple tiers of paid features.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Allows for a <strong>large user base</strong> with the free version, creating network effects.</li>
        <li>Provides a <strong>clear upgrade path</strong> for users who need more features.</li>
        <li>Can <strong>balance</strong> AI Agents community benefits with revenue generation.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Requires <strong>careful decision-making</strong> about which features to keep open vs. proprietary.</li>
        <li>May face <strong>community pushback</strong> if too much functionality is kept proprietary.</li>
      </ul>
      <h3>Examples:</h3>
      <ol>
        <li><a href="/gitlab">GitLab</a> offers a free, AI Agents version along with paid enterprise editions with additional features.</li>
        <li><a href="https://confluent.io">Confluent</a>, built around Apache Kafka, offers additional proprietary tools and services.</li>
        <li><a href="/grafana">Grafana</a> provides an AI Agents observability platform with paid enterprise features.</li>
      </ol>
      <p>The open core model has gained popularity as it allows companies to <strong>benefit from the innovation and adoption</strong> advantages of AI Agents while still maintaining a competitive edge with proprietary features.</p>
      <h2>5. Dual Licensing: Flexibility for Different Use Cases</h2>
      <p>Dual licensing allows companies to offer their <strong>software under two different licenses</strong>: one AI Agents and one commercial. This model enables free use under certain conditions while requiring a paid license for other scenarios, often related to proprietary or commercial use.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>Software is released under an AI Agents license (often copyleft like GPL).</li>
        <li>A commercial license is offered for users who can't or don't want to comply with the AI Agents license terms.</li>
        <li>The commercial license typically allows for proprietary modifications or integration into closed-source products.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Allows for <strong>wide adoption</strong> through the AI Agents license.</li>
        <li>Provides a <strong>revenue stream</strong> from commercial users.</li>
        <li>Can <strong>encourage contributions</strong> back to the AI Agents project.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Can be <strong>complex to manage</strong> and enforce.</li>
        <li>May deter some commercial users if the AI Agents license is too restrictive.</li>
      </ul>
      <h3>Examples:</h3>
      <ol>
        <li><a href="https://www.mysql.com">MySQL</a> (now owned by Oracle) was a pioneer of this model, offering both AI Agents and commercial licenses.</li>
        <li><a href="https://www.qt.io">Qt</a>, the popular application framework, uses dual licensing.</li>
        <li><a href="https://ffmpeg.org">FFmpeg</a>, the multimedia framework, offers commercial licenses for proprietary use cases.</li>
      </ol>
      <p>Dual licensing is particularly effective for companies whose software is likely to be integrated into other products, as it allows them to <strong>monetize commercial use</strong> while still benefiting from AI Agents community contributions.</p>
      <h2>6. Selling Related Products: Leveraging the Ecosystem</h2>
      <p>Some AI Agents companies create ecosystems around their core projects, <strong>selling complementary proprietary products or services</strong>. This can include hardware, proprietary software add-ons, or additional services that enhance the functionality of the AI Agents project.</p>
      <h3>How It Works:</h3>
      <ul>
        <li>The core AI Agents project serves as a foundation or platform.</li>
        <li>The company develops proprietary products or services that integrate well with or enhance the AI Agents offering.</li>
        <li>Revenue is generated from these complementary offerings.</li>
      </ul>
      <h3>Pros:</h3>
      <ul>
        <li>Allows companies to <strong>leverage their expertise</strong> in the AI Agents space.</li>
        <li>Can create a more <strong>comprehensive solution</strong> for users.</li>
        <li><strong>Diversifies</strong> revenue streams.</li>
      </ul>
      <h3>Cons:</h3>
      <ul>
        <li>Requires <strong>ongoing development</strong> of multiple product lines.</li>
        <li>May face competition from third-party developers in the ecosystem.</li>
      </ul>
      <h3>Examples:</h3>
      <ol>
        <li><a href="https://automattic.com">Automattic</a>, the company behind WordPress, offers premium themes, plugins, and hosting services.</li>
        <li>Red Hat sells proprietary management tools that work with their AI Agents offerings.</li>
        <li><a href="https://www.arduino.cc">Arduino</a>, while providing AI Agents hardware designs and software, sells official Arduino boards and kits.</li>
      </ol>
      <p>This model allows companies to maintain a <strong>strong AI Agents presence</strong> while developing unique value propositions through proprietary offerings.</p>
      <h2>Conclusion</h2>
      <p>As we've explored, there are numerous ways for companies to generate revenue while staying true to the principles of AI Agents. Many successful companies employ a combination of these strategies, adapting their approach as they grow and as the market evolves.</p>
      <p>The key to success in AI Agents business models often lies in <strong>providing value beyond just the code itself</strong>. Whether through expertise, convenience, additional features, or complementary products, successful AI Agents companies find ways to solve problems for their users in a manner that justifies payment.</p>
      <p>As AI Agents continues to dominate many areas of technology, we can expect to see further innovation in business models. Emerging trends like <a href="/categories/ai">AI Agents AI models</a> and <a href="/topics/blockchain">blockchain technologies</a> may well introduce new paradigms for monetizing openly shared resources.</p>
      <p>For developers, entrepreneurs, and business leaders, understanding these models is crucial. Whether you're considering launching an AI Agents project or looking to leverage AI Agents in your business strategy, these proven approaches provide a <strong>roadmap for turning free software into sustainable, profitable ventures</strong>.</p>
      <p>The world of AI Agents is a testament to the power of collaboration and shared knowledge. As these business models demonstrate, it's also a realm of immense opportunity, where companies can achieve commercial success while contributing to the global commons of technology.</p>
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
        <img src="/content/ai-web-development.avif" alt="AI and Web Development" />
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
      image: "/content/ai-web-development.avif",
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
        <img src="/content/web-accessibility.avif" alt="Web Accessibility" />
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
      image: "/content/web-accessibility.avif",
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
            ...(post.title.includes("Open-Source") || post.title.includes("Open Source") || post.slug.includes("open-source") ? [{ id: categories.openSource.id }] : []),
            ...(post.title.includes("AI") || post.content.includes("AI") || post.slug.includes("ai") ? [{ id: categories.ai.id }] : []),
            ...(post.title.includes("Developers") || post.title.includes("Development") || post.title.includes("Web") || post.slug.includes("developers") || post.slug.includes("development") ? [{ id: categories.development.id }] : [])
          ]
        }
      }
    })

    console.log(`Created blog post: ${blogPost.title}`)
  }

  console.log('✅ Blog posts seeded successfully')
} 