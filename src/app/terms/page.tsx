import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-white mb-8">Terms of Service</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-ash-300">
        <p>Last updated: June 2026</p>
        <h2 className="font-display text-xl text-white">1. Acceptance</h2>
        <p>By using Roast My Landing Page, you agree to these terms. Don&apos;t use the service to roast websites you don&apos;t have permission to analyze.</p>
        <h2 className="font-display text-xl text-white">2. AI-Generated Content</h2>
        <p>All roast content is AI-generated. We don&apos;t guarantee accuracy, though we try to make it useful. Roasts are meant for entertainment and improvement — don&apos;t take them too personally.</p>
        <h2 className="font-display text-xl text-white">3. Payments & Refunds</h2>
        <p>Subscriptions auto-renew monthly. You can cancel anytime from your dashboard. One-time purchases are non-refundable after the roast is generated. Contact support for exceptional cases.</p>
        <h2 className="font-display text-xl text-white">4. Referral Program</h2>
        <p>Referral commissions are paid when your balance reaches $10. We reserve the right to adjust commission rates with 30 days notice. Fraudulent referrals will result in account termination.</p>
        <h2 className="font-display text-xl text-white">5. Limitation of Liability</h2>
        <p>This service is provided as-is. We&apos;re not responsible for any decisions made based on AI-generated roast content. The money loss calculator provides estimates based on industry averages.</p>
      </div>
    </div>
  );
}
