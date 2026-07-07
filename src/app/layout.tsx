import type { Metadata } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Roast My Landing Page — AI-Powered Website Roaster",
    template: "%s | Roast My Landing Page",
  },
  description:
    "Brutally honest AI roasts your landing page in seconds. See how much money your website is losing. Fix everything for just $49.",
  openGraph: {
    title: "Roast My Landing Page — Your Website is Bleeding Money",
    description:
      "Brutally honest AI roasts your landing page in seconds. Get savage feedback, money-loss calculator, and actionable fixes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Landing Page — AI Website Roaster",
    description: "Brutally honest AI roasts your landing page in seconds.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js" async />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>
          <AnalyticsTracker />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#252540",
                color: "#e0e0e8",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
              },
              success: {
                style: {
                  border: "1px solid rgba(16,185,129,0.2)",
                },
              },
              error: {
                style: {
                  border: "1px solid rgba(233,69,96,0.3)",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
