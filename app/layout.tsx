import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MukaroStore — Home & Office Essentials | Accra, Ghana",
    template: "%s | MukaroStore",
  },
  description:
    "Ghana-based home and office essentials store. Quality toiletries, plastics, cleaning supplies, and office products delivered fast across Accra and nationwide. Systems first. Hype last.",
  keywords: [
    "MukaroStore",
    "home essentials Ghana",
    "office supplies Accra",
    "toiletries Ghana",
    "cleaning supplies Accra",
    "Ghana home store",
    "office essentials Ghana",
    "bulk home products Ghana",
    "Accra delivery",
    "Ghana post GPS delivery",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  authors: [{ name: "MukaroStore" }],
  creator: "MukaroStore",
  publisher: "MukaroStore",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "MukaroStore — Home & Office Essentials | Accra, Ghana",
    description:
      "Quality home and office essentials for homes, offices, and institutions across Ghana. Fast delivery. No drama.",
    url: siteUrl,
    siteName: "MukaroStore",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MukaroStore — Home & Office Essentials, Accra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MukaroStore — Home & Office Essentials | Accra, Ghana",
    description:
      "Quality home and office essentials for homes, offices, and institutions across Ghana. Fast delivery. No drama.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${publicSans.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
