"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { MOTION } from "@/lib/motion";
import { useRipple } from "@/lib/useRipple";

const images = [
  {
    url: "/heroes/hero-01-multi-agent-os.png",
    alt: "Multi-agent OS that stays under your control",
  },
  {
    url: "/heroes/hero-02-permissions.png",
    alt: "Permissions before every consequential action",
  },
  {
    url: "/heroes/hero-03-approval-trust.png",
    alt: "Approval and trust built into the loop",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const spawnRipple = useRipple();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.9,
                  ease: MOTION.easing.fluid,
                }
          }
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 p-2 rounded-full water-glass">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            onPointerDown={spawnRipple}
            className="relative overflow-hidden rounded-full"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-accent w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              style={{
                transition: "all 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
