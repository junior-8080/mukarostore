import type { Metadata } from "next";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Product, IProduct } from "@/lib/models/Product";
import ProductDetailClient from "./ProductDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suturahbyfeesah.com";

async function getProduct(id: string): Promise<IProduct | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  try {
    await connectDB();
    return await Product.findById(id).lean<IProduct>();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false },
    };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/shop/${id}`,
    },
    openGraph: {
      title: `${product.name} | Sutura by Feesah`,
      description,
      url: `/shop/${id}`,
      type: "website",
      images: product.images.length
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Sutura by Feesah`,
      description,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${siteUrl}/shop/${id}`,
    brand: {
      "@type": "Brand",
      name: "Sutura by Feesah",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GHS",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/shop/${id}`,
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient id={id} />
    </>
  );
}