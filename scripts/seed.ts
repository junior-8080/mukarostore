import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import ProductModel from "../lib/models/Product";
import { SEED_PRODUCTS } from "../lib/data";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set in .env.local");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const ops = SEED_PRODUCTS.map((p) => ({
    updateOne: {
      filter: { slug: p.slug },
      update: {
        $set: {
          name: p.name,
          slug: p.slug,
          category: p.category,
          isBundle: p.isBundle,
          price: p.price,
          description: p.description,
          bundleContents: p.bundleContents,
          images: p.images,
          popularity: p.popularity,
        },
      },
      upsert: true,
    },
  }));

  const result = await ProductModel.bulkWrite(ops);
  console.log(
    `Upserted ${result.upsertedCount} new products, modified ${result.modifiedCount} existing products`
  );

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
