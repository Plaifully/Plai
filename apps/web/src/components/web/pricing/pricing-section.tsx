'use client'

import { PricingCard } from "./pricing-card"
import { motion } from "framer-motion"

const pricingTiers = [
  {
    title: "Free",
    description: "Basic listing with manual review process",
    features: [
      "Manual review process",
      "Listed within 1-2 weeks",
      "Basic tool profile",
      "Community support",
      "Standard search placement",
    ],
    ctaLabel: "Submit for Free",
    comingSoon: false
  },
  {
    title: "Featured",
    description: "Enhanced visibility with 24-hour guarantee",
    features: [
      "24-hour listing guarantee",
      "Featured in sidebar",
      "Enhanced tool profile",
      "Priority support",
      "Analytics dashboard",
      "Higher search ranking",
    ],
    highlighted: true,
    ctaLabel: "Coming Soon",
    comingSoon: true
  },
  {
    title: "Premium",
    description: "Maximum exposure with fastest listing time",
    features: [
      "12-hour listing guarantee",
      "30 days featured placement",
      "Premium tool profile",
      "Dedicated support",
      "Custom branding options",
      "Advanced analytics",
      "Top search placement",
    ],
    recommended: true,
    ctaLabel: "Coming Soon",
    comingSoon: true
  }
]

export function PricingSection() {
  return (
    <section className="w-full">
      <div className="relative">
        {/* Background gradient effects */}
        <motion.div 
          className="absolute inset-0 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="absolute right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Cards */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 max-w-7xl mx-auto mt-4">
          {pricingTiers.map((tier, index) => (
            <motion.div 
              key={tier.title} 
              className="flex w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut"
              }}
            >
              <PricingCard {...tier} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 