"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  FileText, 
  MessageSquare,
  HelpCircle,
  Power,
  LogOut 
} from "lucide-react";
import Image from "next/image";
import { MOTION, fluidTransition } from "@/lib/motion";
import { useRipple } from "@/lib/useRipple";
import Logo from "./Logo";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/app/ledger", label: "Ledger", icon: FileText },
  { href: "/app/chat", label: "Chat", icon: MessageSquare },
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
  const prefersReducedMotion = useReducedMotion();
  const spawnRipple = useRipple();

  return (
    <aside className="w-64 water-glass water-glass--heavy border-r border-white/10 flex flex-col">
      <div className="p-6">
        <Link href="/app" className="flex items-center">
          <Logo size="nav" showText={true} usePNG={true} />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onPointerDown={spawnRipple}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl relative overflow-hidden ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
              style={fluidTransition}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent to-accent-hover"
                  initial={false}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : MOTION.spring.interactive
                  }
                  style={{ zIndex: 0 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/app/kill-switch"
          onPointerDown={spawnRipple}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 relative overflow-hidden"
          style={fluidTransition}
        >
          <Power className="w-5 h-5 relative z-10" />
          <span className="font-medium relative z-10">Kill Switch</span>
        </Link>

        <div className="flex items-center space-x-3 px-4 py-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
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
          onPointerDown={spawnRipple}
          className="flex items-center space-x-3 px-4 py-2 rounded-xl text-foreground/70 hover:bg-white/5 hover:text-foreground relative overflow-hidden"
          style={fluidTransition}
        >
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="text-sm relative z-10">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
