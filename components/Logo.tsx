"use client";

interface LogoProps {
  size?: "nav" | "footer" | "hero";
  showText?: boolean;
  variant?: "primary" | "mono-light" | "mono-dark" | "teal-flat";
  className?: string;
}

export default function Logo({ 
  size = "nav", 
  showText = true, 
  variant = "primary",
  className = "" 
}: LogoProps) {
  // Size mappings
  const sizeMap = {
    nav: { mark: 36, wordmark: "text-logo-sm" },
    footer: { mark: 28, wordmark: "text-logo-sm" },
    hero: { mark: 72, wordmark: "text-logo-lg" },
  };

  const { mark, wordmark } = sizeMap[size];

  // Color variants
  const colors = {
    primary: {
      mark: "url(#brandGrad)",
      wordmark: "#F4F7FB",
    },
    "mono-light": {
      mark: "rgba(255,255,255,0.9)",
      wordmark: "#FFFFFF",
    },
    "mono-dark": {
      mark: "#070B14",
      wordmark: "#070B14",
    },
    "teal-flat": {
      mark: "#2DD4BF",
      wordmark: "#F4F7FB",
    },
  };

  const color = colors[variant];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ChiefOS Mark - Open-C water droplet/aperture */}
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Brand gradient: teal → cyan → soft violet */}
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="55%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          
          {/* Subtle inner glow */}
          <radialGradient id="innerGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Inner soft fill (optional for larger sizes) */}
        {mark >= 32 && (
          <circle 
            cx="16" 
            cy="16" 
            r="11" 
            fill="url(#innerGlow)" 
          />
        )}

        {/* Open-C ring - continuous curve with gap at ~40° */}
        <path
          d="M 16 3 
             A 13 13 0 1 1 25.5 8.5"
          stroke={variant === "primary" ? "url(#brandGrad)" : color.mark}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Specular bead highlight at 1-2 o'clock (water droplet feel) */}
        <ellipse
          cx="22"
          cy="9"
          rx="2.5"
          ry="3"
          fill="white"
          opacity="0.75"
          transform="rotate(-25 22 9)"
        />
        
        {/* Subtle inner bead */}
        <ellipse
          cx="21"
          cy="10"
          rx="1.2"
          ry="1.5"
          fill="white"
          opacity="0.4"
          transform="rotate(-25 21 10)"
        />
      </svg>

      {/* ChiefOS Wordmark */}
      {showText && (
        <span 
          className={`font-display ${wordmark}`}
          style={{ color: color.wordmark }}
        >
          Chief<span className="text-accent">OS</span>
        </span>
      )}
    </div>
  );
}
