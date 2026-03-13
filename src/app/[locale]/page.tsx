import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WelcomeSection from "@/components/sections/WelcomeSection";
import DirectionsSection from "@/components/sections/DirectionsSection";
import SpacesSection from "@/components/sections/SpacesSection";
import CulinarySection from "@/components/sections/CulinarySection";
import EventsSection from "@/components/sections/EventsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VoucherSection from "@/components/sections/VoucherSection";
import DestinationsSection from "@/components/sections/DestinationsSection";
import CtaSection from "@/components/sections/CtaSection";
import ContactSection from "@/components/sections/ContactSection";

export default function LocalePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WelcomeSection />
        <DirectionsSection />
        <SpacesSection />
        <CulinarySection />
        <EventsSection />
        <TestimonialsSection />
        <VoucherSection />
        <DestinationsSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
