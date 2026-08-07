// ─── MukaroCore Data ───────────────────────────────────────────────────────────

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: "Toiletries" | "Plastics" | "Cleaning" | "Office" | "Bundles";
  isBundle: boolean;
  price: number;
  description: string;
  bundleContents?: string[];
  images: string[];
  popularity: number;
  createdAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: { name: string; phone: string; gpsAddress: string };
  paymentMethod: "MoMo" | "Card" | "Bank Transfer";
  promoCode?: string;
  status: "placed" | "processing" | "delivered";
  createdAt: string;
};

export const CATEGORIES = [
  "All Products",
  "Toiletries",
  "Plastics",
  "Cleaning",
  "Office",
  "Bundles",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DELIVERY_THRESHOLD = 200;
export const DELIVERY_FEE = 15;
export const PROMO_CODES: Record<string, number> = { MUKARO10: 10 };

// ─── Image URLs ────────────────────────────────────────────────────────────────
const TOILETRIES_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80";
const PLASTICS_IMG =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
const CLEANING_IMG =
  "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80";
const OFFICE_IMG =
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80";
const BUNDLES_IMG =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80";

export const SEED_PRODUCTS: Product[] = [
  {
    _id: "mkc-001",
    name: "Dove Body Wash 250ml",
    slug: "dove-body-wash-250ml",
    category: "Toiletries",
    isBundle: false,
    price: 18,
    description:
      "Dove moisturising body wash with deep nourishment formula. Leaves skin soft and clean after every wash.",
    images: [TOILETRIES_IMG],
    popularity: 75,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-002",
    name: "Oral-B Toothbrush Pack (x3)",
    slug: "oral-b-toothbrush-pack",
    category: "Toiletries",
    isBundle: false,
    price: 25,
    description:
      "Pack of 3 Oral-B toothbrushes with indicator bristles that fade when it's time to replace. Medium bristles suitable for adults.",
    images: [TOILETRIES_IMG],
    popularity: 65,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-003",
    name: "Dettol Hand Sanitizer 500ml",
    slug: "dettol-hand-sanitizer-500ml",
    category: "Toiletries",
    isBundle: false,
    price: 22,
    description:
      "Dettol hand sanitizer kills 99.9% of bacteria and viruses. 500ml pump bottle ideal for home and office use.",
    images: [TOILETRIES_IMG],
    popularity: 80,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-004",
    name: "Nivea Body Lotion 400ml",
    slug: "nivea-body-lotion-400ml",
    category: "Toiletries",
    isBundle: false,
    price: 35,
    description:
      "Nivea Soft moisturising body lotion enriched with Vitamin E and Jojoba oil. Absorbs quickly without a greasy feel.",
    images: [TOILETRIES_IMG],
    popularity: 70,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-005",
    name: "Storage Container Set (5pcs)",
    slug: "storage-container-set-5pcs",
    category: "Plastics",
    isBundle: false,
    price: 45,
    description:
      "Set of 5 durable food-grade plastic containers in assorted sizes. Airtight lids keep food fresh. Stackable design saves space.",
    images: [PLASTICS_IMG],
    popularity: 60,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-006",
    name: "Nally Bucket 20L",
    slug: "nally-bucket-20l",
    category: "Plastics",
    isBundle: false,
    price: 28,
    description:
      "Heavy-duty 20-litre Nally bucket with strong handle. Ideal for home cleaning, laundry, and general household use.",
    images: [PLASTICS_IMG],
    popularity: 55,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-007",
    name: "Food Storage Bowls (set of 6)",
    slug: "food-storage-bowls-set-6",
    category: "Plastics",
    isBundle: false,
    price: 38,
    description:
      "Set of 6 microwave-safe food storage bowls with snap-on lids. BPA-free, dishwasher safe, perfect for meal prep.",
    images: [PLASTICS_IMG],
    popularity: 50,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-008",
    name: "Flash Floor Cleaner 1L",
    slug: "flash-floor-cleaner-1l",
    category: "Cleaning",
    isBundle: false,
    price: 20,
    description:
      "Flash multi-surface floor cleaner leaves floors sparkling clean with a fresh scent. Works on tiles, hardwood, and laminate.",
    images: [CLEANING_IMG],
    popularity: 62,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-009",
    name: "Vim Multipurpose Scrub",
    slug: "vim-multipurpose-scrub",
    category: "Cleaning",
    isBundle: false,
    price: 12,
    description:
      "Vim scouring powder cuts through grease and tough stains on pots, pans, sinks, and tiles. Works without scratching surfaces.",
    images: [CLEANING_IMG],
    popularity: 68,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-010",
    name: "Broom & Dustpan Set",
    slug: "broom-dustpan-set",
    category: "Cleaning",
    isBundle: false,
    price: 55,
    description:
      "Complete broom and dustpan combo with long handle. Soft bristles for indoor sweeping. Matching set for a clean, organised home.",
    images: [CLEANING_IMG],
    popularity: 45,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-011",
    name: "A4 Paper Ream (500 sheets)",
    slug: "a4-paper-ream-500-sheets",
    category: "Office",
    isBundle: false,
    price: 65,
    description:
      "80gsm A4 white copy paper, 500 sheets per ream. Suitable for laser and inkjet printers. Bright white for crisp, clear prints.",
    images: [OFFICE_IMG],
    popularity: 58,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-012",
    name: "Ballpoint Pen Pack (20pcs)",
    slug: "ballpoint-pen-pack-20pcs",
    category: "Office",
    isBundle: false,
    price: 18,
    description:
      "Pack of 20 smooth-writing ballpoint pens in blue. Medium tip, comfortable grip, long-lasting ink. Office staple.",
    images: [OFFICE_IMG],
    popularity: 42,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-013",
    name: "Monthly Home Essentials Box",
    slug: "monthly-home-essentials-box",
    category: "Bundles",
    isBundle: true,
    price: 199,
    description:
      "Everything your home needs for the month in one convenient box. Curated for maximum value — toiletries, cleaning supplies, and storage all included.",
    bundleContents: [
      "Dove Body Wash",
      "Dettol Sanitizer",
      "Flash Floor Cleaner",
      "Vim Scrub",
      "Storage Container Set",
      "Nally Bucket",
    ],
    images: [BUNDLES_IMG],
    popularity: 92,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-014",
    name: "Office Cleaning Bundle",
    slug: "office-cleaning-bundle",
    category: "Bundles",
    isBundle: true,
    price: 120,
    description:
      "A complete cleaning and stationery kit designed for offices. Keep your workspace spotless and fully stocked.",
    bundleContents: [
      "Flash Floor Cleaner 1L",
      "Vim Multipurpose Scrub",
      "Broom & Dustpan Set",
      "Ballpoint Pen Pack",
    ],
    images: [BUNDLES_IMG],
    popularity: 87,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mkc-015",
    name: "Student Hostel Pack",
    slug: "student-hostel-pack",
    category: "Bundles",
    isBundle: true,
    price: 165,
    description:
      "The perfect starter pack for hostel life. Everything a student needs to settle in — from personal hygiene to study supplies.",
    bundleContents: [
      "Dove Body Wash",
      "Oral-B Toothbrush Pack",
      "Dettol Hand Sanitizer",
      "Food Storage Bowls Set",
      "A4 Paper Ream",
    ],
    images: [BUNDLES_IMG],
    popularity: 95,
    createdAt: new Date().toISOString(),
  },
];
