import type { Config } from "tailwindcss";

const preset: Pick<Config, "theme" | "plugins" | "content"> = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f1ee",
          100: "#e8e2dd",
          200: "#d1c5bb",
          300: "#baa899",
          400: "#a38b77",
          500: "#8c6e55",
          600: "#7a2d2d",
          700: "#5a1d1d",
          800: "#3a1313",
          900: "#1a0909",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        prata: ["var(--font-prata)", "serif"],
      },
      fontSize: {
        "2xs": "0.625rem", // 10px
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
      },
      lineHeight: {
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      textDecoration: {
        underline: "underline",
        "line-through": "line-through",
        "no-underline": "none",
      },
      textTransform: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
        "normal-case": "none",
      },
      fontStyle: {
        italic: "italic",
        "not-italic": "normal",
      },
      textAlign: {
        left: "left",
        center: "center",
        right: "right",
        justify: "justify",
        start: "start",
        end: "end",
      },
      verticalAlign: {
        baseline: "baseline",
        top: "top",
        middle: "middle",
        bottom: "bottom",
        "text-top": "text-top",
        "text-bottom": "text-bottom",
        sub: "sub",
        super: "super",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        scaleIn: "scaleIn 0.3s ease-out",
      },
      transitionDuration: {
        "250": "250ms",
        "300": "300ms",
      },
      transitionTimingFunction: {
        "cubic-bezier": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      zIndex: {
        modal: "3000",
        "modal-header": "3100",
        "modal-footer": "3200",
        "modal-content": "3300",
        notification: "4000",
        toast: "4100",
        tooltip: "300",
        "tooltip-global": "5000",
        "loading-overlay": "6000",
        debug: "9999",
      },
    },
  },
  plugins: [],
};

export default preset;
