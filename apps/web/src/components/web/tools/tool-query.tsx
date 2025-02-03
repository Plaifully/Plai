'use client'

import { PricingType, ToolTier } from "@plai/db/client"
import { useMemo, useState } from "react"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolList } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Input } from "~/components/web/ui/input"
import { Button } from "~/components/web/ui/button"
import { Stack } from "~/components/common/stack"
import type { CategoryMany } from "~/server/web/categories/payloads"
import type { ToolMany } from "~/server/web/tools/payloads"
import type { AdOne } from "~/server/web/ads/payloads"

type ToolQueryProps = {
  tools: ToolMany[]
  categories?: CategoryMany[]
  perPage: number
  placeholder?: string
  ad?: AdOne
}

type Filters = {
  search: string
  selectedCategories: string[]
  pricingType: PricingType | 'all'
  tier: ToolTier | 'all'
}

const ClientPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
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
  )
}

const ToolQuery = ({ tools, perPage, categories, placeholder, ad }: ToolQueryProps) => {
  // Store original tools data
  const [originalTools] = useState(tools)
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    selectedCategories: [],
    pricingType: 'all',
    tier: 'all'
  })

  // Current page state
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate tools per category for the filter dropdown
  const toolsPerCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    originalTools.forEach(tool => {
      tool.categories.forEach(cat => {
        counts[cat.slug] = (counts[cat.slug] || 0) + 1
      })
    })
    return counts
  }, [originalTools])

  // Apply filters
  const filteredTools = useMemo(() => {
    return originalTools.filter(tool => {
      // Search filter
      if (filters.search && !tool.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Categories filter
      if (filters.selectedCategories.length > 0) {
        const toolCategorySlugs = tool.categories.map(cat => cat.slug)
        const hasMatchingCategory = filters.selectedCategories.some(selectedSlug => 
          toolCategorySlugs.includes(selectedSlug)
        )
        if (!hasMatchingCategory) {
          return false
        }
      }

      return true
    })
  }, [originalTools, filters])

  // Calculate pagination
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * perPage
    const end = start + perPage
    return filteredTools.slice(start, end)
  }, [filteredTools, currentPage, perPage])

  const totalPages = Math.ceil(filteredTools.length / perPage)

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
    setCurrentPage(1)
  }

  const handleCategoryChange = (categories: string[]) => {
    setFilters(prev => ({ ...prev, selectedCategories: categories }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Enhance categories with actual tool counts
  const categoriesWithCounts = useMemo(() => {
    return categories?.map(category => ({
      ...category,
      _count: {
        ...category._count,
        tools: toolsPerCategory[category.slug] || 0
      }
    }))
  }, [categories, toolsPerCategory])

  return (
    <>
      <div className="flex flex-col gap-5">
        <ToolFilters 
          categories={categoriesWithCounts} 
          placeholder={placeholder}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          selectedCategories={filters.selectedCategories}
        />
        <ToolList tools={paginatedTools} ad={ad} />
      </div>

      <ClientPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const ToolQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolQuery, ToolQuerySkeleton }
