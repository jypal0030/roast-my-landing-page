// Lightweight analytics — track what matters, nothing else.
// Fires POST to /api/events. No cookies, no PII, no session IDs.

const QUEUE: object[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (QUEUE.length === 0) return;
  const batch = QUEUE.splice(0);
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batch.length === 1 ? batch[0] : batch),
    keepalive: true,
  }).catch(() => {});
}

function enqueue(event: Record<string, unknown>) {
  QUEUE.push(event);
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      flush();
    }, 1000);
  }
}

// Flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flush);
}

export function track(event: string, props?: Record<string, unknown>) {
  enqueue({ event, ...props, path: typeof window !== "undefined" ? window.location.pathname : "/" });
}

// Key funnel events
export const Analytics = {
  pageView: () => track("page_view"),
  roastSubmitted: (url: string, brutalityLevel: number) =>
    track("roast_submitted", { url, brutalityLevel }),
  roastCompleted: (roastId: string, score: number) =>
    track("roast_completed", { roastId, score }),
  roastFailed: (url: string, error: string) =>
    track("roast_failed", { url, error }),
  roastShared: (roastId: string, platform: string) =>
    track("roast_shared", { roastId, sharePlatform: platform }),
  ctaClicked: (ctaType: string) =>
    track("cta_clicked", { ctaType }),
  challengeCopied: (roastId: string) =>
    track("challenge_copied", { roastId }),
  feedbackGiven: (roastId: string) =>
    track("feedback_given", { roastId }),
};
