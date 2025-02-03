"use client"

import { SearchIcon, XCircleIcon, ChevronDownIcon } from "lucide-react"
import { type ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Input } from "~/components/web/ui/input"
import * as Select from "@radix-ui/react-select"
import type { CategoryMany } from "~/server/web/categories/payloads"
import type { ToolMany } from "~/server/web/tools/payloads"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { XIcon } from "lucide-react"
import { Checkbox } from "~/components/common/checkbox"

export type ToolFiltersProps = {
  categories?: CategoryMany[]
  placeholder?: string
  onSearch?: (search: string) => void
  onCategoryChange?: (categories: string[]) => void
  selectedCategories?: string[]
  selectedPricingTypes: string[]
  onPricingTypesChange: (types: string[]) => void
  tools: ToolMany[]
}

const pricingOptions = [
  { label: "Free", value: "Free" },
  { label: "Freemium", value: "Freemium" },
  { label: "Paid", value: "Paid" },
]

const ToolFilters = ({ 
  categories = [], 
  placeholder = "Search tools...",
  onSearch,
  onCategoryChange,
  selectedCategories = [],
  selectedPricingTypes,
  onPricingTypesChange,
  tools = []
}: ToolFiltersProps) => {
  
  // Calculate pricing type counts
  const pricingTypeCounts = pricingOptions.reduce((acc, option) => {
    const count = tools.filter(tool => (tool as any).pricingType === option.value).length
    acc[option.value] = count
    return acc
  }, {} as Record<string, number>)

  // Calculate category counts
  const categoryCounts = categories.reduce((acc, category) => {
    const count = tools.filter(tool => 
      tool.categories.some(c => c.slug === category.slug)
    ).length
    acc[category.slug] = count
    return acc
  }, {} as Record<string, number>)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value)
  }

  const handleCategorySelect = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    onCategoryChange?.(newCategories)
  }

  const handleClearCategories = () => {
    onCategoryChange?.([])
  }

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      onCategoryChange?.([])
    } else {
      onCategoryChange?.(categories.map(c => c.slug))
    }
  }

  const handleTogglePricingType = (type: string) => {
    if (selectedPricingTypes.includes(type)) {
      onPricingTypesChange(selectedPricingTypes.filter(t => t !== type))
    } else {
      onPricingTypesChange([...selectedPricingTypes, type])
    }
  }

  const handleClearPricingTypes = () => {
    onPricingTypesChange([])
  }

  const handleSelectAllPricing = () => {
    if (selectedPricingTypes.length === pricingOptions.length) {
      onPricingTypesChange([])
    } else {
      onPricingTypesChange(pricingOptions.map(p => p.value))
    }
  }

  return (
    <div className="flex flex-col">
      {/* Filters row */}
      <div className="flex items-center gap-2">
        {/* Categories dropdown */}
        <Select.Root>
          <Select.Trigger className="h-10 px-3 text-sm border rounded-md bg-background flex items-center justify-between gap-2 min-w-[180px]">
            <Select.Value placeholder={
              selectedCategories.length === 0 
                ? "All categories" 
                : `${selectedCategories.length} selected`
            } />
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content 
              className="z-50 min-w-[200px] overflow-hidden rounded-md border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              position="popper"
              side="bottom"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1 p-2 bg-background">
                <div
                  role="menuitem"
                  onClick={handleSelectAllCategories}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-pointer"
                >
                  <Checkbox 
                    checked={selectedCategories.length === categories.length}
                    className="size-4"
                    onCheckedChange={() => handleSelectAllCategories()}
                  />
                  <span>All categories</span>
                </div>

                <div className="my-1 border-t" />

                {categories.map(category => (
                  <div
                    key={category.slug}
                    role="menuitem"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-pointer"
                    onClick={() => handleCategorySelect(category.slug)}
                  >
                    <Checkbox 
                      checked={selectedCategories.includes(category.slug)}
                      className="size-4"
                      onCheckedChange={() => handleCategorySelect(category.slug)}
                    />
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs text-muted">
                      {categoryCounts[category.slug] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Pricing type dropdown */}
        <Select.Root>
          <Select.Trigger className="h-10 px-3 text-sm border rounded-md bg-background flex items-center justify-between gap-2 min-w-[180px]">
            <Select.Value placeholder={
              selectedPricingTypes.length === 0 
                ? "All pricing" 
                : `${selectedPricingTypes.length} selected`
            } />
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content 
              className="z-50 min-w-[200px] overflow-hidden rounded-md border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              position="popper"
              side="bottom"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1 p-2 bg-background">
                <div
                  role="menuitem"
                  onClick={handleSelectAllPricing}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-pointer"
                >
                  <Checkbox 
                    checked={selectedPricingTypes.length === pricingOptions.length}
                    className="size-4"
                    onCheckedChange={() => handleSelectAllPricing()}
                  />
                  <span>All pricing</span>
                </div>

                <div className="my-1 border-t" />

                {pricingOptions.map(option => (
                  <div
                    key={option.value}
                    role="menuitem"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-pointer"
                    onClick={() => handleTogglePricingType(option.value)}
                  >
                    <Checkbox 
                      checked={selectedPricingTypes.includes(option.value)}
                      className="size-4"
                      onCheckedChange={() => handleTogglePricingType(option.value)}
                    />
                    <span>{option.label}</span>
                    <span className="ml-auto text-xs text-muted">
                      {pricingTypeCounts[option.value] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  )
}

export { ToolFilters }
