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

export default function Home() {
  return (
    <main>
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