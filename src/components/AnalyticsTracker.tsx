"use client";

import { useEffect } from "react";
import { Analytics } from "@/lib/analytics";

export function AnalyticsTracker() {
  useEffect(() => {
    Analytics.pageView();
  }, []);
  return null;
}
