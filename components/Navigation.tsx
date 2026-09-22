"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MOTION, colorStyle } from "@/lib/motion";
import { useRipple } from "@/components/motion/Ripple";
import LiquidPill from "@/components/motion/LiquidPill";
import Logo from "./Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const spawnRipple = useRipple();

  const liquidTarget = hoveredLink || pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 water-glass water-glass--heavy border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo size="nav" showText={true} usePNG={true} />
          </Link>

          <div className="hidden md:flex items-center space-x-1 relative">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full relative text-nav"
                style={colorStyle}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className={`relative z-10 ${
                  pathname === link.href || hoveredLink === link.href
                    ? "text-foreground"
                    : "text-ink-muted"
                }`}>
                  {link.label}
                </span>
                {liquidTarget === link.href && (
                  <LiquidPill layoutId="nav-liquid" variant="nav" />
                )}
              </Link>
            ))}
            <button
              onClick={() => signIn("google", { callbackUrl: "/app" })}
              onPointerDown={spawnRipple}
              className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] font-semibold relative overflow-hidden transition-all"
              style={{
                transitionDuration: `${MOTION.duration.hover}ms`,
                transitionTimingFunction: MOTION.easing.fluidCubic,
              }}
            >
              <span className="relative z-10">Get Started</span>
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden water-glass water-glass--heavy border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg ${
                  pathname === link.href
                    ? "bg-white/10 text-accent"
                    : "text-foreground/70"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signIn("google", { callbackUrl: "/app" });
              }}
              onPointerDown={spawnRipple}
              className="w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] font-semibold relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                transitionDuration: `${MOTION.duration.press}ms`,
              }}
            >
              <span className="relative z-10">Get Started</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
