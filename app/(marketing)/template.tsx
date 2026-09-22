"use client";

import PageFade from "@/components/motion/PageFade";

export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageFade>{children}</PageFade>;
}
