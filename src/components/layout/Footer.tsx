"use client";

import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 pb-32 md:pb-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* О барбершопе */}
          <div>
            <h3 className="text-xl font-bold mb-4">БАРБЕРОСА</h3>
            <p className="text-gray-400 text-sm">
              Премиальный барбершоп в Екатеринбурге с 2019 года
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{siteConfig.address.street}</p>
              <p>{siteConfig.address.city}</p>
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="block hover:text-emerald-400 transition"
              >
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="block hover:text-emerald-400 transition"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          {/* Режим работы */}
          <div>
            <h4 className="font-semibold mb-4">Режим работы</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Пн-Пт: {siteConfig.schedule.weekdays}</p>
              <p>Сб-Вс: {siteConfig.schedule.weekends}</p>
              <p className="text-emerald-400">Без выходных</p>
            </div>
          </div>

          {/* Социальные сети */}
          <div>
            <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
            <div className="space-y-2 text-sm">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-emerald-400 transition"
              >
                Instagram
              </a>
              <a
                href={siteConfig.social.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-emerald-400 transition"
              >
                ВКонтакте
              </a>
              <a
                href={siteConfig.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-emerald-400 transition"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Барбершоп "Барбероса". Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-emerald-400 transition">
                Политика конфиденциальности
              </a>
              <a href="/terms" className="hover:text-emerald-400 transition">
                Условия обслуживания
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
