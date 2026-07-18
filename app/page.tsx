import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Advantage from "@/components/Advantage";
import ProductRail from "@/components/ProductRail";
import OurStory from "@/components/OurStory";
import EditorialTiles from "@/components/EditorialTiles";
import BespokeSection from "@/components/BespokeSection";
import BrandMarquee from "@/components/BrandMarquee";
import StyleGallery from "@/components/StyleGallery";
import SocialProof from "@/components/SocialProof";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suturabyfeesah.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ClothingStore",
      "@id": `${siteUrl}/#store`,
      name: "Sutura by Feesah",
      alternateName: "The Feesaheffect",
      description:
        "Accra-based womenswear and bridal house. Bespoke tailoring, ready-to-wear and elegant modest attire for weddings, Eid and special occasions.",
      url: siteUrl,
      image: `${siteUrl}/landingPage/img09.jpeg`,
      logo: `${siteUrl}/logo.jpeg`,
      telephone: "+233203865161",
      email: "suturabyfeesah@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "GH",
      },
      currenciesAccepted: "GHS",
      sameAs: [
        "https://instagram.com/suturabyfeesah",
        "https://tiktok.com/@suturabyfeesah",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Sutura by Feesah",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#store` },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <Advantage />
      <ProductRail />
      <OurStory />
      <EditorialTiles />
      <BespokeSection />
      <BrandMarquee />
      <StyleGallery />
      <SocialProof />
      <Newsletter />
      <Footer />
    </main>
  );
}