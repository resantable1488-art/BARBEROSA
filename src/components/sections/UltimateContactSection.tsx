"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Clock, Mail, MessageCircle, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export default function UltimateContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const contactInfo = [
    {
      icon: MapPin,
      title: "Адрес",
      value: siteConfig.contact.address,
      subtitle: "Метро «Площадь 1905 года» — 5 минут пешком",
      color: "red",
      link: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address)}`,
    },
    {
      icon: Phone,
      title: "Телефон",
      value: siteConfig.contact.phone,
      subtitle: "Звоните с 09:00 до 22:00",
      color: "white",
      link: `tel:${siteConfig.contact.phoneRaw}`,
      onClick: () => trackPhoneClick("contact"),
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Онлайн-запись 24/7",
      subtitle: "Ответим в течение 5 минут",
      color: "blue",
      link: `https://wa.me/${siteConfig.contact.whatsappRaw}`,
      onClick: () => trackWhatsAppClick("contact"),
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #DC2626 0px, #DC2626 20px, #2563EB 20px, #2563EB 40px, #FFFFFF 40px, #FFFFFF 60px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.2, 0.3],
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600/20 via-white/20 to-blue-600/20 backdrop-blur-xl border-2 border-white/30 mb-6"
          >
            <Navigation className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Контакты</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            Как нас{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
              найти
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Мы находимся в самом центре Екатеринбурга — удобно добраться из любой точки города
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const isRed = info.color === "red";
            const isBlue = info.color === "blue";
            const isWhite = info.color === "white";

            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative h-full"
              >
                <div
                  className={`
                    relative h-full overflow-hidden rounded-3xl p-4 md:p-8 text-center
                    ${isRed ? "bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-400/50 shadow-2xl shadow-red-600/50" : ""}
                    ${isBlue ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400/50 shadow-2xl shadow-blue-600/50" : ""}
                    ${isWhite ? "bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 shadow-2xl shadow-white/50" : ""}
                    transition-all duration-300
                  `}
                >
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`
                        inline-flex p-5 rounded-2xl
                        ${isRed ? "bg-red-500/30" : ""}
                        ${isBlue ? "bg-blue-500/30" : ""}
                        ${isWhite ? "bg-slate-900" : ""}
                      `}
                    >
                      <Icon
                        className={`w-8 md:w-10 h-8 md:h-10 ${isWhite ? "text-white" : "text-white"}`}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xs md:text-sm font-bold mb-2 md:mb-3 uppercase tracking-wider ${isWhite ? "text-gray-600" : "text-white/70"}`}
                  >
                    {info.title}
                  </h3>

                  {/* Value */}
                  <p
                    className={`text-base md:text-xl font-black mb-2 ${isWhite ? "text-slate-900" : "text-white"}`}
                  >
                    {info.value}
                  </p>

                  {/* Subtitle */}
                  <p
                    className={`text-xs md:text-sm ${isWhite ? "text-gray-600" : "text-white/70"}`}
                  >
                    {info.subtitle}
                  </p>

                  {/* Hover glow */}
                  <div
                    className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none
                      ${isRed ? "bg-gradient-to-br from-red-400/20 to-transparent" : ""}
                      ${isBlue ? "bg-gradient-to-br from-blue-400/20 to-transparent" : ""}
                      ${isWhite ? "bg-gradient-to-br from-gray-300/20 to-transparent" : ""}
                    `}
                  />
                </div>
              </motion.div>
            );

            if (info.link) {
              return (
                <a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={info.onClick}
                  className="block"
                >
                  {CardContent}
                </a>
              );
            }

            return <div key={index}>{CardContent}</div>;
          })}
        </div>

        {/* Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
            <div className="aspect-[21/9] bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2180.4!2d60.6!3d56.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDQ4JzAwLjAiTiA2MMKwMzYnMDAuMCJF!5e0!3m2!1sru!2sru!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4"
        >
          <motion.a
            href={`tel:${siteConfig.contact.phoneRaw}`}
            onClick={() => trackPhoneClick("contact-cta")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-600/50 border-2 border-red-400/50 rounded-full font-bold"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Позвонить сейчас
            </Button>
          </motion.a>

          <motion.a
            href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("contact-cta")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-green-600/20 hover:bg-green-600/30 backdrop-blur-xl text-white border-2 border-green-400/50 rounded-full font-bold"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Написать в WhatsApp
            </Button>
          </motion.a>

          <motion.a
            href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-xl text-white border-2 border-blue-400/50 rounded-full font-bold"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Построить маршрут
            </Button>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
