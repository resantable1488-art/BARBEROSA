"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const atmosphereImages = [
  { id: 1, src: "/gallery/interier.png", title: "Интерьер", description: "Винтажный стиль 1920-х" },
  { id: 2, src: "/gallery/interier2.png", title: "Рабочее место", description: "Все для вашего комфорта" },
  { id: 3, src: "/gallery/interier3.png", title: "Атмосфера", description: "Мужской клуб" },
  { id: 4, src: "/gallery/image2.png", title: "Процесс работы", description: "Профессионализм в деталях" },
  { id: 5, src: "/gallery/image3.png", title: "Мастер за работой", description: "Опыт и точность" },
  { id: 6, src: "/gallery/image4.png", title: "Уютная зона", description: "Место для отдыха" },
];

export default function AtmosphereSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #F59E0B 0px, #F59E0B 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl"
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
        className="absolute bottom-20 left-10 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600/20 backdrop-blur-xl border-2 border-amber-500/50 mb-6"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">Атмосфера</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            НАШ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-white to-orange-500">
              БАРБЕРШОП
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Винтажный интерьер, виски-бар и атмосфера мужского клуба
          </p>
        </motion.div>

        {/* Image Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-7xl mx-auto px-2 md:px-4">
          {atmosphereImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="relative group aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl"
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                  <h3 className="text-white font-black text-xs md:text-xl mb-1 md:mb-2">{image.title}</h3>
                  <p className="text-white/80 text-[10px] md:text-sm leading-tight">{image.description}</p>
                </div>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-transparent md:border-2 group-hover:border-amber-400/50 transition-colors duration-300" />

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent rotate-45 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 text-lg mb-4">
            Приходите и убедитесь сами — это больше, чем просто стрижка
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-white/80">
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl">🥃 Виски-бар</span>
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl">🎮 PlayStation 5</span>
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl">📚 Библиотека</span>
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl">🎵 Джаз и винил</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
