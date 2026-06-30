"use client";

import { useState } from "react";
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
        <button
          key={opt.value}
          onClick={() => handleFeedback(opt.value)}
          disabled={submitting || !!selected}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            selected === opt.value
              ? "bg-fire-500/20 border-fire-500 text-fire-400"
              : "border-ash-700 bg-ash-800 text-ash-400 hover:border-ash-600 hover:text-ash-200"
          } disabled:cursor-not-allowed`}
        >
          {opt.emoji} {opt.label}
        </button>
      ))}
    </div>
  );
}
