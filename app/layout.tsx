import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Fonts (keep as before)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * GLOBAL SEO
 * - metadataBase sets the canonical host (we’re standardizing on the www domain)
 * - title template gives nicer <title> tags on nested pages
 * - alternates.canonical for the homepage
 * - openGraph/twitter for richer link previews
 * - robots to allow indexing
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.bestnocodeapp.com"),

  title: {
    default: "Best No-Code App",
    template: "%s | Best No-Code App",
  },

  description:
    "Discover, build and ship apps faster — guides, tools, and automation for no-code makers.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://www.bestnocodeapp.com/",
    siteName: "Best No-Code App",
    title: "Best No-Code App",
    description:
      "Discover, build and ship apps faster — guides, tools, and automation for no-code makers.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Best No-Code App",
    description:
      "Discover, build and ship apps faster — guides, tools, and automation for no-code makers.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },

  // Optional: theme color for browser UI
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
