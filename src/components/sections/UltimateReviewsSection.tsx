"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ThumbsUp } from "lucide-react";
import { reviews } from "@/lib/config";

export default function UltimateReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
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
            <ThumbsUp className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-white">Отзывы клиентов</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            Что говорят{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-red-500">
              наши клиенты
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Более 10,000 положительных отзывов за 5 лет работы
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative"
              style={{ perspective: "1000px" }}
            >
              {/* Review Card */}
              <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 p-4 md:p-8 shadow-2xl">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-white" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : {}}
                      transition={{
                        delay: index * 0.1 + i * 0.05,
                        type: "spring",
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 leading-relaxed mb-6 relative z-10">
                  "{review.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center">
                      <span className="text-lg font-black text-white">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Name & Service */}
                  <div className="flex-1">
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-sm text-white/60">{review.source}</div>
                  </div>

                  {/* Date Badge */}
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-xs font-semibold text-white/70">
                      {review.date}
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-white/10 to-red-600/10" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-400/50 p-4 md:p-8 text-center shadow-2xl shadow-red-600/50"
            >
              <div className="text-3xl md:text-5xl font-black text-white mb-2">10,000+</div>
              <div className="text-white/90 font-semibold">Довольных клиентов</div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 p-4 md:p-8 text-center shadow-2xl shadow-white/50"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-8 md:w-10 h-8 md:h-10 text-yellow-500 fill-yellow-500" />
                <div className="text-3xl md:text-5xl font-black text-slate-900">4.9</div>
              </div>
              <div className="text-gray-700 font-semibold">Средний рейтинг</div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400/50 p-4 md:p-8 text-center shadow-2xl shadow-blue-600/50"
            >
              <div className="text-3xl md:text-5xl font-black text-white mb-2">98%</div>
              <div className="text-white/90 font-semibold">Рекомендуют друзьям</div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-white/60">
            Присоединяйтесь к тысячам довольных клиентов Барбероса
          </p>
        </motion.div>
      </div>
    </section>
  );
}
