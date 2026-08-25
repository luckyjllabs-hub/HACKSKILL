import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT AI-X — Build the right team, not just a team",
  description:
    "Describe your project idea and our AI will find the perfect teammates based on skills, interests, availability, and experience.",
  keywords: ["AI team formation", "hackathon matching", "project match", "skill gap detection", "Gemini AI", "PROJECT AI-X"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-on-background font-sans antialiased flex flex-col selection:bg-surface-container-highest">
        {children}
      </body>
    </html>
  );
}
