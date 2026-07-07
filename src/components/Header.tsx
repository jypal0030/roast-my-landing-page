"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, LogOut, LayoutDashboard, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToInput = () => {
    const el = document.getElementById("url-input");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ash-700 border border-ash-600 group-hover:border-fire-500/30 transition-colors duration-300">
            <Flame className="h-4 w-4 text-fire-500" />
          </div>
          <span className="font-display text-xl text-white tracking-wide">
            ROAST<span className="text-fire-500">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#how-it-works"
            className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white active:scale-95 transition-all duration-150"
          >
            HOW IT WORKS
          </Link>
          <Link
            href="/pricing"
            className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white active:scale-95 transition-all duration-150"
          >
            PRICING
          </Link>
          <Link
            href="/#gallery"
            className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white active:scale-95 transition-all duration-150"
          >
            FEATURES
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/referral"
                className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-ember-400 active:scale-95 transition-all duration-150"
              >
                REFERRALS
              </Link>
              <Link
                href="/dashboard"
                className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white active:scale-95 transition-all duration-150"
              >
                DASHBOARD
              </Link>
              <button
                onClick={() => signOut()}
                className="font-display text-xs tracking-[0.15em] text-ash-500 hover:text-fire-400 active:scale-95 transition-all duration-150"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white active:scale-95 transition-all duration-150"
            >
              SIGN IN
            </Link>
          )}

          <button
            onClick={scrollToInput}
            className="rounded-full bg-fire-500 px-5 py-2 text-sm font-bold text-white hover:bg-fire-600 active:scale-95 transition-all duration-150 shadow-[0_0_20px_rgba(233,69,96,0.2)]"
          >
            ROAST IT
          </button>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={scrollToInput}
            className="rounded-full bg-fire-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-fire-600 active:scale-95 transition-all duration-150"
          >
            ROAST IT
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-ash-300 hover:text-white active:scale-95 transition-all duration-150"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="overflow-hidden md:hidden border-t border-white/[0.06] bg-ash-800/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              <Link href="/#how-it-works" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">HOW IT WORKS</Link>
              <Link href="/pricing" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">PRICING</Link>
              <Link href="/#gallery" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">FEATURES</Link>
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">DASHBOARD</Link>
                  <Link href="/referral" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">REFERRALS</Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-3 py-2.5 font-display text-xs tracking-[0.15em] text-fire-400 hover:text-fire-300">SIGN OUT</button>
                </>
              ) : (
                <Link href="/auth/signin" className="block px-3 py-2.5 font-display text-xs tracking-[0.15em] text-ash-400 hover:text-white rounded-lg hover:bg-ash-700/50">SIGN IN</Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
