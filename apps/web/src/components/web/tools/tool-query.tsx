"use client";

import { PricingType, ToolTier } from "@plai/db/client";
import { useMemo, useState } from "react";
import { MoveLeftIcon, MoveRightIcon, SearchIcon, XIcon, XCircleIcon, ChevronDownIcon } from "lucide-react";
import { ToolFilters } from "~/components/web/tools/tool-filters";
import { ToolList } from "~/components/web/tools/tool-list";
import { ToolListSkeleton } from "~/components/web/tools/tool-list";
import { Input } from "~/components/web/ui/input";
import { Button } from "~/components/web/ui/button";
import { Stack } from "~/components/common/stack";
import type { CategoryMany } from "~/server/web/categories/payloads";
import type { ToolMany } from "~/server/web/tools/payloads";
import type { AdOne } from "~/server/web/ads/payloads";
import * as Select from "@radix-ui/react-select";

type ToolQueryProps = {
  tools: ToolMany[];
  categories: CategoryMany[];
  perPage: number;
  placeholder?: string;
  ad?: AdOne;
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

const ToolQuery = ({
  tools,
  perPage,
  categories,
  placeholder,
  ad,
}: ToolQueryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricingTypes, setSelectedPricingTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("latest");

  // Filter tools based on search query, categories, and pricing types
  const filteredTools = useMemo(() => {
    let filtered = [...tools];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          (tool.tagline?.toLowerCase() || "").includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((tool) =>
        tool.categories.some((category) =>
          selectedCategories.includes(category.slug)
        )
      );
    }

    // Apply pricing type filter
    if (selectedPricingTypes.length > 0) {
      filtered = filtered.filter((tool) => {
        const toolPricing = (tool as any).pricingType || "Free";
        return selectedPricingTypes.includes(toolPricing);
      });
    }

    // Apply sorting
    const sortOption = sortOptions.find((option) => option.value === sortBy);
    if (sortOption) {
      filtered.sort(sortOption.sortFn);
    }

    return filtered;
  }, [tools, searchQuery, selectedCategories, selectedPricingTypes, sortBy]);

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

  const currentSortOption = sortOptions.find(
    (option) => option.value === sortBy
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search and filters bar */}
      <div className="flex flex-col gap-3">
        {/* Search and sort controls */}
        <div className="flex flex-wrap gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[280px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-muted" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                handleFiltersChange();
              }}
              placeholder="Search tools..."
              className="h-10 pl-9 bg-background w-full"
            />
          </div>

          {/* Filters and Sort */}
          <div className="min-h-10 w-full xl:w-fit">
            <ToolFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={(categories) => {
                setSelectedCategories(categories);
                handleFiltersChange();
              }}
              selectedPricingTypes={selectedPricingTypes}
              onPricingTypesChange={(types) => {
                setSelectedPricingTypes(types);
                handleFiltersChange();
              }}
              tools={tools}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Active filters */}
        {(selectedCategories.length > 0 || selectedPricingTypes.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Active filters:</span>
            {selectedCategories.map(slug => {
              const category = categories.find(c => c.slug === slug)
              return (
                <div
                  key={slug}
                  className="group flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-sm transition-colors"
                >
                  <span>{category?.name}</span>
                  <button
                    onClick={() => {
                      const newCategories = selectedCategories.filter(c => c !== slug)
                      setSelectedCategories(newCategories)
                      handleFiltersChange()
                    }}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <XIcon className="size-3" />
                  </button>
                </div>
              )
            })}
            {selectedPricingTypes.map(type => (
              <div
                key={type}
                className="group flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-sm transition-colors"
              >
                <span>{type}</span>
                <button
                  onClick={() => {
                    const newTypes = selectedPricingTypes.filter(t => t !== type)
                    setSelectedPricingTypes(newTypes)
                    handleFiltersChange()
                  }}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
            {(selectedCategories.length > 0 || selectedPricingTypes.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedPricingTypes([])
                  handleFiltersChange()
                }}
                className="flex items-center gap-1.5 text-primary hover:text-primary hover:bg-primary/10 px-2 py-1 rounded-md text-sm"
              >
                <XCircleIcon className="size-4" />
                <span>Clear all</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tool List */}
      <ToolList tools={paginatedTools} ad={ad} />

      {/* Pagination */}
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
