import { Metadata } from "next";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Roast My Landing Page — the AI-powered website roaster that's helping thousands of founders fix their landing pages.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <Flame className="h-10 w-10 text-fire-500" />
        <h1 className="font-display text-5xl text-white">About RoastMyLP</h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-lg text-ash-300 leading-relaxed">
          Roast My Landing Page was born from a simple observation: website audit tools are boring. 
          Nobody shares a Lighthouse score on Twitter. But a savage, hilarious AI roast that tells you 
          your website looks like it was designed in 2006? That gets shared millions of times.
        </p>

        <h2 className="font-display text-2xl text-white mt-10">Our Mission</h2>
        <p className="text-ash-300 leading-relaxed">
          We believe website feedback should be three things: <strong>genuinely useful</strong>,{" "}
          <strong>entertainingly delivered</strong>, and <strong>shareable</strong>. Our AI combines 
          15+ years of UX/UI best practices with savage humor to create roasts that make you laugh, 
          think, and most importantly — fix your website.
        </p>

        <h2 className="font-display text-2xl text-white mt-10">How It Works</h2>
        <p className="text-ash-300 leading-relaxed">
          Enter any landing page URL. Our system captures a screenshot, analyzes the HTML structure, 
          runs performance checks, and feeds everything to our AI roast engine. In seconds, you get a 
          detailed breakdown of 8 categories with scores, savage commentary, actionable fixes, and a 
          money-loss calculator showing exactly how much revenue your website is losing.
        </p>

        <h2 className="font-display text-2xl text-white mt-10">Why It Works</h2>
        <p className="text-ash-300 leading-relaxed">
          The combination of humor and actionable feedback creates a powerful viral loop. Users share 
          their roasts because they&apos;re genuinely funny. Their followers try it on their own sites. 
          The cycle continues. Meanwhile, our money-loss calculator creates real urgency — when you see 
          you&apos;re losing $3,500/month because of a bad CTA button, you take action.
        </p>
      </div>
    </div>
  );
}
