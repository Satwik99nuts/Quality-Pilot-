import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopSphere",
  description: "System Under Test for QualityPilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-brand-bg text-brand-text min-h-screen flex flex-col transition-colors duration-300`}>
        <Providers>
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
          <footer className="bg-brand-surface text-brand-muted py-8 text-center text-sm border-t border-brand-bg">
            <p className="font-medium">ShopSphere - QualityPilot System Under Test</p>
            <p className="mt-2 text-xs opacity-70">Demo Application © 2026</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
