import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/craft/craft.css";
// In your app/layout.tsx or _app.tsx
import 'katex/dist/katex.min.css';
import '@/styles/katex.css'; // Your custom CSS

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import BodyWrapper from "@/components/BodyWrapper"; // Import BodyWrapper
import Script from "next/script";
import Head from "next/head"; // ✅ import Head

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynergiaPrep",
  description: "Your ultimate preparation platform.",
  openGraph: {
    title: "SynergiaPrep",
    description: "Your ultimate preparation platform.",
    url: "https://synergiaprep.com",
    siteName: "SynergiaPrep",
    images: [
      {
        url: "https://synergiaprep.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@synergiaprep",
    title: "SynergiaPrep",
    description: "Your ultimate preparation platform.",
    images: ["https://synergiaprep.com/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <Head>
          {/* ✅ Add favicon link */}
          <link rel="icon" href="/public/favicon.ico" />
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <BodyWrapper>
              <SessionProvider>{children}</SessionProvider>
            </BodyWrapper>
          </ThemeProvider>
        </body>
      </html>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
