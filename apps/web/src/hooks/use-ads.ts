"use client"

import type { AdType } from "@prisma/client"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { config } from "~/config"
import { calculateAdsPrice } from "~/utils/ads"

export type AdsPicker = {
  label: string
  type: AdType
  description: string
  price: number
}

export type AdsSelection = {
  type: AdType
  dateRange?: DateRange
  duration?: number
}

export const useAdsPicker = () => {
  const [selections, setSelections] = useState<AdsSelection[]>([])
  const spots = config.ads.adSpots

  const addSelection = (type: AdType) => {
    setSelections(prev => [...prev, { type }])
  }

  const removeSelection = (type: AdType) => {
    setSelections(prev => prev.filter(s => s.type !== type))
  }

  const updateSelection = (type: AdType, data: Partial<AdsSelection>) => {
    setSelections(prev =>
      prev.map(s => (s.type === type ? { ...s, ...data } : s)),
    )
  }

  const getPrice = () => {
    const selectedItems = selections
      .filter(s => s.duration && s.duration > 0)
      .map(selection => ({
        price: spots.find(s => s.type === selection.type)?.price || 0,
        duration: selection.duration || 1,
      }))

    if (selectedItems.length === 0) return 0

    const basePrice = Math.min(...spots.map(s => s.price))
    return calculateAdsPrice(selectedItems, basePrice)
  }

  return {
    selections,
    addSelection,
    removeSelection,
    updateSelection,
    getPrice,
  }
}
