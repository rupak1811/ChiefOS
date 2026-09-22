"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useRipple } from "@/lib/useRipple";
import { fluidTransition } from "@/lib/motion";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonProps) {
  const spawnRipple = useRipple();
  
  const baseStyles = "inline-flex items-center justify-center text-button rounded-xl relative overflow-hidden";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "water-glass text-foreground hover:border-white/30 active:scale-[0.985]",
    ghost: "text-foreground hover:bg-white/10 active:bg-white/15",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!disabled) {
      spawnRipple(e as any);
    }
  };

  const content = <span className="relative z-10">{children}</span>;

  if (href && !disabled) {
    return (
      <Link 
        href={href} 
        className={styles} 
        style={fluidTransition}
        onPointerDown={handlePointerDown as any}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={styles} 
      disabled={disabled}
      style={fluidTransition}
      onPointerDown={handlePointerDown as any}
    >
      {content}
    </button>
  );
}
