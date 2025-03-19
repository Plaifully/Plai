import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(inputs.filter(Boolean).join(" "))
} 