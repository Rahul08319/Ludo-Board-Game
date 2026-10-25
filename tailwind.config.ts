import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "system-ui", "Inter", "sans-serif"],
        body: ["SF Pro Text", "-apple-system", "BlinkMacSystemFont", "system-ui", "Inter", "sans-serif"],
        mono: ["SF Mono", "Menlo", "Monaco", "Courier New", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Apple Design System Tokens
        apple: {
          blue: "#0066cc",
          "blue-focus": "#0071e3",
          "blue-dark": "#2997ff",
          ink: "#1d1d1f",
          parchment: "#f5f5f7",
          pearl: "#fafafc",
          tile1: "#272729",
          tile2: "#2a2a2c",
          tile3: "#252527",
          black: "#000000",
          hairline: "rgba(0, 0, 0, 0.08)",
          "hairline-dark": "rgba(255, 255, 255, 0.12)",
          chip: "rgba(210, 210, 215, 0.64)",
          // Apple Human Interface System Tints
          red: "#FF3B30",
          green: "#34C759",
          yellow: "#FF9500",
          orange: "#FF9500",
          purple: "#AF52DE",
          teal: "#5AC8FA",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        ludo: {
          red: "hsl(var(--ludo-red))",
          blue: "hsl(var(--ludo-blue))",
          green: "hsl(var(--ludo-green))",
          yellow: "hsl(var(--ludo-yellow))",
        },
        board: {
          bg: "hsl(var(--board-bg))",
          border: "hsl(var(--board-border))",
          cell: "hsl(var(--board-cell))",
          wood: "hsl(var(--board-wood))",
        },
        dice: {
          bg: "hsl(var(--dice-bg))",
          dot: "hsl(var(--dice-dot))",
        },
      },
      borderRadius: {
        apple: "18px",
        pill: "9999px",
        squircle: "28px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "apple-product": "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px",
        "apple-subtle": "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
        "apple-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "apple-spring": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "50%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "apple-hop": {
          "0%, 100%": { transform: "translateY(0) scale(1, 1)" },
          "30%": { transform: "translateY(-14px) scale(0.92, 1.08)" },
          "60%": { transform: "translateY(-6px) scale(1.02, 0.98)" },
          "85%": { transform: "translateY(0) scale(1.12, 0.88)" },
        },
        "apple-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.85" },
        },
        "apple-dice-3d": {
          "0%": { transform: "perspective(600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.95)" },
          "20%": { transform: "perspective(600px) rotateX(180deg) rotateY(90deg) rotateZ(45deg) translateY(-18px) scale(1.08)" },
          "40%": { transform: "perspective(600px) rotateX(360deg) rotateY(270deg) rotateZ(135deg) translateY(-24px) scale(1.12)" },
          "60%": { transform: "perspective(600px) rotateX(540deg) rotateY(450deg) rotateZ(225deg) translateY(-12px) scale(1.05)" },
          "80%": { transform: "perspective(600px) rotateX(680deg) rotateY(600deg) rotateZ(315deg) translateY(-4px) scale(0.98)" },
          "100%": { transform: "perspective(600px) rotateX(720deg) rotateY(720deg) rotateZ(360deg) translateY(0) scale(1)" },
        },
        "apple-glow": {
          "0%, 100%": { opacity: "0.4", filter: "drop-shadow(0 0 12px currentColor)" },
          "50%": { opacity: "0.85", filter: "drop-shadow(0 0 24px currentColor)" },
        },
        "apple-shimmer": {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(150%)" },
        },
        "apple-shockwave": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "apple-spring": "apple-spring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "apple-hop": "apple-hop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) infinite",
        "apple-pulse": "apple-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "apple-dice-3d": "apple-dice-3d 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        "apple-glow": "apple-glow 2.4s ease-in-out infinite",
        "apple-shimmer": "apple-shimmer 2.2s infinite",
        "apple-shockwave": "apple-shockwave 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
