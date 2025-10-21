"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Scissors } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

// Данные таблицы цен
const priceTable = {
  barbers: [
    { id: "barber", name: "БАРБЕР", color: "text-blue-400" },
    { id: "senior", name: "СТАРШИЙ БАРБЕР", color: "text-purple-400" },
    { id: "chef", name: "ШЕФ БАРБЕР", color: "text-orange-400" },
    { id: "best", name: "ЛУЧШИЙ БАРБЕР", color: "text-red-400" },
  ],
  services: [
    { id: "haircut", name: "СТРИЖКА МУЖСКАЯ", prices: [1600, 1800, 2000, 2300] },
    { id: "beard", name: "ОФОРМЛЕНИЕ БОРОДЫ", prices: [800, 900, 1000, 1500] },
    { id: "kids", name: "ДЕТСКАЯ СТРИЖКА", prices: [1000, 1200, 1500, 2000] },
    { id: "clipper", name: "СТРИЖКА МАШИНКОЙ", prices: [800, 900, 1000, 1500] },
    { id: "correction", name: "КОРРЕКЦИЯ СТРИЖКИ", prices: [1100, 1200, 1500, 2000] },
    { id: "royal-shave", name: "КОРОЛЕВСКОЕ БРИТЬЕ", prices: [1200, 1200, 1500, 1500] },
    { id: "head-shave", name: "БРИТЬЕ ГОЛОВЫ", prices: [1200, 1200, 1500, 1500] },
    { id: "beard-camouflage", name: "КАМУФЛЯЖ БОРОДЫ + ОФОРМЛЕНИЕ БОРОДЫ", prices: [1600, 1600, 1800, 1800] },
    { id: "hair-camouflage", name: "КАМУФЛЯЖ ВОЛОС", prices: [1600, 1600, 1800, 1800] },
    { id: "wax", name: "ВОСК", prices: [200, 200, 200, 200] },
    { id: "face-care", name: "УХОД ЗА ЛИЦОМ", prices: [1000, 1000, 1000, 1000] },
    { id: "styling", name: "УКЛАДКА", prices: [500, 500, 500, 500] },
  ],
};

const goToBooking = () => {
  window.location.href = "/booking";
  trackCTAClick("Записаться", "services");
};

export default function UltimateServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #DC2626 0px, #DC2626 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600/20 backdrop-blur-xl border-2 border-red-500/50 mb-6"
          >
            <Scissors className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-white">Наши услуги</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            ЦЕНА{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
              ВОПРОСА
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Прозрачные цены на все услуги
          </p>
        </motion.div>

        {/* Price Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-12 overflow-x-auto"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 border-white/10 shadow-2xl overflow-hidden min-w-[350px] md:min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-px bg-white/10">
              {/* Empty corner cell */}
              <div className="bg-slate-900 p-1 md:p-4 flex items-center justify-center">
                <span className="text-[8px] md:text-xs font-bold text-white/50 uppercase">Услуга</span>
              </div>
              {/* Barber categories */}
              {priceTable.barbers.map((barber, index) => (
                <motion.div
                  key={barber.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-slate-900 p-1 md:p-4 text-center"
                >
                  <span className={`text-[8px] md:text-sm font-black ${barber.color} uppercase leading-tight`}>
                    {barber.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {priceTable.services.map((service, serviceIndex) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + serviceIndex * 0.05 }}
                  className="grid grid-cols-5 gap-px bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {/* Service name */}
                  <div className="bg-slate-900/80 p-1 md:p-4 flex items-center">
                    <span className="text-[8px] md:text-sm font-bold text-white leading-tight">{service.name}</span>
                  </div>
                  {/* Prices */}
                  {service.prices.map((price, priceIndex) => (
                    <div
                      key={priceIndex}
                      className="bg-slate-900/80 p-1 md:p-4 flex items-center justify-center"
                    >
                      <span className="text-[9px] md:text-base font-black text-white">{price} ₽</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4">
            <Button
              onClick={goToBooking}
              size="lg"
              className="w-full sm:w-auto text-base md:text-xl px-8 md:px-16 py-6 md:py-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-600/50 border-2 border-red-400/50 rounded-full font-bold"
            >
              Записаться на услугу
            </Button>
          </motion.div>
          <p className="mt-6 text-white/60 text-sm">
            Гарантия качества • Опытные мастера • Премиальная косметика
          </p>
        </motion.div>
      </div>
    </section>
  );
}
