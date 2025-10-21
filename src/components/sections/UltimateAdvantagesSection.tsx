"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Clock,
  Shield,
  Star,
  Users,
  Sparkles,
  TrendingUp,
  Heart,
} from "lucide-react";

const advantages = [
  {
    icon: Award,
    title: "8 мастеров",
    description: "Все наши барберы имеют международные сертификаты и регулярно проходят обучение новым техникам стрижек и укладок",
    color: "red",
    stats: "Сертифицированы",
  },
  {
    icon: Star,
    title: "Рейтинг 4.9/5",
    description: "Более 10,000 довольных клиентов оценили качество наших услуг. Мы гордимся каждым отзывом",
    color: "white",
    stats: "10,000+ отзывов",
  },
  {
    icon: Sparkles,
    title: "Премиальная косметика",
    description: "Используем только профессиональные средства от ведущих брендов: American Crew, Proraso, Depot",
    color: "blue",
    stats: "Топ бренды",
  },
  {
    icon: Clock,
    title: "Без выходных",
    description: "Работаем каждый день с 09:00 до 22:00. Онлайн-запись доступна 24/7 для вашего удобства",
    color: "red",
    stats: "7 дней в неделю",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Если результат вас не устроит — переделаем бесплатно или вернем деньги. Ваше доверие — наш приоритет",
    color: "white",
    stats: "100% гарантия",
  },
  {
    icon: Heart,
    title: "Атмосфера комфорта",
    description: "Стильный интерьер, удобные кресла, кофе и приставка — пока вы преображаетесь, мы позаботимся о вашем комфорте",
    color: "blue",
    stats: "5★ сервис",
  },
  {
    icon: Users,
    title: "Индивидуальный подход",
    description: "Консультация перед стрижкой, подбор стиля под тип лица и образ жизни. Каждый клиент уникален",
    color: "red",
    stats: "Личный барбер",
  },
  {
    icon: TrendingUp,
    title: "5 лет на рынке",
    description: "С 2019 года задаем стандарты мужского ухода в Екатеринбурге",
    color: "white",
    stats: "С 2019 года",
  },
];

export default function UltimateAdvantagesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative py-12 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #DC2626 0px, #DC2626 20px, #2563EB 20px, #2563EB 40px, #FFFFFF 40px, #FFFFFF 60px)",
          }}
        />
      </div>

      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/4 right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 12,
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
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Почему мы</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 px-4">
            Ваш выбор —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
              наша ответственность
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
            8 причин доверить свой стиль профессионалам Барбероса
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            const isRed = advantage.color === "red";
            const isBlue = advantage.color === "blue";
            const isWhite = advantage.color === "white";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  type: "spring",
                }}
                whileHover={{ scale: 1.05, rotate: 1, transition: { duration: 0.2 } }}
                className="group relative flex"
              >
                {/* Card */}
                <div
                  className={`
                    relative w-full overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col
                    ${isRed ? "bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-400/50" : ""}
                    ${isBlue ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400/50" : ""}
                    ${isWhite ? "bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300" : ""}
                    shadow-2xl
                    ${isRed ? "shadow-red-600/50" : ""}
                    ${isBlue ? "shadow-blue-600/50" : ""}
                    ${isWhite ? "shadow-white/50" : ""}
                    transition-all duration-200
                  `}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className={`
                        inline-flex p-4 rounded-2xl
                        ${isRed ? "bg-red-500/30" : ""}
                        ${isBlue ? "bg-blue-500/30" : ""}
                        ${isWhite ? "bg-slate-900" : ""}
                      `}
                    >
                      <Icon
                        className={`w-8 h-8 ${isWhite ? "text-white" : "text-white"}`}
                      />
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="mb-3">
                    <div
                      className={`
                        inline-block px-3 py-1 rounded-full text-xs font-bold
                        ${isRed ? "bg-black/20 text-white border border-red-400/30" : ""}
                        ${isBlue ? "bg-black/20 text-white border border-blue-400/30" : ""}
                        ${isWhite ? "bg-slate-900 text-white border border-gray-300" : ""}
                      `}
                    >
                      {advantage.stats}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base md:text-xl font-black mb-2 md:mb-3 ${isWhite ? "text-slate-900" : "text-white"}`}
                  >
                    {advantage.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-xs md:text-sm leading-relaxed flex-grow ${isWhite ? "text-gray-700" : "text-white/80"}`}
                  >
                    {advantage.description}
                  </p>

                  {/* Hover glow */}
                  <div
                    className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none
                      ${isRed ? "bg-gradient-to-br from-red-400/20 to-transparent" : ""}
                      ${isBlue ? "bg-gradient-to-br from-blue-400/20 to-transparent" : ""}
                      ${isWhite ? "bg-gradient-to-br from-gray-300/20 to-transparent" : ""}
                    `}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
