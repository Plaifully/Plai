"use client";

import { PricingType } from "@plai/db/client";
import { useMemo, useState } from "react";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { ToolFilters } from "~/components/web/tools/tool-filters";
import { ToolList } from "~/components/web/tools/tool-list";
import { ToolListSkeleton } from "~/components/web/tools/tool-list";
import { Input } from "~/components/web/ui/input";
import { Button } from "~/components/web/ui/button";
import { Stack } from "~/components/common/stack";
import type { CategoryMany } from "~/server/web/categories/payloads";
import type { ToolMany } from "~/server/web/tools/payloads";
import type { AdOne } from "~/server/web/ads/payloads";

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
      filtered = filtered.filter((tool) =>
        selectedPricingTypes.includes(tool.pricingType)
      );
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

  return (
    <div className="space-y-6">
      <ToolFilters
        categories={categories}
        placeholder={placeholder}
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
      />

      <ToolList
        tools={paginatedTools}
        ads={ad ? [ad] : []}
      />

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
