"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/config";
import { Clock, Sparkles, TrendingUp, Zap } from "lucide-react";

const categories = ["Популярное", "Стрижки", "Борода", "Комплексы"];

export default function PremiumServicesSection() {
  const [activeCategory, setActiveCategory] = useState("Популярное");
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  const getServices = () => {
    if (activeCategory === "Популярное") {
      return services.filter(s => s.popular);
    }
    return services.filter(s => s.category === activeCategory);
  };

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-200">
              Премиальные услуги
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Услуги{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-400"
            >
              и цены
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="text-xl text-emerald-100/80 max-w-2xl mx-auto"
          >
            Профессиональный груминг с премиальной косметикой American Crew, Proraso, Uppercut Deluxe
          </motion.p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50"
                  : "bg-white/5 text-emerald-200 border border-white/10 hover:bg-white/10"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Services grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getServices().map((service, i) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              style={{ perspective: "1000px" }}
            >
              <LiquidGlassCard className="h-full p-6 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.popular ? (
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Zap className="w-6 h-6 text-violet-400" />
                    )}
                  </motion.div>
                </div>

                <p className="text-emerald-100/70 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-emerald-200/60 mb-6">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <motion.p
                      className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      {service.priceFrom}
                      {service.priceTo && service.priceTo !== service.priceFrom && (
                        <>-{service.priceTo}</>
                      )}₽
                    </motion.p>
                    {service.priceNote && (
                      <p className="text-xs text-emerald-200/40">{service.priceNote}</p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      onClick={scrollToBooking}
                      size="sm"
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                    >
                      Выбрать
                    </Button>
                  </motion.div>
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <p className="text-emerald-100/60 mb-6">
            В стоимость входит: консультация • мытье головы • массаж • укладка • напиток
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={scrollToBooking}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white shadow-2xl shadow-emerald-500/50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Записаться онлайн
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
