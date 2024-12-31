import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from 'next/headers';

import I18nClientWrapper from "@/utils/i18n/i18n-wrapper";

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
  title: "CBZ 2 PDF Converter",
  description: "Convert any CBZ file to PDF (CBZ to PDF) to use in your Kindle device or do whatever you want! =D",
  keywords: ["cbz", "pdf", "convert", "kindle", "manga", "comics", "to", "converter", "convert", "anime"],
  openGraph: {
    title: "CBZ 2 PDF Converter",
    description: "Easily convert your CBZ files to PDF format for Kindle or other e-readers.",
    url: "https://www.cbz-to-pdf.com.br/",
    siteName: "CBZ 2 PDF",
    images: [
      {
        url: "https://d378pye9mzk55i.cloudfront.net/Image20241212182458.jpg",
        width: 1200,
        height: 630,
        alt: "CBZ 2 PDF Converter Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const acceptLanguage = requestHeaders.get('accept-language') || 'en';
  const userLanguage = acceptLanguage.split(',')[0] || 'en';
  
  return (
    <html lang={userLanguage}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nClientWrapper userLanguage={userLanguage}>
          {children}
        </I18nClientWrapper>
      </body>
    </html>
  );
}

