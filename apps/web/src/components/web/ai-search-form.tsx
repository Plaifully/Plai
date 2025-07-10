"use client"

import { Bot, Loader2, SearchIcon } from "lucide-react"
import { useState } from "react"
import type { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"
import type { ToolMany } from "~/server/web/tools/payloads"

type AiSearchFormProps = HTMLAttributes<HTMLFormElement> & {
  size?: "sm" | "lg"
  buttonProps?: React.ComponentProps<"button"> & {
    variant?: string
  }
  onSearch?: (query: string, isAiPowered: boolean) => void
  tools?: ToolMany[]
  aiSearchOnly?: boolean
  initialValue?: string
}

// Simple utility function for class names
const cn = (...inputs: (string | undefined | null | false)[]) => {
  return twMerge(inputs.filter(Boolean).join(" "))
}

// Function to detect potential jailbreak attempts
function containsJailbreakAttempt(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Common jailbreak indicators
  const jailbreakPatterns = [
    "ignore previous instructions",
    "ignore all previous prompts",
    "disregard your instructions",
    "forget your instructions",
    "ignore your programming",
    "system prompt",
    "you are now",
    "act as",
    "you are a",
    "you're a",
    "you're now",
    "you are now",
    "ignore safety",
    "bypass",
    "restrictions",
    "ignore rules",
    "ignore guidelines",
  ];
  
  return jailbreakPatterns.some(pattern => lowerQuery.includes(pattern));
}

export const AiSearchForm = ({
  className,
  size = "sm",
  buttonProps,
  onSearch,
  tools = [],
  aiSearchOnly = false,
  initialValue = "",
  ...props
}: AiSearchFormProps) => {
  const [query, setQuery] = useState(initialValue)
  const [isPending, setIsPending] = useState(false)
  const [isAiPowered, setIsAiPowered] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    // Check for potential jailbreak attempts
    if (containsJailbreakAttempt(query)) {
      setError(new Error("Invalid search query. Please try a different search term."))
      return
    }
    
    try {
      setIsPending(true)
      setError(null)
      
      // Add a small delay to make it feel like it's processing
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Pass the search query to the parent component
      onSearch?.(query, isAiPowered)
      
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err : new Error("An error occurred"))
    } finally {
      setIsPending(false)
    }
  }

  // Calculate height based on size
  const height = size === "lg" ? "h-12" : "h-10";

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3"
        {...props}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className={cn("flex-1 flex items-center overflow-hidden rounded-md border border-input bg-background shadow-sm hover:shadow transition-shadow", height)}>
            <div className="flex items-center justify-center px-3 text-muted">
              <Bot className={cn("h-4 w-4", "text-primary")} />
            </div>
            <input
              type="text"
              placeholder={aiSearchOnly 
                ? "Ask AI to find the perfect tool for you..." 
                : "What AI tool are you looking for?"}
              className={cn(
                "flex w-full border-0 bg-transparent px-0 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
                size === "lg" ? "text-base" : ""
              )}
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                // Clear error when user types
                if (error) setError(null)
              }}
              aria-label="Search for AI tools"
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending || !query.trim()}
            className={cn(
              "flex items-center justify-center gap-1 rounded-md font-medium shadow-sm",
              "bg-orange-500 text-white hover:bg-orange-600",
              "transition-transform hover:rotate-3",
              height,
              size === "lg" ? "min-w-32 px-8 text-sm" : "min-w-32 px-4 text-sm",
              "disabled:pointer-events-none disabled:opacity-50",
              buttonProps?.className
            )}
            {...buttonProps}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <SearchIcon className="h-4 w-4" />
                <span>AI Search</span>
              </>
            )}
          </button>
        </div>
        
        {!aiSearchOnly && (
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer user-select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isAiPowered}
                onChange={(e) => setIsAiPowered(e.target.checked)}
              />
              <span className="flex items-center gap-1">
                <Bot className="h-3.5 w-3.5 text-primary" />
                AI-powered search 
                <span className="text-xs text-muted-foreground">(finds more relevant results)</span>
              </span>
            </label>
          </div>
        )}
      </form>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error.message || "An error occurred. Please try again."}
        </p>
      )}
      
      {aiSearchOnly && (
        <p className="text-xs text-secondary italic text-center mt-1">
          Powered by AI to find the most relevant tools for your needs
        </p>
      )}
    </div>
  )
} 