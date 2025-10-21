"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { sendPhoneClickToN8N, sendWhatsAppClickToN8N } from "@/lib/webhooks";

export default function QuickActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhoneClick = () => {
    trackPhoneClick("quick-actions");
    sendPhoneClickToN8N("quick-actions");
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("quick-actions");
    sendWhatsAppClickToN8N("quick-actions");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </a>

      {/* Phone */}
      <a
        href={`tel:${siteConfig.contact.phoneRaw}`}
        onClick={handlePhoneClick}
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 shadow-lg"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </a>

      {/* Scroll to top */}
      <Button
        onClick={scrollToTop}
        size="lg"
        variant="outline"
        className="w-14 h-14 rounded-full bg-white shadow-lg"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
    </div>
  );
}
