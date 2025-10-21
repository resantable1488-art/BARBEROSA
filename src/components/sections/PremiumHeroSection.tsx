"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";
import { Phone, MessageCircle, Sparkles, Award, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, services } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import PremiumBookingForm from "@/components/booking/PremiumBookingForm";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";

export default function PremiumHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentService, setCurrentService] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const popularServices = services.filter(s => s.popular).slice(0, 3);

  useEffect(() => {
    if (!titleRef.current) return;

    // GSAP анимация заголовка
    const letters = titleRef.current.textContent?.split("") || [];
    titleRef.current.innerHTML = letters
      .map((letter, i) => `<span class="inline-block" data-char="${i}">${letter === " " ? "&nbsp;" : letter}</span>`)
      .join("");

    gsap.fromTo(
      titleRef.current.children,
      {
        opacity: 0,
        y: 50,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.3,
      }
    );

    // Particle эффект
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = "0.3";
    containerRef.current?.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(16, 185, 129, 0.5)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.remove();
    };
  }, []);

  // Ротация услуг
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % popularServices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [popularServices.length]);

  return (
    <section
      id="booking"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900"
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-violet-500/20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-200">
                Лучший барбершоп Екатеринбурга 2023
              </span>
            </motion.div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{ perspective: "1000px" }}
            >
              Премиальный барбершоп
            </h1>

            {/* Rotating service highlight */}
            <div className="h-20 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <p className="text-2xl text-emerald-300 font-semibold">
                    {popularServices[currentService]?.name}
                  </p>
                  <p className="text-emerald-200/80">
                    от {popularServices[currentService]?.priceFrom}₽ •{" "}
                    {popularServices[currentService]?.duration}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Award, label: "5 лет", sub: "на рынке" },
                { icon: Clock, label: "09:00-22:00", sub: "без выходных" },
                { icon: MapPin, label: "Центр", sub: "5 мин от метро" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    delay: 0.8 + i * 0.1,
                    duration: 0.6,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <p className="text-lg font-bold text-white">{stat.label}</p>
                  <p className="text-sm text-emerald-200/60">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                onClick={() => trackPhoneClick("hero")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/50 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {siteConfig.contact.phone}
                </Button>
              </motion.a>

              <motion.a
                href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("hero")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/20 backdrop-blur-md"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Premium Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ perspective: "2000px" }}
          >
            <LiquidGlassCard className="p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Онлайн-запись
                </h2>
                <p className="text-emerald-200/80">
                  Заполните форму — перезвоним через 15 минут
                </p>
              </div>
              <PremiumBookingForm />
            </LiquidGlassCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-emerald-400/50 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
