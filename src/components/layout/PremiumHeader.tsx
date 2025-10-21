"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Menu, X, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick, trackCTAClick } from "@/lib/analytics";

export default function PremiumHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.95)"]);
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Reversed sticky: показываем при скролле вверх
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      trackCTAClick(`Навигация: ${id}`, "header");
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "services", label: "Услуги" },
    { id: "masters", label: "Мастера" },
    { id: "advantages", label: "Преимущества" },
    { id: "reviews", label: "Отзывы" },
    { id: "faq", label: "FAQ" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: headerBg as any,
          backdropFilter: headerBlur as any,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-400">
                  БАРБЕРОСА
                </h1>
                <p className="text-xs text-emerald-200/60">Премиальный барбершоп</p>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ scale: 1.1, color: "#10b981" }}
                  className="text-sm font-medium text-emerald-100 hover:text-emerald-400 transition-colors relative group"
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                onClick={() => trackPhoneClick("header")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <Phone className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
                <span className="text-sm font-medium text-white">{siteConfig.contact.phone}</span>
              </motion.a>

              <motion.a
                href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("header")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  className="hidden sm:flex bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </motion.a>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => scrollToSection("booking")}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white shadow-lg shadow-emerald-500/50"
                >
                  Записаться
                </Button>
              </motion.div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-emerald-500 via-violet-500 to-emerald-500 origin-left"
          style={{ scaleX: useTransform(scrollY, [0, document.body.scrollHeight], [0, 1]) }}
        />
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
