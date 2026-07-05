"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What exactly is Roast My Landing Page?",
    a: "It's an AI-powered tool that analyzes any landing page URL and gives you a brutally honest, hilarious roast of your website's design, copywriting, mobile-friendliness, and more. Along with the roast, you get a money-loss calculator showing exactly how much revenue your page is losing due to design issues. Think of it as a website audit, but fun and shareable.",
  },
  {
    q: "How does the money loss calculator work?",
    a: "Our AI estimates your monthly traffic and applies industry-standard conversion loss rates for each identified issue. For example, slow loading loses ~7% conversions per extra second, bad CTAs lose 15-25%, and lack of mobile optimization loses 60% of mobile traffic. Each loss is multiplied by an estimated average order value to give you dollar figures. The total is your estimated monthly revenue bleed.",
  },
  {
    q: "Is this actually accurate or just funny?",
    a: "Both. The AI analysis uses real Lighthouse-style performance metrics, HTML structure analysis, and design principles. The roast is delivered with savage humor, but the underlying analysis and fix recommendations are genuinely actionable. Many users have improved conversions by 20-40% after fixing issues our roasts identified.",
  },
  {
    q: "Can I use it on any website?",
    a: "Yes! Any publicly accessible URL works. Your own landing page, a competitor's site, or even famous websites — though some sites with aggressive bot protection may block our screenshot tool. In those cases, you can upload a screenshot manually.",
  },
  {
    q: "How does the referral program work?",
    a: "You get a unique referral link. When someone signs up using your link and makes a purchase, you earn lifetime commissions on their payments — and even on payments made by people they refer (up to 3 levels deep). Free users earn 15% on Level 1, while Agency users earn 30% across all 3 levels. Commissions are paid via PayPal when your balance reaches $10.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. There are no contracts or cancellation fees. You can upgrade, downgrade, or cancel at any time from your dashboard. If you cancel, you'll retain access to your paid features until the end of your current billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Paddle for all payments, which means you can pay with all major credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal, and most local payment methods. Paddle handles global tax/VAT compliance automatically.",
  },
  {
    q: "Do I own the roast results?",
    a: "Yes. All roast results you generate are yours. Paid users can download clean roast cards without watermarks and export reports as PDFs. Free tier roasts include a small branded watermark.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-ash-800 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-ash-400">
            Everything you need to know before getting roasted.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left rounded-xl border border-ash-700 bg-ash-800/50 p-5 hover:border-ash-600 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-ash-400 shrink-0 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm text-ash-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
