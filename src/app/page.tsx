"use client";

import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UrlInput } from "@/components/UrlInput";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { RoastPreview } from "@/components/RoastPreview";
import { WallOfShame } from "@/components/WallOfShame";
import { PricingTable } from "@/components/PricingTable";
import { FAQSection } from "@/components/FAQSection";
import { SocialProof } from "@/components/SocialProof";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <AnimatedBackground />
      <HeroSection />
      <UrlInput isLoading={isLoading} setIsLoading={setIsLoading} />
      <RoastPreview />
      <WallOfShame />
      <SocialProof />
      <PricingTable />
      <FAQSection />
    </div>
  );
}
