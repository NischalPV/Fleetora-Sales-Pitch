import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fleetora — The Operations Brain for Modern Car Rental",
  description:
    "One platform for branch ops, fleet intelligence, finance, and marketplace. Built for car rental.",
  applicationName: "Fleetora",
  authors: [{ name: "Fleetora" }],
  keywords: [
    "car rental",
    "fleet management",
    "operations platform",
    "branch ops",
    "fleet intelligence",
    "rental finance",
    "vehicle marketplace",
  ],
  openGraph: {
    title: "Fleetora — The Operations Brain for Modern Car Rental",
    description:
      "One platform for branch ops, fleet intelligence, finance, and marketplace.",
    siteName: "Fleetora",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
