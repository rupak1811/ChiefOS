"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
                style={{ transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)" }}
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
                  <motion.div
                    layoutId="nav-liquid"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(45, 212, 191, 0.12)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 24px rgba(45, 212, 191, 0.15)",
                      backdropFilter: "blur(12px) saturate(160%)",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                    initial={false}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 380,
                            damping: 36,
                            mass: 0.6,
                          }
                    }
                  />
                )}
              </Link>
            ))}
            <button
              onClick={() => signIn("google", { callbackUrl: "/app" })}
              className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] font-semibold"
              style={{ transition: "all 520ms cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
              Get Started
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
          }
          className="md:hidden water-glass water-glass--heavy border-t border-white/10"
        >
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
              className="w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] font-semibold"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
