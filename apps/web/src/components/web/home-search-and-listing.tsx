"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import { AiSearchForm } from "~/components/web/ai-search-form"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Badge } from "~/components/web/ui/badge"
import type { ToolMany } from "~/server/web/tools/payloads"
import type { CategoryMany } from "~/server/web/categories/payloads"
import type { AdOne } from "~/server/web/ads/payloads"

interface HomeSearchAndListingProps {
  tools: ToolMany[]
  categories: CategoryMany[]
  ad?: AdOne
}

export function HomeSearchAndListing({ tools, categories, ad }: HomeSearchAndListingProps) {
  // State for AI search
  const [aiQuery, setAiQuery] = useState("")
  const [aiSearchResults, setAiSearchResults] = useState<ToolMany[]>([])
  const [isAiSearching, setIsAiSearching] = useState(false)
  const [isAiSearchActive, setIsAiSearchActive] = useState(false)
  
  // Function to rank tools based on relevance to search query
  const rankTools = (query: string, toolsToRank: ToolMany[]) => {
    if (!query.trim()) return toolsToRank
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/)
    
    return toolsToRank
      .map(tool => {
        const toolName = tool.name.toLowerCase()
        const toolTagline = (tool.tagline || "").toLowerCase()
        
        // Get category names for matching
        const categoryNames = (tool.categories || [])
          .map(cat => cat.name?.toLowerCase() || "")
          .filter(Boolean)
        
        // Combined content for matching
        const combinedContent = `${toolName} ${toolTagline} ${categoryNames.join(" ")}`
        
        let score = 0
        
        // Check for exact name match (highest priority)
        if (toolName === query.toLowerCase()) {
          score += 100
        }
        
        // Check for name contains full query
        if (toolName.includes(query.toLowerCase())) {
          score += 50
        }
        
        // Check for tagline contains full query
        if (toolTagline.includes(query.toLowerCase())) {
          score += 40
        }
        
        // Check for category matches (high priority)
        for (const category of categoryNames) {
          // If category directly matches any search term
          for (const term of searchTerms) {
            if (category.includes(term) || term.includes(category)) {
              score += 45
              break
            }
          }
        }
        
        // Check for word-by-word matches in name and tagline
        searchTerms.forEach(term => {
          // More weight for whole word matches
          if (toolName.split(/\s+/).some(word => word === term)) {
            score += 30
          } else if (toolName.includes(term)) {
            score += 20
          }
          
          if (toolTagline.split(/\s+/).some(word => word === term)) {
            score += 25
          } else if (toolTagline.includes(term)) {
            score += 15
          }
        })
        
        // Check for any search term in combined content
        if (searchTerms.some(term => combinedContent.includes(term))) {
          score += 5
        }
        
        // Boost score for premium and featured tools (with minimal weight)
        if (tool.tier === "Premium") {
          score += 5  // Higher weight for premium tools
        } else if (tool.tier === "Featured") {
          score += 3  // Medium weight for featured tools
        } else if (tool.tier === "Free") {
          score += 1  // Lowest weight for free tools
        }
        
        return { tool, score }
      })
      .filter(item => item.score > 0) // Only include relevant tools
      .sort((a, b) => b.score - a.score) // Sort by score (descending)
      .map(item => item.tool) // Extract just the tool data
  }
  
  // Handle AI search submission
  const handleAiSearch = async (query: string, isAiPowered: boolean) => {
    if (!query.trim() || !isAiPowered) return
    
    setAiQuery(query)
    setIsAiSearchActive(true)
    setIsAiSearching(true)
    
    // Simulate AI processing with a delay
    setTimeout(() => {
      setAiSearchResults(rankTools(query, tools))
      setIsAiSearching(false)
    }, 800)
  }
  
  // Reset AI search
  const resetAiSearch = () => {
    setAiQuery("")
    setAiSearchResults([])
    setIsAiSearchActive(false)
  }
  
  return (
    <div className="w-full">
      {/* AI Search Form */}
      <div className="w-full max-w-2xl mx-auto px-4 mb-10">
        <div className="relative">
          <AiSearchForm
            size="lg"
            buttonProps={{ 
              variant: "primary"
            }}
            onSearch={handleAiSearch}
            tools={tools}
            aiSearchOnly={true}
            initialValue={aiQuery}
            className={isAiSearchActive ? "mb-6" : ""}
          />
          
          {/* Display banner for AI search when active */}
          {isAiSearchActive && (
            <div className="w-full flex justify-center mt-5">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1.5 py-1 px-3 text-sm"
              >
                <Bot className="w-4 h-4 text-primary" />
                AI-powered search results for "{aiQuery}"
                
                <button
                  onClick={resetAiSearch}
                  className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  (Clear)
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-full border-t border-border mb-8"></div>
      
      {/* Show AI results or regular tools */}
      {isAiSearchActive ? (
        <div className="mb-16">
          <ToolQuery
            tools={aiSearchResults}
            categories={categories}
            perPage={10}
            ad={ad}
            isLoading={isAiSearching}
            disableSearch={false} // Allow filtering even with AI results
            aiQueryInfo={{
              query: aiQuery,
              isAiPowered: true
            }}
          />
        </div>
      ) : (
        <ToolQuery
          tools={tools}
          categories={categories}
          perPage={10}
          ad={ad}
        />
      )}
    </div>
  )
} 