import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Afacad, Bebas_Neue, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/use-toast";

const afacad = Afacad({
  subsets: ["latin"],
  variable: "--font-afacad",
  adjustFontFallback: false
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  adjustFontFallback: false
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  adjustFontFallback: false
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.placetostand.agency"),
  title: {
    default: "Place To Stand | Your Lever in the Digital World",
    template: "%s | Place To Stand"
  },
  description:
    "We help small businesses make big moves with the right tools and a solid foundation. Digital Strategy, Development, and Marketing.",
  openGraph: {
    title: "Place To Stand | Your Lever in the Digital World",
    description:
      "We help small businesses make big moves with the right tools and a solid foundation. Digital Strategy, Development, and Marketing.",
    url: "https://www.placetostand.agency",
    siteName: "Place To Stand",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Place To Stand | Your Lever in the Digital World",
    description:
      "We help small businesses make big moves with the right tools and a solid foundation. Digital Strategy, Development, and Marketing."
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-ink-light text-ink",
          afacad.variable,
          bebasNeue.variable,
          sourceSans.variable
        )}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
