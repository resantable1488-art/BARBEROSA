# 🪒 Барбершоп "Барбероса" — Landing Page

Премиальный высококонверсионный лендинг для барбершопа в Екатеринбурге.

## 🎯 Основные возможности

### ✅ Реализовано

- **Hero-секция** с формой онлайн-записи
- **Услуги и цены** с фильтрацией по категориям
- **Наши мастера** с портфолио и специализациями
- **Преимущества** и атмосфера барбершопа
- **Отзывы и награды** с рейтингами
- **FAQ** с аккордеоном вопросов
- **Контакты** с интерактивной картой
- **Google Analytics 4** — полная интеграция (G-YHP1KKSYE9)
- **n8n Webhooks** — автоматическая отправка заявок
- **Cookie Banner** — соответствие GDPR/РФ
- **Быстрые действия** — плавающие кнопки
- **Адаптивный дизайн** — все устройства
- **Премиальная палитра** — хвойно-зелёная

## 🚀 Запуск проекта

```bash
cd my-nextjs-app
npm install
npm run dev
```

Откройте http://localhost:3000

## ⚙️ Конфигурация

Все настройки в `src/lib/config.ts`:

- GA4: G-YHP1KKSYE9
- n8n Production: https://n8n.autopine.ru/webhook/d160150a-7119-4aa3-9375-9a2de5197026
- n8n Test: https://n8n.autopine.ru/webhook-test/d160150a-7119-4aa3-9375-9a2de5197026

## 📊 GA4 События

- `page_view`, `view_item_list`, `select_item`
- `begin_checkout`, `timeslot_select`
- `appointment_booked`, `generate_lead`
- `phone_click`, `whatsapp_click`, `telegram_click`
- `cta_click`, `form_error`, `form_abandon`

## 📁 Структура

```
src/
├── app/
│   ├── api/booking/        # API endpoint
│   ├── layout.tsx          # Root + GA4
│   └── page.tsx            # Главная
├── components/
│   ├── booking/BookingForm.tsx
│   ├── sections/           # Все секции
│   ├── layout/             # Header, Footer
│   ├── ui/                 # shadcn компоненты
│   ├── CookieBanner.tsx
│   └── QuickActions.tsx
└── lib/
    ├── config.ts           # ВСЯ КОНФИГУРАЦИЯ ЗДЕСЬ
    ├── analytics.ts        # GA4
    └── webhooks.ts         # n8n
```

## 🎨 Компоненты

Используется **shadcn/ui**: Button, Card, Input, Calendar, Select, Accordion, Tabs, Badge, Avatar, Dialog, Checkbox, Sonner

## 📱 UX Воронка записи

1. Выбор услуги
2. Выбор мастера (или авто)
3. Дата + время
4. Контакты (имя, телефон)
5. Комментарий (опц.)
6. Отправка

**Альтернативы на каждом шаге:**
- Звонок: +7 (343) 555-77-88
- WhatsApp: +7 (912) 345-67-89

## ✏️ Как изменить контент

**Открыть `src/lib/config.ts`** и отредактировать:

```typescript
// Контакты
contact: {
  phone: "+7 (343) 555-77-88",
  whatsapp: "+7 (912) 345-67-89",
  // ...
},

// Услуги
services: [
  {
    id: "haircut-machine",
    name: "Стрижка машинкой",
    priceFrom: 800,
    priceTo: 1200,
    // ...
  },
],

// Мастера
masters: [
  {
    id: "alexey-gromov",
    name: "Алексей Громов",
    // ...
  },
],
```

## 🐛 Отладка

### GA4
- Консоль: `[GA4] event_name`
- GA4 DebugView в реальном времени
- Проверьте cookie-consent

### n8n
- Консоль: `[n8n] Sending booking`
- Проверьте URL вебхука
- Используйте test-endpoint

### Форма
- F12 → Console
- Network tab → API запросы
- Проверьте валидацию полей

## 📞 Контакты барбершопа

- Адрес: г. Екатеринбург, ул. Вайнера, 15
- Телефон: +7 (343) 555-77-88
- WhatsApp: +7 (912) 345-67-89
- Email: info@barbarosa-ekb.ru

## 📋 Чек-лист запуска

- [x] Hero-форма работает
- [x] CTA (телефон, WhatsApp) везде
- [x] Услуги/цены из FAQ
- [x] Cookie-баннер
- [x] GA4 DebugView
- [x] n8n webhooks
- [x] Адаптивность
- [x] SEO метатеги

## 🚢 Деплой

```bash
npm run build
npm start
```

Или используйте Vercel/Netlify для автодеплоя.

---

**🤖 Создано с Claude Code**

Проект готов к запуску! Все данные из FAQ интегрированы.
