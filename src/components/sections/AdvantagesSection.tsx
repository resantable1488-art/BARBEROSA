"use client";

import { Card, CardContent } from "@/components/ui/card";
import { advantages } from "@/lib/config";
import { Scissors, Sparkles, Shield, Home, MapPin, Clock } from "lucide-react";

const iconMap = {
  scissors: Scissors,
  cosmetics: Sparkles,
  safety: Shield,
  atmosphere: Home,
  location: MapPin,
  schedule: Clock,
};

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Премиальный сервис и атмосфера винтажного барбершопа 1920-х
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = iconMap[advantage.icon as keyof typeof iconMap] || Scissors;
            return (
              <Card
                key={index}
                className="border-emerald-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">4.9/5</p>
              <p className="text-gray-600">Средняя оценка</p>
              <p className="text-sm text-gray-500">1200+ отзывов</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">5 лет</p>
              <p className="text-gray-600">На рынке</p>
              <p className="text-sm text-gray-500">Работаем с 2019 года</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">15000+</p>
              <p className="text-gray-600">Довольных клиентов</p>
              <p className="text-sm text-gray-500">И их число растет</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
