import CTASection from "../components/sections/CtaSection";
import FeaturesSection from "../components/sections/FeatureSection";
import Footer from "../components/layout/Footer";
import Guide from "../components/sections/Guide";
import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";

export default function LandinPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Guide />
      <CTASection />
      <Footer />
    </div>
  );
}
