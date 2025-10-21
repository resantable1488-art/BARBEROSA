"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import { siteConfig, faqItems } from "@/lib/config";

export default function UltimateFAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, #DC2626 0px, #DC2626 2px, transparent 2px, transparent 10px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600/20 backdrop-blur-xl border-2 border-red-500/50 mb-6"
          >
            <HelpCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-white">Вопросы и ответы</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            Частые{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
              вопросы
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Все что нужно знать перед визитом в Барбероса
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const colorIndex = index % 3; // Cycle through colors

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="relative"
              >
                {/* FAQ Item */}
                <motion.div
                  className={`
                    relative overflow-hidden rounded-3xl border-2 transition-all duration-300
                    ${colorIndex === 0 ? "bg-gradient-to-br from-red-600/10 to-red-700/10 border-red-500/30" : ""}
                    ${colorIndex === 1 ? "bg-gradient-to-br from-blue-600/10 to-blue-700/10 border-blue-500/30" : ""}
                    ${colorIndex === 2 ? "bg-gradient-to-br from-white/5 to-gray-100/5 border-white/20" : ""}
                    ${isOpen ? "shadow-2xl" : "shadow-lg"}
                    ${isOpen && colorIndex === 0 ? "shadow-red-600/30" : ""}
                    ${isOpen && colorIndex === 1 ? "shadow-blue-600/30" : ""}
                    ${isOpen && colorIndex === 2 ? "shadow-white/20" : ""}
                  `}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-4 md:p-6 flex items-center justify-between gap-4 group"
                  >
                    <h3 className="text-base md:text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                      {item.question}
                    </h3>

                    {/* Toggle Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        flex-shrink-0 p-2 rounded-full
                        ${colorIndex === 0 ? "bg-red-600/20" : ""}
                        ${colorIndex === 1 ? "bg-blue-600/20" : ""}
                        ${colorIndex === 2 ? "bg-white/10" : ""}
                      `}
                    >
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                          <div
                            className={`
                              p-4 md:p-6 rounded-2xl
                              ${colorIndex === 0 ? "bg-red-600/10 border-2 border-red-500/20" : ""}
                              ${colorIndex === 1 ? "bg-blue-600/10 border-2 border-blue-500/20" : ""}
                              ${colorIndex === 2 ? "bg-white/5 border-2 border-white/10" : ""}
                            `}
                          >
                            <p className="text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-block p-4 md:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-2 border-white/20 mx-4">
            <p className="text-white/90 mb-4 text-base md:text-lg">
              Не нашли ответ на свой вопрос?
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors text-sm md:text-base"
              >
                Позвоните нам: {siteConfig.contact.phone}
              </a>
              <span className="hidden sm:inline text-white/40">или</span>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors text-sm md:text-base"
              >
                Напишите в WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
