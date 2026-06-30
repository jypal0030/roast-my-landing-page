import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
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
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1a2e",
                color: "#e8e8f0",
                border: "1px solid #333355",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
