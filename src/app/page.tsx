"use client";

import { useState, useEffect } from "react";
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

// Dynamic imports to avoid SSR issues
const ReservationWizard = dynamic(
  () => import("@/components/biciventura/ReservationWizard"),
  { ssr: false }
);
const AdminPanel = dynamic(
  () => import("@/components/admin/AdminPanel"),
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
  const [adminOpen, setAdminOpen] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+A to open admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
      if (e.key === "Escape" && adminOpen) {
        setAdminOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adminOpen]);

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
      <Footer onOpenAdmin={() => setAdminOpen(true)} />
      <FloatingCTA onOpenAdmin={() => setAdminOpen(true)} />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
