import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/lib/models/Product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    {
      url: `${siteUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    await connectDB();
    const products = await ProductModel.find({})
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt?: Date }[]>();

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    // DB unavailable (e.g. during build) — still serve the static routes
    return staticRoutes;
  }
}
