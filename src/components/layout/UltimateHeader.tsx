"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Услуги", href: "#services" },
  { label: "Мастера", href: "#masters" },
  { label: "Отзывы", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];

export default function UltimateHeader() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Progress bar calculation
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / windowHeight) * 100;
      setScrollProgress(progress);

      // Header visibility - show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top - show header
        setIsHeaderVisible(true);
      }

      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Progress Bar - Always visible at top */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 via-white to-blue-600"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
        />
      </div>

      {/* Header - Shows/hides on scroll */}
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1 left-0 right-0 z-50 px-4"
          >
            <div className="container mx-auto">
              <div
                className={`
                  relative overflow-hidden rounded-3xl border-2
                  ${scrollY > 50
                    ? "bg-slate-950/95 backdrop-blur-xl border-white/20 shadow-2xl"
                    : "bg-slate-950/80 backdrop-blur-md border-white/10"
                  }
                  transition-all duration-300
                `}
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Logo - Left */}
                    <motion.button
                      onClick={scrollToTop}
                      className="flex items-center gap-3 group flex-shrink-0"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl md:text-3xl font-black">
                        <span className="text-red-600">БАРБЕ</span>
                        <span className="text-white">РОСА</span>
                      </div>
                    </motion.button>

                    {/* Desktop Navigation - Center */}
                    <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                      {navItems.map((item, index) => (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.label}
                        </motion.a>
                      ))}
                    </nav>

                    {/* Contact Buttons - Right */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      {/* Phone - icon only */}
                      <motion.a
                        href={`tel:${siteConfig.contact.phoneRaw}`}
                        onClick={() => trackPhoneClick("header")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={siteConfig.contact.phone}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border-white/30 rounded-full w-10 h-10 p-0"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </motion.a>

                      {/* WhatsApp - icon only */}
                      <motion.a
                        href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick("header")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="WhatsApp"
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-2 border-green-400/50 rounded-full shadow-lg shadow-green-600/30 w-10 h-10 p-0"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </motion.a>

                      {/* Booking Button */}
                      <motion.a
                        href="/booking"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-400/50 rounded-full font-bold shadow-lg shadow-red-600/30 px-4"
                        >
                          Записаться
                        </Button>
                      </motion.a>
                    </div>

                    {/* Mobile Menu Button - moved to right with ml-auto */}
                    <motion.button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="lg:hidden p-2 rounded-xl bg-white/10 text-white ml-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 lg:hidden"
          >
            <div className="bg-slate-950/98 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <nav className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    {item.label}
                  </motion.a>
                ))}

                <div className="pt-4 border-t border-white/10 space-y-2">
                  {/* Booking Button - Main CTA */}
                  <motion.a
                    href="/booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-400/50 rounded-xl font-bold shadow-lg shadow-red-600/30"
                    >
                      Записаться
                    </Button>
                  </motion.a>

                  <motion.a
                    href={`tel:${siteConfig.contact.phoneRaw}`}
                    onClick={() => {
                      trackPhoneClick("mobile-menu");
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border-white/30 rounded-xl font-bold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {siteConfig.contact.phone}
                    </Button>
                  </motion.a>

                  <motion.a
                    href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick("mobile-menu");
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-2 border-green-400/50 rounded-xl font-bold shadow-lg shadow-green-600/30"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Написать в WhatsApp
                    </Button>
                  </motion.a>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
