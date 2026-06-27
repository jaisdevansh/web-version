import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import ReCaptchaProvider from "@/components/providers/ReCaptchaProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/shared/Preloader";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Entry Club | Premium Nightlife & Events",
    template: "%s | Entry Club"
  },
  description: "Discover, book, and experience the most exclusive nightlife events, guest lists, and table reservations with Entry Club.",
  keywords: ["nightlife", "clubbing", "guest list", "table booking", "events", "party", "entry club"],
  authors: [{ name: "Entry Club" }],
  creator: "Entry Club",
  publisher: "Entry Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://party.stayin.in'),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://party.stayin.in',
  },
  openGraph: {
    title: "Entry Club | Premium Nightlife & Events",
    description: "Discover, book, and experience the most exclusive nightlife events with Entry Club.",
    url: 'https://party.stayin.in',
    siteName: 'Entry Club',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Entry Club | Premium Nightlife",
    description: "Discover, book, and experience the most exclusive nightlife events with Entry Club.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SmoothScrollProvider>
          <Preloader />
          <ReCaptchaProvider>
            <QueryProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster />
            </QueryProvider>
          </ReCaptchaProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
