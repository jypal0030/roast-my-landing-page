import { Metadata } from "next";
import { PricingTable } from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Start free, upgrade when you need more. One-time purchases available.",
};

export default function PricingPage() {
  return (
    <div className="py-8">
      <PricingTable />
    </div>
  );
}
