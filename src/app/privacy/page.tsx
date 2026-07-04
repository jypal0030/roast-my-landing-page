import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data at Roast My Landing Page.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-white mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-ash-300">
        <p>Last updated: June 2026</p>
        <h2 className="font-display text-xl text-white">1. Information We Collect</h2>
        <p>When you use Roast My Landing Page, we collect the URLs you submit for roasting, your email address (if you sign in), and basic analytics data (pages visited, time on site). We use Google and GitHub OAuth for authentication and never see your password.</p>
        <h2 className="font-display text-xl text-white">2. How We Use Your Data</h2>
        <p>Submitted URLs and roast results are used to generate your roast and may be displayed in our public gallery (Wall of Shame/Fame). You can request removal of any roast. Your email is used for account management and optional product updates.</p>
        <h2 className="font-display text-xl text-white">3. Data Security</h2>
        <p>All data is transmitted over SSL/TLS. Payments are processed by Paddle — we never see or store your credit card details. Authentication is handled by NextAuth.js with industry-standard OAuth 2.0.</p>
        <h2 className="font-display text-xl text-white">4. Third Parties</h2>
        <p>We use OpenAI for AI roast generation, Paddle for payments, and Google/GitHub for authentication. Each provider has its own privacy policy. We don&apos;t sell your data to anyone.</p>
        <h2 className="font-display text-xl text-white">5. Contact</h2>
        <p>For privacy concerns, contact us at privacy@roastmylp.com.</p>
      </div>
    </div>
  );
}
