"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick, trackCTAClick } from "@/lib/analytics";
import { sendPhoneClickToN8N, sendWhatsAppClickToN8N } from "@/lib/webhooks";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePhoneClick = () => {
    trackPhoneClick("header");
    sendPhoneClickToN8N("header");
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("header");
    sendWhatsAppClickToN8N("header");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      trackCTAClick(`Навигация: ${id}`, "header");
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-emerald-800">
              БАРБЕРОСА
            </div>
          </div>

          {/* Навигация - скрыта на мобильных */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-medium hover:text-emerald-700 transition"
            >
              Услуги
            </button>
            <button
              onClick={() => scrollToSection("masters")}
              className="text-sm font-medium hover:text-emerald-700 transition"
            >
              Мастера
            </button>
            <button
              onClick={() => scrollToSection("advantages")}
              className="text-sm font-medium hover:text-emerald-700 transition"
            >
              Преимущества
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium hover:text-emerald-700 transition"
            >
              Вопросы
            </button>
            <button
              onClick={() => scrollToSection("contacts")}
              className="text-sm font-medium hover:text-emerald-700 transition"
            >
              Контакты
            </button>
          </nav>

          {/* Контакты и CTA */}
          <div className="flex items-center space-x-3">
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              onClick={handlePhoneClick}
              className="hidden md:flex items-center space-x-2 text-sm font-medium hover:text-emerald-700 transition"
            >
              <Phone className="w-4 h-4" />
              <span>{siteConfig.contact.phone}</span>
            </a>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>

            <Button
              onClick={() => scrollToSection("booking")}
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Записаться
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
