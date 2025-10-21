"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { trackPhoneClick, trackWhatsAppClick, trackTelegramClick } from "@/lib/analytics";

export default function ContactSection() {
  return (
    <section id="contacts" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Контакты</h2>
          <p className="text-xl text-gray-600">
            Мы находимся в центре Екатеринбурга
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Контактная информация */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Адрес</p>
                    <p className="text-gray-600">{siteConfig.address.full}</p>
                    <p className="text-sm text-emerald-700">
                      Метро "{siteConfig.address.metro}" ({siteConfig.address.metroDistance})
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Режим работы</p>
                    <p className="text-gray-600">
                      Пн-Пт: {siteConfig.schedule.weekdays}
                    </p>
                    <p className="text-gray-600">
                      Сб-Вс: {siteConfig.schedule.weekends}
                    </p>
                    <p className="text-sm text-emerald-700">Без выходных</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Телефон</p>
                    <a
                      href={`tel:${siteConfig.contact.phoneRaw}`}
                      onClick={() => trackPhoneClick("contacts")}
                      className="text-lg text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      {siteConfig.contact.phone}
                    </a>
                    <p className="text-sm text-gray-600">Ежедневно 09:00-22:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-emerald-700 hover:text-emerald-800"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Социальные сети */}
            <Card>
              <CardContent className="pt-6">
                <p className="font-semibold text-gray-900 mb-4">Мы в соцсетях</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("contacts")}
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a
                    href={siteConfig.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackTelegramClick("contacts")}
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Send className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      Instagram
                    </Button>
                  </a>
                  <a
                    href={siteConfig.social.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      ВКонтакте
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700">
                  <strong>Парковка:</strong> {siteConfig.parkingInfo}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Карта */}
          <Card className="h-full min-h-[500px]">
            <CardContent className="p-0 h-full">
              <iframe
                src={`https://yandex.ru/map-widget/v1/?ll=${siteConfig.address.coordinates.lng},${siteConfig.address.coordinates.lat}&z=16&l=map&pt=${siteConfig.address.coordinates.lng},${siteConfig.address.coordinates.lat},pm2rdm`}
                width="100%"
                height="100%"
                frameBorder="0"
                className="rounded-lg min-h-[500px]"
                title="Карта расположения барбершопа"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
