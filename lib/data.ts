// ─── Shop Data ────────────────────────────────────────────────────────────────

export type Product = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  collections: string[];
  images: string[];
  badge?: string;
  description: string;
  inStock: boolean;
  slug: string;
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    _id: "sample-1",
    name: "Nafisa Signature Kaba",
    price: 1850,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img01.JPG"],
    badge: "Signature",
    description: "Our house kaba — rich fabric, clean considered cuts.",
    inStock: true,
    slug: "nafisa-signature-kaba",
  },
  {
    _id: "sample-2",
    name: "Adaeze Kaftan",
    price: 1200,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img02.JPG"],
    description: "An easy, elevated kaftan for everyday elegance.",
    inStock: true,
    slug: "adaeze-kaftan",
  },
  {
    _id: "sample-3",
    name: "Zainab Two-Piece",
    price: 1450,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img04.JPG"],
    description: "A tailored two-piece that holds its shape all day.",
    inStock: true,
    slug: "zainab-two-piece",
  },
  {
    _id: "sample-4",
    name: "Asantewaa Gown",
    price: 2100,
    collections: ["bridal"],
    images: ["/landingPage/img05.JPG"],
    badge: "Bridal",
    description: "Aisle-ready drama, fitted by hand in our atelier.",
    inStock: true,
    slug: "asantewaa-gown",
  },
  {
    _id: "sample-5",
    name: "Layla Abaya Set",
    price: 1650,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img06.jpeg"],
    badge: "Best Seller",
    description: "Modest dressing that feels powerful, never small.",
    inStock: true,
    slug: "layla-abaya-set",
  },
  {
    _id: "sample-6",
    name: "Amina Boubou",
    price: 1950,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img07.jpeg"],
    badge: "New",
    description: "The boubou behind the Feesaheffect.",
    inStock: true,
    slug: "amina-boubou",
  },
  {
    _id: "sample-7",
    name: "Hafsa Wrap Dress",
    price: 1350,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img08.jpeg"],
    description: "A soft wrap silhouette, cinched and considered.",
    inStock: true,
    slug: "hafsa-wrap-dress",
  },
  {
    _id: "sample-8",
    name: "Serwaa Bridal Robe",
    price: 2400,
    collections: ["bridal"],
    images: ["/landingPage/img09.jpeg"],
    badge: "Bridal",
    description: "A hand-finished robe for the morning of.",
    inStock: true,
    slug: "serwaa-bridal-robe",
  },
  {
    _id: "sample-9",
    name: "Maimuna Eid Set",
    price: 1750,
    collections: ["ready-to-wear"],
    images: ["/landingPage/img01.JPG"],
    description: "Eid-morning polish, comfortable past midnight.",
    inStock: true,
    slug: "maimuna-eid-set",
  },
  {
    _id: "sample-10",
    name: "Efua Corset Gown",
    price: 2250,
    collections: ["bridal"],
    images: ["/landingPage/img02.JPG"],
    description: "Structured through the bodice, fluid to the floor.",
    inStock: true,
    slug: "efua-corset-gown",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Bespoke", href: "/#bespoke" },
  { label: "Our Story", href: "/#story" },
  { label: "Contact", href: "/#contact" },
];

export const TESTIMONIALS = [
  {
    name: "Abena O.",
    role: "Bridal client, Accra",
    text: "My wedding dress was better than anything I saw abroad. Nafisa understood the assignment.",
  },
  {
    name: "Fatima A.",
    role: "Verified buyer",
    text: "The Feesaheffect is real — I get stopped every time I wear my bou bou.",
  },
  {
    name: "Naa Dede",
    role: "Verified buyer",
    text: "Bespoke fitting was so smooth. Finally, modest wear that feels made for me.",
  },
];