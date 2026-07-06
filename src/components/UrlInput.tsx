"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { BrutalitySelector } from "./BrutalitySelector";
import { Analytics } from "@/lib/analytics";

const LOADING_MESSAGES = [
  { emoji: "🔍", text: "Scanning your website..." },
  { emoji: "📸", text: "Judging your design choices..." },
  { emoji: "🤖", text: "AI is finding things to mock..." },
  { emoji: "💰", text: "Calculating your financial damage..." },
  { emoji: "🔥", text: "Preparing your roast..." },
  { emoji: "💀", text: "This might hurt a little..." },
];

interface UrlInputProps {
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export function UrlInput({ isLoading, setIsLoading }: UrlInputProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [brutalityLevel, setBrutalityLevel] = useState(2);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) { setMsgIndex(0); return; }
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    Analytics.roastSubmitted(url.trim(), brutalityLevel);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), brutalityLevel }),
      });

      const data = await res.json();

      if (!res.ok) {
        Analytics.roastFailed(url.trim(), data.code || "unknown");
        if (data.code === "LIMIT_EXCEEDED") {
          toast.error(data.error);
        } else {
          toast.error(data.error || "Failed to roast. Try another URL!");
        }
        setIsLoading(false);
        return;
      }

      localStorage.setItem("lastRoast", JSON.stringify(data));
      router.push(`/roast/${data.id}`);
    } catch {
      Analytics.roastFailed(url.trim(), "network_error");
      toast.error("Something went wrong. Try again!");
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 pb-20">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl"
      >
        {/* URL input */}
        <div className="relative">
          <div className="flex gap-0 rounded-2xl bg-ash-800 border border-ash-600 focus-within:border-fire-500/50 transition-colors overflow-hidden">
            <div className="flex items-center pl-4">
              <Search className="h-5 w-5 text-ash-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your landing page URL..."
              className="flex-1 bg-transparent px-3 py-4 text-white placeholder:text-ash-500 focus:outline-none text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex items-center gap-2 bg-fire-500 px-6 py-4 text-sm font-bold text-white hover:bg-fire-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 m-1 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Flame className="h-5 w-5" />
              )}
              {isLoading ? "Roasting..." : "Roast It"}
            </button>
          </div>
        </div>

        {/* Loading progress message */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key={msgIndex}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-ash-300"
            >
              <span className="text-lg">{LOADING_MESSAGES[msgIndex].emoji}</span>
              <span>{LOADING_MESSAGES[msgIndex].text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brutality selector */}
        <BrutalitySelector
          brutalityLevel={brutalityLevel}
          setBrutalityLevel={setBrutalityLevel}
          disabled={isLoading}
        />

        {/* Privacy reassurance */}
        <p className="mt-3 text-center text-xs text-ash-600">
          🔒 No sign-up needed. Roasts are private by default — only you decide to share.
        </p>
      </motion.form>
    </section>
  );
}
