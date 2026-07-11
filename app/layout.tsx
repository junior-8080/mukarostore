import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suturabyfeesah.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sutura by Feesah — The Feesaheffect | Accra, Ghana",
    template: "%s | Sutura by Feesah",
  },
  description:
    "Accra-based womenswear and bridal house by creative director Nafisa. Bespoke tailoring, ready-to-wear and elegant modest attire for weddings, Eid and special occasions. Nationwide delivery across Ghana.",
  keywords: [
    "Sutura by Feesah",
    "suturabyfeesah",
    "the Feesaheffect",
    "bespoke tailoring Accra",
    "bridal wear Ghana",
    "modest fashion Ghana",
    "womenswear Accra",
    "Eid outfits Ghana",
    "kaftan Ghana",
    "abaya Ghana",
    "wedding dress Accra",
    "ready-to-wear Ghana",
    "Ghana fashion designer",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  authors: [{ name: "Sutura by Feesah" }],
  creator: "Sutura by Feesah",
  publisher: "Sutura by Feesah",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Sutura by Feesah — The Feesaheffect | Accra, Ghana",
    description:
      "Bespoke tailoring, ready-to-wear and bridal wear for the modern modest woman. Designed and made in Accra.",
    url: siteUrl,
    siteName: "Sutura by Feesah",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/landingPage/img09.jpeg",
        width: 1200,
        height: 630,
        alt: "Sutura by Feesah — Bespoke & Bridal, Accra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sutura by Feesah — The Feesaheffect | Accra, Ghana",
    description:
      "Bespoke tailoring, ready-to-wear and bridal wear for the modern modest woman. Designed and made in Accra.",
    images: ["/landingPage/img09.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}