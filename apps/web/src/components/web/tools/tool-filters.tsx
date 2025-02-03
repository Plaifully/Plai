"use client"

import { SearchIcon, XCircleIcon } from "lucide-react"
import { type ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Input } from "~/components/web/ui/input"
import * as Select from "@radix-ui/react-select"
import type { CategoryMany } from "~/server/web/categories/payloads"
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
}

const ToolFilters = ({ 
  categories = [], 
  placeholder = "Search tools...",
  onSearch,
  onCategoryChange,
  selectedCategories = []
}: ToolFiltersProps) => {
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
    onCategoryChange?.(categories.map(c => c.slug))
  }

  return (
    <div className="space-y-3">
      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-4" />
          <Input
            size="lg"
            placeholder={placeholder}
            className="pl-10"
            onChange={handleSearchChange}
          />
        </div>
        <Select.Root>
          <Select.Trigger className="inline-flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px]">
            <Select.Value placeholder={
              selectedCategories.length === 0 
                ? "All categories" 
                : `${selectedCategories.length} selected`
            } />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content 
              className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              position="popper"
              side="bottom"
              sideOffset={4}
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
                      {category._count.tools}
                    </span>
                  </div>
                ))}
              </div>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Active filters row - always visible but empty when no filters */}
      <div className="flex items-center gap-2 min-h-[32px]">
        {selectedCategories.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted">
              Active filters:
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCategories.map(slug => {
                  const category = categories.find(c => c.slug === slug)
                  return (
                    <div
                      key={slug}
                      className="group flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-sm transition-colors"
                    >
                      <span>{category?.name}</span>
                      <button
                        onClick={() => handleCategorySelect(slug)}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCategories}
                  className="flex items-center gap-1.5 text-primary hover:text-primary hover:bg-primary/10 -ml-2"
                >
                  <XCircleIcon className="size-4" />
                  <span>Clear all</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { ToolFilters }
