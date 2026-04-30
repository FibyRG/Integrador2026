"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/biciventura/Navbar";
import Footer from "@/components/biciventura/Footer";
import HeroSection from "@/components/biciventura/HeroSection";
import FeaturesSection from "@/components/biciventura/FeaturesSection";
import BikeCatalog from "@/components/biciventura/BikeCatalog";
import GallerySection from "@/components/biciventura/GallerySection";
import TestimonialsSection from "@/components/biciventura/TestimonialsSection";
import CTABanner from "@/components/biciventura/CTABanner";
import ContactSection from "@/components/biciventura/ContactSection";
import FloatingCTA from "@/components/biciventura/FloatingCTA";

// Dynamic import for ReservationWizard to avoid SSR issues with Calendar
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
  const [preselectedBike, setPreselectedBike] = useState<PreselectedBike | undefined>();

  const handleReserve = (bike?: PreselectedBike) => {
    if (bike) {
      setPreselectedBike(bike);
    }
    const el = document.querySelector("#reservar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BikeCatalog onReserve={handleReserve} />
        <CTABanner />
        <GallerySection />
        <TestimonialsSection />
        <ReservationWizard preselectedBike={preselectedBike} />
        <ContactSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
