import Link from "next/link";
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ash-700 bg-ash-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-fire-500" />
              <span className="font-display text-xl text-white">
                RoastMy<span className="text-fire-500">LP</span>
              </span>
            </div>
            <p className="text-ash-400 text-sm">
              Brutally honest AI website roasts. Your website is bleeding money — let us show you where.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/pricing" className="text-ash-400 hover:text-ash-200 text-sm">Pricing</Link>
              <Link href="/#gallery" className="text-ash-400 hover:text-ash-200 text-sm">Roast Gallery</Link>
              <Link href="/referral" className="text-ash-400 hover:text-ash-200 text-sm">Referral Program</Link>
              <Link href="/#faq" className="text-ash-400 hover:text-ash-200 text-sm">FAQ</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-ash-400 hover:text-ash-200 text-sm">About</Link>
              <Link href="/privacy" className="text-ash-400 hover:text-ash-200 text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-ash-400 hover:text-ash-200 text-sm">Terms of Service</Link>
            </nav>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Trust</h4>
            <div className="flex flex-col gap-2 text-ash-400 text-sm">
              <span>🔒 SSL Secured</span>
              <span>💳 Paddle Secure</span>
              <span>🤖 AI-Powered</span>
              <span>⚡ Instant Results</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-ash-700 pt-8 text-center">
          <p className="text-ash-500 text-sm">
            © {new Date().getFullYear()} Roast My Landing Page. All roasts are AI-generated and meant for entertainment + improvement.
          </p>
        </div>
      </div>
    </footer>
  );
}
