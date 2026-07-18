import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Ready-to-Wear & Bespoke Pieces",
  description:
    "Shop Sutura by Feesah's ready-to-wear collection — kaftans, abayas, bridal and occasion wear designed in Accra, Ghana. Nationwide delivery.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop | Sutura by Feesah",
    description:
      "Kaftans, abayas, bridal and occasion wear designed in Accra, Ghana. Nationwide delivery.",
    url: "/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}