import { type HTMLAttributes } from "react"
import { CheckIcon, SparklesIcon, CrownIcon } from "lucide-react"
import { Card } from "~/components/web/ui/card"
import { Button } from "~/components/web/ui/button"
import { cx } from "~/utils/cva"
import Link from "next/link"
import { motion } from "framer-motion"

type PricingCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string
  description: string
  features: string[]
  highlighted?: boolean
  recommended?: boolean
  ctaLabel?: string
  ctaHref?: string
}

export function PricingCard({
  title,
  description,
  features,
  highlighted = false,
  recommended = false,
  ctaLabel = "Get Started",
  ctaHref = "/submit",
  className,
  ...props
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="pt-4"
    >
      <Card 
        className={cx(
          "relative h-full w-full",
          recommended ? "bg-gradient-to-b from-primary/5 via-background to-background border-primary" : "bg-background border-border/50",
          className
        )} 
        {...props}
      >

        {highlighted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <SparklesIcon className="h-3 w-3" />
            </motion.div>
            Popular
          </motion.div>
        )}
        
        {recommended && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CrownIcon className="h-3 w-3" />
            </motion.div>
            Recommended
          </motion.div>
        )}

        <div className="relative flex flex-col h-full p-6">
          {/* Header */}
          <div className="space-y-2 pb-6">
            <h3 className={cx(
              "text-xl font-semibold tracking-tight",
              recommended && "text-primary"
            )}>{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed h-12">{description}</p>
          </div>

          {/* Features */}
          <ul className="flex-1 space-y-3 py-6 border-y border-border/50">
            {features.map((feature, index) => (
              <motion.li 
                key={feature} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="flex items-start gap-2.5"
              >
                <div className={cx(
                  "rounded-full p-1.5 transition-colors duration-300",
                  recommended ? "bg-primary/10 text-primary" : "bg-secondary/30 text-secondary-foreground"
                )}>
                  <CheckIcon className="h-3 w-3 stroke-[2.5]" />
                </div>
                <span className={cx(
                  "text-sm leading-tight",
                  recommended ? "text-foreground" : "text-muted-foreground"
                )}>{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <div className="pt-6">
            <Button 
              variant={recommended ? "primary" : "secondary"} 
              size="lg"
              className={cx(
                "w-full font-medium relative overflow-hidden",
                recommended && "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg",
                "group"
              )}
              asChild
            >
              <Link href={ctaHref}>
                <span className="relative z-10">{ctaLabel}</span>
                {recommended && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                )}
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 