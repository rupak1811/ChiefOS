import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        elevated: "var(--bg-elevated)",
        sunken: "var(--bg-sunken)",
        panel: "var(--bg-panel)",
        glass: {
          DEFAULT: "var(--glass-fill)",
          strong: "var(--glass-fill-strong)",
          border: "var(--glass-border)",
        },
        ink: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-secondary)",
          faint: "var(--text-tertiary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          hover: "var(--accent-hover)",
          pressed: "var(--accent-pressed)",
          teal: "var(--accent)",
          blue: "#60A5FA",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        float: "var(--shadow-float)",
        accent: "var(--shadow-accent)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backdropBlur: {
        glass: "24px",
        heavy: "40px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "slide-in": "slideIn 0.6s ease-out",
        "fade-in": "fadeIn 0.8s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        'ease-out': 'var(--ease-out)',
        'ease-in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        'fast': 'var(--dur-fast)',
        'med': 'var(--dur-med)',
        'slow': 'var(--dur-slow)',
      },
    },
  },
  plugins: [],
};
export default config;
