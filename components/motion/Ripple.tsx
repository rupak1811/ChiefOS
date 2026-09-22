"use client";

import { useCallback } from "react";

/**
 * Water ripple effect hook for interactive surfaces.
 * Creates a soft teal-white radial ripple on pointer down.
 * Respects prefers-reduced-motion automatically via CSS.
 * 
 * Per GLOBAL_WATER_MOTION.md spec:
 * - 700ms duration
 * - Radial gradient from white core to teal mid to transparent
 * - mix-blend-mode: screen
 * - Removed on animationend
 */
export function useRipple() {
  const spawnRipple = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    const ripple = document.createElement("span");
    ripple.className = "water-ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, []);

  return spawnRipple;
}

/**
 * Wrapper component that provides ripple functionality
 * Use this for non-standard elements that need ripple effects
 */
interface RippleHostProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function RippleHost({ 
  children, 
  className = "", 
  onClick,
  disabled = false 
}: RippleHostProps) {
  const spawnRipple = useRipple();

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={disabled ? undefined : onClick}
      onPointerDown={disabled ? undefined : spawnRipple}
      style={{
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </div>
  );
}
