import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from 'react-hot-toast';
import OfflineBanner from "@/components/OfflineBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import WebSiteSchema from "@/components/schema/WebSiteSchema";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "EcoLooP Ke | Online Shopping for Electronics, Fashion, Home & more",
  description: "EcoLooP Ke - Your sustainable online shopping destination for electronics, fashion, home, beauty & more in Kenya. Free delivery on orders over KES 1000.",
  keywords: ["online shopping kenya", "ecoloop", "electronics", "fashion", "home appliances", "beauty products", "kenya ecommerce"],
  authors: [{ name: "EcoLooP Ke" }],
  manifest: "/manifest.json",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://ecoloop.co.ke',
    siteName: 'EcoLooP Ke',
    title: 'EcoLooP Ke | Online Shopping for Electronics, Fashion, Home & more',
    description: 'Your sustainable online shopping destination in Kenya. Shop electronics, fashion, beauty & more with free delivery.',
    images: [
      {
        url: 'https://ecoloop.co.ke/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoLooP Ke - Online Shopping in Kenya',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'EcoLooP Ke | Online Shopping for Electronics, Fashion, Home & more',
    description: 'Your sustainable online shopping destination in Kenya',
    images: ['https://ecoloop.co.ke/images/og-image.jpg'],
  },

  // Verification
  verification: {
    google: 'your-google-verification-code', // Will add after Google Search Console setup
  },

  // Robots
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
    <html lang="en">
      <body className={`${inter.className} bg-[#f1f1f2] min-h-screen flex flex-col`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <Providers>
            <OfflineBanner />
            <Toaster />
            <ErrorBoundary>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
            </ErrorBoundary>
          </Providers>
          <OrganizationSchema />
          <WebSiteSchema />
        </Suspense>
      </body>
    </html>
  );
}
