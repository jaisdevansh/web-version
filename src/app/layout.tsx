import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/shared/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Entry Club | Premium Nightlife & Events",
    template: "%s | Entry Club"
  },
  description: "Discover, book, and experience the most exclusive nightlife events, guest lists, and table reservations with Entry Club.",
  keywords: ["nightlife", "clubbing", "guest list", "table booking", "events", "party", "entry club"],
  authors: [{ name: "Zenbourg Technologies" }],
  creator: "Zenbourg",
  publisher: "Entry Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://party.stayin.in'),
  alternates: {
    canonical: '/',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Preloader />
        <QueryProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
