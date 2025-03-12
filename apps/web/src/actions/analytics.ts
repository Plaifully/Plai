'use server'

import { z } from "zod";
import { createServerAction } from "zsa";
import { prisma } from "@plai/db";
import { getIP } from "~/lib/rate-limiter";

// Schema for tracking impressions, views, and clicks
const trackSchema = z.object({
  slug: z.string(),
});

// Cache to prevent abuse (store IPs temporarily)
const viewCache = new Map<string, Set<string>>();
const clickCache = new Map<string, Set<string>>();

// Clear cache every hour to allow new views/clicks
setInterval(() => {
  viewCache.clear();
  clickCache.clear();
}, 60 * 60 * 1000);

// Server action to increment impression count
export const incrementImpression = createServerAction()
  .input(trackSchema)
  .handler(async ({ input }) => {
    const { slug } = input;
    
    try {
      await prisma.$executeRaw`
        UPDATE "Tool"
        SET "impressions" = "impressions" + 1
        WHERE "slug" = ${slug}
      `;
      
      return { success: true };
    } catch (error) {
      console.error("Error incrementing impression:", error);
      return { success: false };
    }
  });

// Server action to increment view count (with rate limiting)
export const incrementView = createServerAction()
  .input(trackSchema)
  .handler(async ({ input, ctx }) => {
    const { slug } = input;
    const ip = await getIP();
    
    try {
      // Check if this IP has already viewed this tool recently
      if (!viewCache.has(slug)) {
        viewCache.set(slug, new Set());
      }
      
      const toolViews = viewCache.get(slug);
      
      // If IP hasn't viewed this tool recently, increment view count
      if (toolViews && !toolViews.has(ip)) {
        await prisma.$executeRaw`
          UPDATE "Tool"
          SET "views" = "views" + 1
          WHERE "slug" = ${slug}
        `;
        
        // Add IP to cache to prevent abuse
        toolViews.add(ip);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error incrementing view:", error);
      return { success: false };
    }
  });

// Server action to increment click count (with rate limiting)
export const incrementClick = createServerAction()
  .input(trackSchema)
  .handler(async ({ input, ctx }) => {
    const { slug } = input;
    const ip = await getIP();
    
    try {
      // Check if this IP has already clicked this tool recently
      if (!clickCache.has(slug)) {
        clickCache.set(slug, new Set());
      }
      
      const toolClicks = clickCache.get(slug);
      
      // If IP hasn't clicked this tool recently, increment click count
      if (toolClicks && !toolClicks.has(ip)) {
        await prisma.$executeRaw`
          UPDATE "Tool"
          SET "clicks" = "clicks" + 1
          WHERE "slug" = ${slug}
        `;
        
        // Add IP to cache to prevent abuse
        toolClicks.add(ip);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error incrementing click:", error);
      return { success: false };
    }
  });

// Server action to get tool analytics
export const getToolAnalytics = createServerAction()
  .input(trackSchema)
  .handler(async ({ input }) => {
    const { slug } = input;
    
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: {
          impressions: true,
          views: true,
          clicks: true,
        },
      });
      
      if (!tool) {
        return {
          impressions: 0,
          views: 0,
          clicks: 0,
        };
      }
      
      return {
        impressions: tool.impressions,
        views: tool.views,
        clicks: tool.clicks,
      };
    } catch (error) {
      console.error("Error getting tool analytics:", error);
      return {
        impressions: 0,
        views: 0,
        clicks: 0,
      };
    }
  }); 