"use client";

import { useCallback } from "react";

/**
 * Water ripple effect hook for interactive surfaces.
 * Creates a soft teal-white radial ripple on pointer down.
 * Respects prefers-reduced-motion automatically via CSS.
 */
export function useRipple() {
  const spawnRipple = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    // Create ripple element
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    
    // Append and auto-remove on animation end
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, []);

  return spawnRipple;
}
