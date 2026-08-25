import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f9f9",
};

export const metadata: Metadata = {
  title: "PROJECT AI-X — Build the right team, not just a team",
  description:
    "Describe your project idea and our AI will find the perfect teammates based on skills, interests, availability, and experience.",
  keywords: [
    "AI team formation",
    "hackathon matching",
    "project match",
    "skill gap detection",
    "Gemini AI",
    "PROJECT AI-X",
  ],
  authors: [{ name: "PROJECT AI-X Team" }],
  openGraph: {
    title: "PROJECT AI-X — Build the right team, not just a team",
    description:
      "AI-powered multi-factor student team formation and critical skill gap resolution platform.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-on-background font-sans antialiased flex flex-col selection:bg-surface-container-highest">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
