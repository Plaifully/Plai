import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base colors
        primary: "var(--color-primary)",
        background: "var(--color-background)",
        muted: "var(--color-muted)",
        secondary: "var(--color-secondary)",
        foreground: "var(--color-foreground)",
        
        // Card colors
        card: "var(--color-card)",
        "card-dark": "var(--color-card-dark)",
        
        // Border colors
        border: "var(--color-border)",
        "border-dark": "var(--color-border-dark)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      gridTemplateColumns: {
        "2xs": "var(--grid-template-columns-2xs)",
        "xs": "var(--grid-template-columns-xs)",
        "sm": "var(--grid-template-columns-sm)",
        "md": "var(--grid-template-columns-md)",
        "lg": "var(--grid-template-columns-lg)",
        "xl": "var(--grid-template-columns-xl)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
} satisfies Config 