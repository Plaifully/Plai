"use client";

import { PricingType } from "@plai/db/client";
import { useMemo, useState, useEffect } from "react";
import { Bot, MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ToolFilters } from "~/components/web/tools/tool-filters";
import { ToolList } from "~/components/web/tools/tool-list";
import { ToolListSkeleton } from "~/components/web/tools/tool-list";
import { Input } from "~/components/web/ui/input";
import { Button } from "~/components/web/ui/button";
import { Stack } from "~/components/common/stack";
import { Badge } from "~/components/web/ui/badge";
import type { CategoryMany } from "~/server/web/categories/payloads";
import type { ToolMany } from "~/server/web/tools/payloads";
import type { AdOne } from "~/server/web/ads/payloads";

type ToolQueryProps = {
  tools: ToolMany[];
  categories: CategoryMany[];
  perPage: number;
  placeholder?: string;
  ad?: AdOne;
  isLoading?: boolean;
  disableSearch?: boolean;
  aiQueryInfo?: {
    query: string;
    isAiPowered: boolean;
  };
};

type SortOption = {
  label: string;
  value: string;
  sortFn: (a: ToolMany, b: ToolMany) => number;
};

const sortOptions: SortOption[] = [
  {
    label: "Latest",
    value: "latest",
    sortFn: (a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    },
  },
  {
    label: "Oldest",
    value: "oldest",
    sortFn: (a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    label: "A-Z",
    value: "az",
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    label: "Z-A",
    value: "za",
    sortFn: (a, b) => b.name.localeCompare(a.name),
  },
];

const ClientPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <Stack direction="row" className="items-center justify-center gap-2 mt-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        prefix={<MoveLeftIcon className="size-4" />}
      >
        Previous
      </Button>

      <span className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        suffix={<MoveRightIcon className="size-4" />}
      >
        Next
      </Button>
    </Stack>
  );
};

// Function to rank tools based on relevance to search query
const rankTools = (query: string, toolsToRank: ToolMany[]) => {
  if (!query.trim()) return toolsToRank;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  // Calculate relevance scores for each tool
  return toolsToRank
    .map(tool => {
      const toolName = tool.name.toLowerCase();
      const toolTagline = (tool.tagline || "").toLowerCase();
      const combinedContent = `${toolName} ${toolTagline}`;
      
      let score = 0;
      
      // Check for exact name match (highest priority)
      if (toolName === query.toLowerCase()) {
        score += 100;
      }
      
      // Check for name contains query
      if (toolName.includes(query.toLowerCase())) {
        score += 50;
      }
      
      // Check for tagline contains query
      if (toolTagline.includes(query.toLowerCase())) {
        score += 30;
      }
      
      // Check for word-by-word matches
      searchTerms.forEach(term => {
        if (toolName.includes(term)) {
          score += 20;
        }
        if (toolTagline.includes(term)) {
          score += 10;
        }
      });
      
      // Check for any search term in combined content
      if (searchTerms.some(term => combinedContent.includes(term))) {
        score += 5;
      }
      
      // Boost score for premium tools
      if (tool.pricingType === "Paid") {
        score += 15;
      } else if (tool.pricingType === "Freemium") {
        score += 10;
      }
      
      return { tool, score };
    })
    .filter(item => item.score > 0) // Only include relevant tools
    .sort((a, b) => b.score - a.score) // Sort by score (descending)
    .map(item => item.tool); // Extract just the tool data
};

const ToolQuery = ({
  tools,
  perPage,
  categories,
  placeholder,
  ad,
  isLoading = false,
  disableSearch = false,
  aiQueryInfo,
}: ToolQueryProps) => {
  const searchParams = useSearchParams();
  // Use regular search query from URL if not in AI search mode
  const initialQuery = !aiQueryInfo ? (searchParams.get("q") || "") : "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricingTypes, setSelectedPricingTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("latest");

  // Reset filters when switching between AI and regular search
  useEffect(() => {
    setCurrentPage(1);
  }, [aiQueryInfo]);

  // Filter tools based on search query, categories, and pricing types
  const filteredTools = useMemo(() => {
    // If loading or using AI results, don't apply the search query filter
    // but still apply category and pricing filters
    let filtered = [...tools];

    // Apply search filter if this is not AI search results
    if (searchQuery && !aiQueryInfo) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          (tool.tagline?.toLowerCase() || "").includes(query)
      );
    }

    // Always apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((tool) =>
        tool.categories.some((category) =>
          selectedCategories.includes(category.slug)
        )
      );
    }

    // Always apply pricing type filter
    if (selectedPricingTypes.length > 0) {
      filtered = filtered.filter((tool) =>
        selectedPricingTypes.includes(tool.pricingType)
      );
    }

    // Apply sorting unless using AI search results
    if (!aiQueryInfo) {
      const sortOption = sortOptions.find((option) => option.value === sortBy);
      if (sortOption) {
        filtered.sort(sortOption.sortFn);
      }
    }

    return filtered;
  }, [tools, searchQuery, selectedCategories, selectedPricingTypes, sortBy, aiQueryInfo]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTools.length / perPage);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Reset to first page when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Always show filters now */}
      <ToolFilters
        categories={categories}
        placeholder={placeholder || "Search for tools..."}
        onSearch={(query) => {
          setSearchQuery(query);
          handleFiltersChange();
        }}
        onCategoryChange={(categories) => {
          setSelectedCategories(categories);
          handleFiltersChange();
        }}
        selectedCategories={selectedCategories}
        selectedPricingTypes={selectedPricingTypes}
        onPricingTypesChange={(types) => {
          setSelectedPricingTypes(types);
          handleFiltersChange();
        }}
        tools={filteredTools}
        sortBy={sortBy}
        onSortChange={setSortBy}
        initialSearchValue={searchQuery}
      />
      
      {/* Only show AI badge if we're using AI results and it's not already shown in the parent */}
      {aiQueryInfo && aiQueryInfo.isAiPowered && aiQueryInfo.query && disableSearch && (
        <div className="flex items-center mt-1 mb-4">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <Bot className="w-3 h-3" />
            AI-powered results for "{aiQueryInfo.query}"
          </Badge>
        </div>
      )}

      {isLoading ? (
        <ToolListSkeleton />
      ) : (
        <ToolList
          tools={paginatedTools}
          ads={ad ? [ad] : []}
        />
      )}

      {totalPages > 1 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const ToolQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  );
};

export { ToolQuery, ToolQuerySkeleton };
