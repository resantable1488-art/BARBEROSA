"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-600/50">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-6xl font-black text-white text-center mb-6"
        >
          Спасибо за запись!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-white/80 text-center mb-12"
        >
          Ваша запись успешно создана
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8 backdrop-blur-xl"
        >
          <div className="space-y-4 text-white/80">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p>Мы отправили подтверждение на указанный номер телефона</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p>Наш администратор свяжется с вами для уточнения деталей</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p>Вы можете отменить или перенести запись за 24 часа без штрафа</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <a href={`tel:${siteConfig.contact.phoneRaw}`} className="flex-1">
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border-white/30 rounded-xl font-bold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить нам
            </Button>
          </a>

          <a
            href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-2 border-green-400/50 rounded-xl font-bold shadow-lg shadow-green-600/30"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Написать в WhatsApp
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-white/60 mb-4">
            Перенаправление на главную через {countdown} сек...
          </p>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Вернуться на главную сейчас
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
