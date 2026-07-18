import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suturahbyfeesah.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    await connectDB();
    const products = await Product.find({ inStock: true })
      .select("_id updatedAt")
      .lean<{ _id: { toString(): string }; updatedAt?: Date }[]>();

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/shop/${p._id.toString()}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    // DB unavailable (e.g. during build) — still serve the static routes
    return staticRoutes;
  }
}