"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";

export default function MobileStickyBooking() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показываем кнопку после 500px скролла
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBooking = () => {
    window.location.href = "/booking";
    trackCTAClick("Записаться", "mobile-sticky");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none"
        >
          <motion.div
            className="pointer-events-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleBooking}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-600/50 border-2 border-red-400/50 rounded-full"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Записаться онлайн
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
