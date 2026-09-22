"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Logo from "./Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How it works" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 water-glass water-glass--heavy border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo size="nav" showText={true} usePNG={true} />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg relative text-nav"
                style={{ transition: "color 520ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className={`relative z-10 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-ink-muted hover:text-foreground"
                }`}>
                  {link.label}
                </span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-white/10 rounded-lg water-glass"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                      mass: 0.8,
                    }}
                  />
                )}
                {hoveredLink === link.href && pathname !== link.href && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-white/5 rounded-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                      mass: 0.8,
                    }}
                    style={{
                      background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                    }}
                  />
                )}
              </Link>
            ))}
            <button
              onClick={() => signIn("google", { callbackUrl: "/app" })}
              className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] font-medium"
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
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
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
              className="w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] font-medium"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
