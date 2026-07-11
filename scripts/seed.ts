import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Collection } from "../lib/models/Collection";
import { Product } from "../lib/models/Product";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const SEED_COLLECTIONS = [
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "eid", label: "Eid Collection" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "abayas", label: "Abayas" },
  { id: "kaftans", label: "Kaftans" },
];

const SEED_PRODUCTS = [
  { name: "Pearl Embroidered Abaya", price: 480, collections: ["abayas", "best-sellers"], image: "/landingPage/bestSeller.jpeg", badge: "Best Seller", description: "Flowing black abaya with delicate pearl embroidery at the cuffs and neckline." },
  { name: "Eid Blossom Kaftan", price: 620, originalPrice: 750, collections: ["kaftans", "eid", "new-arrivals"], image: "/landingPage/newArrivals.jpeg", badge: "Eid Special", description: "Rich fabric kaftan adorned with floral prints — perfect for Eid celebrations." },
  { name: "Classic Linen Modest Dress", price: 340, collections: ["best-sellers", "new-arrivals"], image: "/landingPage/madeToFit.jpeg", badge: "New", description: "Breathable linen dress with a flattering A-line silhouette, ideal for everyday modest wear." },
  { name: "Golden Hour Kaftan", price: 540, collections: ["kaftans", "eid"], image: "/landingPage/bestSeller.jpeg", badge: "Eid Special", description: "Luxurious gold-trimmed kaftan that brings radiance to any gathering." },
  { name: "Midnight Velvet Abaya", price: 720, collections: ["abayas", "new-arrivals"], image: "/landingPage/newArrivals.jpeg", badge: "New", description: "Deep midnight velvet abaya with satin lining — opulence redefined." },
  { name: "Sage Wrap Modest Dress", price: 290, collections: ["best-sellers"], image: "/landingPage/madeToFit.jpeg", badge: "Best Seller", description: "Soft sage wrap dress with elegant drape — effortlessly modest and stylish." },
  { name: "Rose Silk Kaftan", price: 590, originalPrice: 680, collections: ["kaftans", "new-arrivals"], image: "/landingPage/bestSeller.jpeg", badge: "New", description: "Silky rose kaftan with hand-finished edges, perfect for formal occasions." },
  { name: "Eid Ivory Abaya Set", price: 850, collections: ["abayas", "eid"], image: "/landingPage/newArrivals.jpeg", badge: "Eid Special", description: "Coordinated ivory abaya and inner dress — the ultimate Eid statement piece." },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  await Collection.deleteMany({});
  await Product.deleteMany({});

  await Collection.insertMany(
    SEED_COLLECTIONS.map((c, i) => ({ id: c.id, label: c.label, order: i, active: true }))
  );
  console.log(`Seeded ${SEED_COLLECTIONS.length} collections`);

  await Product.insertMany(
    SEED_PRODUCTS.map((p) => ({
      name: p.name,
      slug: slugify(p.name),
      price: p.price,
      originalPrice: p.originalPrice,
      collections: p.collections,
      images: [p.image],
      badge: p.badge,
      description: p.description,
      inStock: true,
    }))
  );
  console.log(`Seeded ${SEED_PRODUCTS.length} products`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((e) => { console.error(e); process.exit(1); });