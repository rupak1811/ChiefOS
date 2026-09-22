"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 0.42,
              ease: MOTION.easing.fluid,
            }
      }
    >
      {children}
    </motion.div>
  );
}
