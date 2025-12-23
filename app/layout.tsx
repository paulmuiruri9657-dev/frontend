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

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "EcoLooP Ke | Online Shopping for Electronics, Fashion, Home & more",
  description: "EcoLooP Ke - Your sustainable online shopping destination for electronics, fashion, home, beauty & more",
  manifest: "/manifest.json",
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
        </Suspense>
      </body>
    </html>
  );
}
