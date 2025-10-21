"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/lib/config";
import { Clock } from "lucide-react";
import { trackServicesView } from "@/lib/analytics";
import { useEffect } from "react";

export default function ServicesSection() {
  const categories = ["Все", "Стрижки", "Борода", "Комплексы", "Окрашивание"];

  useEffect(() => {
    trackServicesView();
  }, []);

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Услуги и цены
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Профессиональный груминг с использованием премиальной косметики.
            Цена зависит от уровня мастера.
          </p>
        </div>

        <Tabs defaultValue="Все" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter((s) => category === "Все" || s.category === category)
                  .map((service) => (
                    <Card
                      key={service.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
                          {service.badge && (
                            <Badge variant="secondary">{service.badge}</Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {service.duration}
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-2xl font-bold text-emerald-700">
                                {service.priceFrom}
                              </span>
                              {service.priceTo && service.priceTo !== service.priceFrom && (
                                <span className="text-2xl font-bold text-emerald-700">
                                  -{service.priceTo}
                                </span>
                              )}
                              <span className="text-lg text-gray-600 ml-1">₽</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={scrollToBooking}
                            >
                              Выбрать
                            </Button>
                          </div>
                          {service.priceNote && (
                            <p className="text-xs text-gray-500">{service.priceNote}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            В стоимость входит: консультация, мытье головы, массаж, укладка, чай/кофе/виски
          </p>
          <Button onClick={scrollToBooking} size="lg" className="bg-emerald-700 hover:bg-emerald-800">
            Записаться онлайн
          </Button>
        </div>
      </div>
    </section>
  );
}
