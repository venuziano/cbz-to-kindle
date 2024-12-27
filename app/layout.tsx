import type { Metadata } from "next";
import localFont from "next/font/local";
// import { useLocale } from 'next-intl';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CBZ 2 PDF",
  description: "Convert any CBZ file to PDF to use in your Kindle device or do whatever you want! =D",
};

if (typeof window !== 'undefined' && window.__VERCEL_INSIGHTS__) {
  delete window.__VERCEL_INSIGHTS__;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const locale = useLocale();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

