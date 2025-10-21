"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ChevronUp, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

export default function PremiumQuickActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

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

  const actions = [
    {
      id: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      href: `https://wa.me/${siteConfig.contact.whatsappRaw}`,
      color: "from-green-500 to-green-600",
      shadow: "shadow-green-500/50",
      onClick: () => trackWhatsAppClick("quick-actions"),
    },
    {
      id: "phone",
      icon: Phone,
      label: "Позвонить",
      href: `tel:${siteConfig.contact.phoneRaw}`,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/50",
      onClick: () => trackPhoneClick("quick-actions"),
    },
    {
      id: "top",
      icon: ChevronUp,
      label: "Наверх",
      color: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/50",
      onClick: scrollToTop,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-24 md:bottom-6 right-6 z-40 flex flex-col gap-3"
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              onMouseEnter={() => setShowTooltip(action.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip === action.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/30 whitespace-nowrap"
                  >
                    <span className="text-sm font-medium text-white">{action.label}</span>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-slate-900" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button */}
              <motion.a
                href={action.href}
                target={action.href?.startsWith("http") ? "_blank" : undefined}
                rel={action.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={action.onClick}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="lg"
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} hover:brightness-110 shadow-xl ${action.shadow} relative overflow-hidden group`}
                >
                  {/* Animated background pulse */}
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />

                  <action.icon className="w-6 h-6 relative z-10 group-hover:animate-pulse" />

                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute top-1 right-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-white/80" />
                  </motion.div>
                </Button>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
