"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/biciventura/Navbar";
import Footer from "@/components/biciventura/Footer";
import HeroSection from "@/components/biciventura/HeroSection";
import FeaturesSection from "@/components/biciventura/FeaturesSection";
import BikeCatalog from "@/components/biciventura/BikeCatalog";
import PromotionsSection from "@/components/biciventura/PromotionsSection";
import GallerySection from "@/components/biciventura/GallerySection";
import TestimonialsSection from "@/components/biciventura/TestimonialsSection";
import AboutSection from "@/components/biciventura/AboutSection";
import CTABanner from "@/components/biciventura/CTABanner";
import ContactSection from "@/components/biciventura/ContactSection";
import FloatingCTA from "@/components/biciventura/FloatingCTA";
import Preloader from "@/components/biciventura/Preloader";
import SmoothScroll from "@/components/biciventura/SmoothScroll";

// Dynamic imports to avoid SSR issues
const ReservationWizard = dynamic(
  () => import("@/components/biciventura/ReservationWizard"),
  { ssr: false }
);

interface PreselectedBike {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [preselectedBike, setPreselectedBike] = useState<PreselectedBike | undefined>();

  const handleReserve = (bike?: PreselectedBike) => {
    if (bike) {
      setPreselectedBike(bike);
    }
    const el = document.querySelector("#reservar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <SmoothScroll />
      
      <div className="min-h-screen flex flex-col bg-warm-white">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <BikeCatalog onReserve={handleReserve} />
          <PromotionsSection />
          <CTABanner />
          <GallerySection />
          <TestimonialsSection />
          <AboutSection />
          <ReservationWizard preselectedBike={preselectedBike} />
          <ContactSection />
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </>
  );
}

