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
  title: "CBZ 2 PDF",
  description: "Convert any CBZ file to PDF to use in your Kindle device or do whatever you want! =D",
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

