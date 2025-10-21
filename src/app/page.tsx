"use client";

import { useEffect } from "react";
import { initGA, initConsentMode, trackPageView } from "@/lib/analytics";
import UltimateHeroSection from "@/components/sections/UltimateHeroSection";
import UltimateServicesSection from "@/components/sections/UltimateServicesSection";
import UltimateMastersSection from "@/components/sections/UltimateMastersSection";
import AtmosphereSection from "@/components/sections/AtmosphereSection";
import UltimateAdvantagesSection from "@/components/sections/UltimateAdvantagesSection";
import UltimateReviewsSection from "@/components/sections/UltimateReviewsSection";
import UltimateFAQSection from "@/components/sections/UltimateFAQSection";
import UltimateContactSection from "@/components/sections/UltimateContactSection";
import UltimateHeader from "@/components/layout/UltimateHeader";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import PremiumQuickActions from "@/components/PremiumQuickActions";
import MobileStickyBooking from "@/components/MobileStickyBooking";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  useEffect(() => {
    // Инициализация аналитики
    initConsentMode();
    initGA();
    trackPageView();

    // Smooth scrolling для всех якорей
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      <UltimateHeader />
      <main className="min-h-screen bg-slate-950">
        <UltimateHeroSection />
        <UltimateServicesSection />
        <UltimateMastersSection />
        <AtmosphereSection />
        <UltimateAdvantagesSection />
        <UltimateReviewsSection />
        <UltimateFAQSection />
        <UltimateContactSection />
      </main>
      <Footer />
      <PremiumQuickActions />
      <MobileStickyBooking />
      <CookieBanner />
      <Toaster position="top-right" richColors />
    </>
  );
}
