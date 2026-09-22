"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-3xl" },
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ChiefOS Icon - Geometric C with gradient */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="chief-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="chief-gradient-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle with subtle glow */}
        <circle cx="50" cy="50" r="46" fill="url(#chief-gradient-glow)" opacity="0.15" />
        
        {/* Main C shape - geometric, professional */}
        <path
          d="M 70 20 A 30 30 0 1 1 70 80 L 70 68 A 18 18 0 1 0 70 32 Z"
          fill="url(#chief-gradient-primary)"
          filter="url(#glow)"
        />
        
        {/* Inner accent dot */}
        <circle cx="74" cy="50" r="4" fill="#22D3EE" opacity="0.8" />
        
        {/* Outer highlight arc */}
        <path
          d="M 70 18 A 32 32 0 0 1 85 28"
          stroke="#2DD4BF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* ChiefOS Wordmark */}
      {showText && (
        <span className={`font-display font-bold tracking-tight text-logo ${text}`}>
          Chief<span className="text-accent">OS</span>
        </span>
      )}
    </div>
  );
}
