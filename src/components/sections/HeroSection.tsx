"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackCTAClick, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import BookingForm from "@/components/booking/BookingForm";

export default function HeroSection() {
  const handlePhoneClick = () => {
    trackPhoneClick("hero");
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("hero");
  };

  return (
    <section
      id="booking"
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка - Hero текст */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Премиальный барбершоп в{" "}
                <span className="text-emerald-700">Екатеринбурге</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Классические и современные стрижки, моделирование бороды,
                королевское бритье опасной бритвой
              </p>
            </div>

            {/* Преимущества кратко */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-gray-900">8 опытных мастеров</p>
                  <p className="text-sm text-gray-600">Стаж от 3 до 15 лет</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-gray-900">В центре города</p>
                  <p className="text-sm text-gray-600">5 мин от метро</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-gray-900">Без выходных</p>
                  <p className="text-sm text-gray-600">Ежедневно 09:00-22:00</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
                <div>
                  <p className="font-semibold text-gray-900">Премиум косметика</p>
                  <p className="text-sm text-gray-600">American Crew, Proraso</p>
                </div>
              </div>
            </div>

            {/* Альтернативные способы связи */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                onClick={handlePhoneClick}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {siteConfig.contact.phone}
                </Button>
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Правая колонка - Форма записи */}
          <Card className="shadow-2xl border-emerald-100">
            <CardHeader className="bg-emerald-50/50">
              <CardTitle className="text-2xl">Онлайн-запись</CardTitle>
              <CardDescription>
                Выберите услугу, мастера и удобное время — мы перезвоним для
                подтверждения
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BookingForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
