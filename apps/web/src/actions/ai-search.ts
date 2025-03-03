import { OpenAI } from "openai";
import { z } from "zod";
import { createServerActionProcedure } from "zsa";
import { isRateLimited, getIP } from "~/lib/rate-limiter";
import { prisma } from "@plai/db";
import { ToolStatus, ToolTier } from "@plai/db/client";
import { env } from "~/env";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Schema for AI search input
export const aiSearchSchema = z.object({
  query: z.string().min(1).max(200),
});

export type AiSearchSchema = z.infer<typeof aiSearchSchema>;

// Server action for AI search
export const aiSearch = createServerActionProcedure()
  .input(aiSearchSchema)
  .handler(async ({ input }) => {
    const ip = await getIP();
    const { query } = input;
    
    // Rate limiting
    if (await isRateLimited(ip, "ai-search")) {
      throw new Error("Too many search requests. Please try again later.");
    }

    try {
      // Get all published tools from database
      const allTools = await prisma.tool.findMany({
        where: { status: ToolStatus.Published },
        select: {
          id: true,
          name: true,
          tagline: true,
          description: true,
          content: true,
          tier: true,
          website: true,
          slug: true,
          screenshotUrl: true,
          faviconUrl: true,
        },
      });

      if (allTools.length === 0) {
        return { tools: [] };
      }

      // Create prompt for OpenAI to find relevant tools
      const prompt = `
        You are an AI assistant that helps users find the most relevant AI tools based on their query.
        
        USER QUERY: "${query}"
        
        AVAILABLE TOOLS:
        ${JSON.stringify(
          allTools.map((tool) => ({
            id: tool.id,
            name: tool.name,
            tagline: tool.tagline,
            description: tool.description,
            content: tool.content?.substring(0, 300), // Limit content length to avoid token limit
            tier: tool.tier,
          }))
        )}
        
        Please analyze the tools and select the most relevant ones for the user's query. Return the IDs of the top 10 most relevant tools in order of relevance. 
        IMPORTANT: Give priority to Premium and Featured tier tools over Free tier tools, but only if they are relevant to the query.
        
        Return ONLY a JSON array of tool IDs, nothing else.
      `;

      // Call OpenAI API to get relevant tool IDs
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message.content;
      if (!content) {
        return { tools: [] };
      }

      // Parse response to get tool IDs
      let toolIds: string[] = [];
      try {
        // Extract JSON array from the response
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          toolIds = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        return { tools: [] };
      }

      if (toolIds.length === 0) {
        return { tools: [] };
      }

      // Get the actual tools data in the order provided by OpenAI
      const toolsMap = new Map(allTools.map(tool => [tool.id, tool]));
      
      const aiSortedTools = toolIds
        .map(id => toolsMap.get(id))
        .filter(Boolean); // Remove any undefined entries
      
      return {
        tools: aiSortedTools,
        aiPowered: true,
      };
    } catch (error) {
      console.error("AI search error:", error);
      
      // Fallback to regular search if AI fails
      const fallbackTools = await prisma.tool.findMany({
        where: {
          status: ToolStatus.Published,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: [
          { tier: "desc" }, // Sort by tier to prioritize premium tools
          { publishedAt: "desc" }, // Then by publish date
        ],
        select: {
          id: true,
          name: true,
          tagline: true,
          description: true,
          tier: true,
          website: true,
          slug: true,
          screenshotUrl: true,
          faviconUrl: true,
        },
        take: 10,
      });
      
      return {
        tools: fallbackTools,
        aiPowered: false,
      };
    }
  }); 