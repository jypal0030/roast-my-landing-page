"use client";

import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UrlInput } from "@/components/UrlInput";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { WallOfShame } from "@/components/WallOfShame";
import { SocialProof } from "@/components/SocialProof";
import { FAQSection } from "@/components/FAQSection";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <AnimatedBackground />
      <HeroSection />
      <UrlInput isLoading={isLoading} setIsLoading={setIsLoading} />
      <HowItWorks />
      <FeaturesSection />
      <WallOfShame />
      <SocialProof />
      <FAQSection />
    </div>
  );
}
