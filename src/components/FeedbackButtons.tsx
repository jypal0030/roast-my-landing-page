"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const FEEDBACK_OPTIONS = [
  { value: "savage_af", emoji: "🔥", label: "Savage AF" },
  { value: "funny", emoji: "😂", label: "Funny" },
  { value: "meh", emoji: "😐", label: "Meh" },
  { value: "boring", emoji: "😴", label: "Boring" },
];

interface FeedbackButtonsProps {
  roastId: string;
  currentFeedback: string | null;
}

export function FeedbackButtons({ roastId, currentFeedback }: FeedbackButtonsProps) {
  const [selected, setSelected] = useState<string | null>(currentFeedback);
  const [submitting, setSubmitting] = useState(false);

  const handleFeedback = async (rating: string) => {
    if (submitting || selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/roast/${roastId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (res.ok) {
        setSelected(rating);
        toast.success("Thanks for the feedback! 🔥");
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {FEEDBACK_OPTIONS.map((opt) => (
        <motion.button
          key={opt.value}
          onClick={() => handleFeedback(opt.value)}
          disabled={submitting || !!selected}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={selected === opt.value ? { scale: [1, 1.15, 1] } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
            selected === opt.value
              ? "bg-fire-500/20 border-fire-500 text-fire-400"
              : "border-ash-700 bg-ash-800 text-ash-400 hover:border-ash-600 hover:text-ash-200"
          } disabled:cursor-not-allowed`}
        >
          {opt.emoji} {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
