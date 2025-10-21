"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Phone, MessageCircle, Award, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { trackPhoneClick, trackWhatsAppClick, trackCTAClick } from "@/lib/analytics";

export default function UltimateHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (!titleRef.current) return;

    // GSAP мощная анимация заголовка
    const chars = titleRef.current.querySelectorAll(".char");

    gsap.fromTo(chars,
      {
        opacity: 0,
        y: 100,
        rotationX: -90,
        scale: 0.5,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.2,
      }
    );

    // Particle canvas
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.15;z-index:1";
    containerRef.current?.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{x: number; y: number; vx: number; vy: number; size: number; color: string}> = [];
    const colors = ["#DC2626", "#2563EB", "#FFFFFF"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  const goToBooking = () => {
    window.location.href = "/booking";
    trackCTAClick("Записаться", "hero");
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950"
    >
      {/* Animated stripes background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, transparent 0px, transparent 40px, rgba(220, 38, 38, 0.3) 40px, rgba(220, 38, 38, 0.3) 42px, transparent 42px, transparent 82px, rgba(37, 99, 235, 0.3) 82px, rgba(37, 99, 235, 0.3) 84px)",
          }}
          animate={{
            backgroundPositionY: ["0px", "200px"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Parallax shapes */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600/20 backdrop-blur-xl border-2 border-red-500/50 mb-8"
          >
            <Award className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-white">
              Лучший барбершоп Екатеринбурга 2023
            </span>
          </motion.div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none whitespace-nowrap"
            style={{ perspective: "1000px" }}
          >
            <div className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              {"БАРБЕРОСА".split("").map((char, i) => (
                <span key={i} className="char inline-block">{char}</span>
              ))}
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 md:mb-12 font-light px-4"
          >
            Мужской стиль. Премиальный сервис. Идеальный результат.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto mb-8 md:mb-12 px-4"
          >
            {[
              { icon: Scissors, value: "8", label: "Мастеров", color: "from-red-500 to-red-600" },
              { icon: Clock, value: "5 лет", label: "На рынке", color: "from-white to-gray-200" },
              { icon: Award, value: "4.9/5", label: "Рейтинг", color: "from-blue-500 to-blue-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-20 rounded-xl md:rounded-2xl blur-xl group-hover:opacity-40 transition-opacity`} />
                <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6">
                  <stat.icon className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-white" />
                  <div className={`text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-sm text-white/80 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                onClick={goToBooking}
                size="lg"
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-600/50 border-2 border-red-400/50 rounded-full font-bold"
              >
                Записаться онлайн
              </Button>
            </motion.div>

            <motion.a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              onClick={() => trackPhoneClick("hero")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-8 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border-2 border-white/50 rounded-full font-bold"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">{siteConfig.contact.phone}</span>
                <span className="sm:hidden">Позвонить</span>
              </Button>
            </motion.a>

            <motion.a
              href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("hero")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-8 bg-green-600/20 hover:bg-green-600/30 backdrop-blur-xl text-white border-2 border-green-400/50 rounded-full font-bold"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                WhatsApp
              </Button>
            </motion.a>
          </motion.div>

          {/* Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-white/60 mt-6 md:mt-8 text-xs md:text-base px-4 text-center"
          >
            <span className="hidden sm:inline">Екатеринбург, ул. Вайнера, 15 • Метро "Площадь 1905 года" 5 мин • Без выходных 09:00-22:00</span>
            <span className="sm:hidden">Екатеринбург, ул. Вайнера, 15<br/>Без выходных 09:00-22:00</span>
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-12 rounded-full border-3 border-white/50 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-white"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
