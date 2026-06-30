"use client";

import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UrlInput } from "@/components/UrlInput";
import { WallOfShame } from "@/components/WallOfShame";
import { PricingTable } from "@/components/PricingTable";
import { FAQSection } from "@/components/FAQSection";
import { SocialProof } from "@/components/SocialProof";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <HeroSection />
      <UrlInput isLoading={isLoading} setIsLoading={setIsLoading} />
      <WallOfShame />
      <SocialProof />
      <PricingTable />
      <FAQSection />
    </div>
  );
}
