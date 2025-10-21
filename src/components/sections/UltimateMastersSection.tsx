"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Star, Scissors, TrendingUp } from "lucide-react";
import { masters } from "@/lib/config";
import Image from "next/image";

export default function UltimateMastersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="masters"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, #2563EB 0px, #2563EB 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
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
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600/20 backdrop-blur-xl border-2 border-blue-500/50 mb-6"
          >
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-white">Наша команда</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            Мастера{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-red-500">
              своего дела
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Опытные барберы с международными сертификатами и тысячами довольных клиентов
          </p>
        </motion.div>

        {/* Masters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-7xl mx-auto px-2 md:px-4">
          {masters.map((master, index) => (
            <motion.div
              key={master.id}
              initial={{ opacity: 0, y: 60, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
              }}
              whileHover={{ scale: 1.03, rotateY: 2 }}
              className="group relative"
              style={{ perspective: "1000px" }}
            >
              {/* Master Card */}
              <div className="relative overflow-hidden rounded-xl md:rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 md:border-2 shadow-2xl">
                {/* Image */}
                <div className="relative h-48 md:h-80 overflow-hidden bg-gradient-to-br from-blue-600/20 to-red-600/20">
                  {master.avatar ? (
                    <Image
                      src={master.avatar}
                      alt={master.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scissors className="w-12 md:w-24 h-12 md:h-24 text-white/30" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-3 md:p-6 space-y-2 md:space-y-4">
                  {/* Name */}
                  <h3 className="text-sm md:text-2xl font-black text-white leading-tight">
                    {master.name}
                  </h3>

                  {/* Title Badge */}
                  {master.title && (
                    <div className="inline-block px-2 md:px-4 py-1 md:py-2 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 border border-white/20">
                      <span className="text-[9px] md:text-xs font-bold text-white">{master.title}</span>
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center gap-2 md:gap-4">
                    {/* Experience */}
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl bg-blue-600/20 border border-blue-500/30">
                      <TrendingUp className="w-3 md:w-4 h-3 md:h-4 text-blue-400" />
                      <div className="text-left">
                        <div className="text-[8px] md:text-xs text-blue-300 font-semibold leading-tight">Стаж</div>
                        <div className="text-[10px] md:text-sm font-black text-white leading-tight">
                          {master.experience}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {master.description && (
                    <p className="text-[10px] md:text-sm text-white/70 leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-none">
                      {master.description}
                    </p>
                  )}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-white/10 to-red-600/10 rounded-xl md:rounded-3xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-16 text-center px-2"
        >
          <div className="inline-flex items-center gap-3 md:gap-8 px-4 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 md:border-2">
            <div className="text-center">
              <div className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                8+
              </div>
              <div className="text-[10px] md:text-sm text-white/70 mt-0.5 md:mt-1">Мастеров</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                10k+
              </div>
              <div className="text-[10px] md:text-sm text-white/70 mt-0.5 md:mt-1">Стрижек</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                4.9/5
              </div>
              <div className="text-[10px] md:text-sm text-white/70 mt-0.5 md:mt-1">Рейтинг</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
