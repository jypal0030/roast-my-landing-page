"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, User, LogOut, LayoutDashboard, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ash-700 bg-ash-900/95 backdrop-blur supports-[backdrop-filter]:bg-ash-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Flame className="h-7 w-7 text-fire-500 group-hover:animate-pulse" />
          <span className="font-display text-2xl text-white tracking-tight">
            RoastMy<span className="text-fire-500">LP</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="text-ash-300 hover:text-white active:scale-95 transition-all duration-150 text-sm font-medium"
          >
            Pricing
          </Link>
          <Link
            href="/#gallery"
            className="text-ash-300 hover:text-white active:scale-95 transition-all duration-150 text-sm font-medium"
          >
            Wall of Shame
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/referral"
                className="flex items-center gap-1 text-ash-300 hover:text-ember-400 active:scale-95 transition-all duration-150 text-sm font-medium"
              >
                <Gift className="h-4 w-4" />
                Referrals
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-ash-300 hover:text-white active:scale-95 transition-all duration-150 text-sm font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 text-ash-300 hover:text-fire-400 active:scale-95 transition-all duration-150 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 rounded-lg bg-fire-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fire-600 active:scale-95 transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-ash-300 hover:text-white active:scale-95 transition-all duration-300 md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="border-t border-ash-700 bg-ash-800 px-4 py-4">
              <div className="flex flex-col gap-3">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                  <Link href="/pricing" className="text-ash-300 hover:text-white text-sm">Pricing</Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Link href="/#gallery" className="text-ash-300 hover:text-white text-sm">Wall of Shame</Link>
                </motion.div>
                {session?.user ? (
                  <>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                      <Link href="/dashboard" className="text-ash-300 hover:text-white text-sm">Dashboard</Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <Link href="/referral" className="text-ash-300 hover:text-white text-sm">Referrals</Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                      <button onClick={() => signOut()} className="text-fire-400 hover:text-fire-300 text-sm text-left">Sign Out</button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <Link href="/auth/signin" className="w-full rounded-lg bg-fire-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fire-600 text-center inline-block">Sign In</Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
