import Link from "next/link";
import { Flame, ArrowUpRight, ExternalLink, Globe, MessageCircle } from "lucide-react";

const productLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/#gallery", label: "Wall of Shame" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "mailto:hello@roastmylandingpage.online", label: "Contact" },
];

const resourceLinks = [
  { href: "/referral", label: "Referral Program" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/api/stats", label: "API Status" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ash-800/50">
      {/* ─── Main Footer ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ash-700 border border-ash-600 group-hover:border-fire-500/30 transition-colors">
                <Flame className="h-4 w-4 text-fire-500" />
              </div>
              <span className="font-display text-xl text-white tracking-wide">
                ROAST<span className="text-fire-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-ash-400 max-w-xs leading-relaxed mb-6">
              Brutally honest AI website roasts. Stop guessing why your landing page isn&apos;t converting — let us tell you exactly what&apos;s bleeding your money.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["SSL Secured", "Paddle Verified", "AI-Powered", "Instant Results"].map((b) => (
                <span key={b} className="rounded-full bg-ash-700/50 border border-white/[0.04] px-3 py-1 text-[10px] text-ash-400">
                  {b}
                </span>
              ))}
            </div>

            {/* Social + CTA */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-ash-400 hover:text-fire-400 hover:border-fire-500/20 hover:bg-fire-500/5 transition-all duration-150">
                <Globe className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-ash-400 hover:text-fire-400 hover:border-fire-500/20 hover:bg-fire-500/5 transition-all duration-150">
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-ash-400 hover:text-fire-400 hover:border-fire-500/20 hover:bg-fire-500/5 transition-all duration-150">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display text-sm text-white uppercase tracking-[0.15em] mb-5">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ash-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm text-white uppercase tracking-[0.15em] mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ash-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm text-white uppercase tracking-[0.15em] mb-5">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ash-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-ash-500">
              &copy; {new Date().getFullYear()} Roast My Landing Page.
            </p>
            <span className="text-ash-700">|</span>
            <p className="text-xs text-ash-600">
              All roasts are AI-generated. For entertainment and improvement.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Payment method icons */}
            {["Visa", "MC", "Amex", "PP", "GPay"].map((m) => (
              <span key={m} className="text-[10px] text-ash-600 font-medium tracking-wider">
                {m}
              </span>
            ))}
            <span className="text-xs text-ash-700">|</span>
            <span className="text-[10px] text-ash-600">
              Secured by Paddle
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
