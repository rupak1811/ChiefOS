"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderKanban,
  Users,
  Bot, 
  MessageSquare,
  CheckSquare, 
  FileText, 
  HelpCircle,
  Power,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";
import { MOTION } from "@/lib/motion";
import { useRipple } from "@/components/motion/Ripple";
import LiquidPill from "@/components/motion/LiquidPill";
import Logo from "./Logo";

const navItems = [
  { href: "/app", label: "Home", icon: LayoutDashboard },
  { href: "/app/projects", label: "Projects", icon: FolderKanban },
  { href: "/app/teams", label: "Teams", icon: Users },
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/chat", label: "Chat", icon: MessageSquare },
  { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/app/ledger", label: "Ledger", icon: FileText },
  { href: "/app/help", label: "Help", icon: HelpCircle },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const spawnRipple = useRipple();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-4 sm:p-6 flex-shrink-0">
        <Link href="/app" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <Logo size="nav" showText={true} usePNG={true} />
        </Link>
      </div>

      <nav className="flex-1 px-3 sm:px-4 space-y-1 relative overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              onPointerDown={spawnRipple}
              className={`flex items-center space-x-3 px-3 sm:px-4 h-10 sm:h-11 rounded-xl relative overflow-hidden transition-all hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
              style={{
                transitionDuration: `${MOTION.duration.hover}ms`,
                transitionTimingFunction: MOTION.easing.fluidCubic,
              }}
            >
              {isActive && (
                <LiquidPill layoutId="sidebar-liquid" variant="sidebar" className="rounded-xl" />
              )}
              <Icon className="w-5 h-5 relative z-10 flex-shrink-0" />
              <span className="font-medium relative z-10 text-sm sm:text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0">
        <Link
          href="/app/kill-switch"
          onClick={() => setMobileMenuOpen(false)}
          onPointerDown={spawnRipple}
          className="flex items-center space-x-3 px-3 sm:px-4 h-10 sm:h-11 rounded-xl mb-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden transition-all"
          style={{
            transitionDuration: `${MOTION.duration.hover}ms`,
            transitionTimingFunction: MOTION.easing.fluidCubic,
          }}
        >
          <Power className="w-5 h-5 relative z-10 flex-shrink-0" />
          <span className="font-medium relative z-10 text-sm sm:text-base">Kill Switch</span>
        </Link>

        <div className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-foreground/50 truncate">{user.email}</p>
          </div>
        </div>

        <Link
          href="/api/auth/signout"
          onClick={() => setMobileMenuOpen(false)}
          onPointerDown={spawnRipple}
          className="flex items-center space-x-3 px-3 sm:px-4 py-2 rounded-xl text-foreground/70 hover:bg-white/5 hover:text-foreground hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden transition-all"
          style={{
            transitionDuration: `${MOTION.duration.hover}ms`,
            transitionTimingFunction: MOTION.easing.fluidCubic,
          }}
        >
          <LogOut className="w-4 h-4 relative z-10 flex-shrink-0" />
          <span className="text-sm relative z-10">Sign Out</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg water-glass water-glass--heavy hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 sm:w-72 lg:w-64 water-glass water-glass--heavy border-r border-white/10 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
