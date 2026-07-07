import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* The void asks the question */}
      <p className="text-ash-500 text-xs tracking-[0.3em] uppercase mb-8">
        You wandered into the void
      </p>

      {/* Score: zero — the ultimate roast */}
      <div className="relative mb-10">
        <div className="font-display text-[12rem] sm:text-[16rem] leading-none text-fire-500/10 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-5xl sm:text-7xl text-fire-400">
            NOPE
          </p>
        </div>
      </div>

      {/* Savage truth */}
      <p className="text-lg text-ash-300 max-w-md mb-8 leading-relaxed">
        This page doesn&apos;t exist. Kind of like the conversion rate on the website you came here to roast.
      </p>

      {/* CTA — the only way out */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-fire-500 to-fire-600 px-8 py-4 text-base font-bold text-white hover:from-fire-400 hover:to-fire-500 active:scale-95 transition-all duration-150"
        style={{ boxShadow: "0 0 40px rgba(233,69,96,0.2), 0 8px 24px rgba(0,0,0,0.3)" }}
      >
        <Flame className="h-5 w-5" />
        Roast Something Real
      </Link>

      <p className="mt-8 text-xs text-ash-600">
        Or stay lost. We&apos;re not your mom.
      </p>
    </div>
  );
}
