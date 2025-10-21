// Google Analytics 4 и отслеживание событий

import { siteConfig } from "./config";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Типы событий GA4
export type GAEvent =
  | "page_view"
  | "view_item_list"
  | "select_item"
  | "begin_checkout"
  | "generate_lead"
  | "add_payment_info"
  | "purchase"
  | "cta_click"
  | "form_error"
  | "form_abandon"
  | "timeslot_select"
  | "appointment_booked"
  | "phone_click"
  | "whatsapp_click"
  | "telegram_click";

export interface GAEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  service_name?: string;
  service_id?: string;
  master_id?: string;
  master_name?: string;
  date?: string;
  time?: string;
  duration?: number;
  price?: number;
  step?: number;
  error_message?: string;
  cta_location?: string;
  cta_text?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent_state?: string;
  device?: string;
  [key: string]: any;
}

// Инициализация GA4
export const initGA = () => {
  if (typeof window === "undefined") return;

  // Создаем dataLayer если его нет
  window.dataLayer = window.dataLayer || [];

  // Функция gtag
  function gtag(...args: any[]) {
    window.dataLayer?.push(arguments);
  }

  window.gtag = gtag as any;

  // Инициализация
  gtag("js", new Date());
  gtag("config", siteConfig.analytics.ga4MeasurementId, {
    send_page_view: false, // Отправляем вручную с параметрами
  });

  // Загружаем скрипт GA4
  if (!document.querySelector(`script[src*="googletagmanager"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.ga4MeasurementId}`;
    document.head.appendChild(script);
  }
};

// Отправка события в GA4
export const trackEvent = (
  eventName: GAEvent,
  params: GAEventParams = {}
) => {
  if (typeof window === "undefined" || !window.gtag) return;

  // Добавляем UTM параметры из URL
  const urlParams = new URLSearchParams(window.location.search);
  const enrichedParams = {
    ...params,
    utm_source: urlParams.get("utm_source") || params.utm_source,
    utm_medium: urlParams.get("utm_medium") || params.utm_medium,
    utm_campaign: urlParams.get("utm_campaign") || params.utm_campaign,
    device: /Mobile|Android|iPhone/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop",
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  console.log(`[GA4] ${eventName}`, enrichedParams);

  window.gtag("event", eventName, enrichedParams);
};

// Просмотр страницы
export const trackPageView = (path?: string) => {
  const pagePath = path || window.location.pathname;
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: document.title,
  });
};

// Клик по CTA
export const trackCTAClick = (
  ctaText: string,
  ctaLocation: string,
  destination?: string
) => {
  trackEvent("cta_click", {
    event_category: "engagement",
    event_label: ctaText,
    cta_text: ctaText,
    cta_location: ctaLocation,
    value: destination,
  });
};

// Начало заполнения формы
export const trackFormStart = (formName: string, step: number = 1) => {
  trackEvent("begin_checkout", {
    event_category: "booking",
    event_label: formName,
    step,
  });
};

// Ошибка в форме
export const trackFormError = (
  formName: string,
  errorField: string,
  errorMessage: string
) => {
  trackEvent("form_error", {
    event_category: "booking",
    event_label: formName,
    error_message: `${errorField}: ${errorMessage}`,
  });
};

// Выбор услуги
export const trackServiceSelect = (
  serviceId: string,
  serviceName: string,
  price: number
) => {
  trackEvent("select_item", {
    event_category: "booking",
    event_label: serviceName,
    service_id: serviceId,
    service_name: serviceName,
    price,
    value: price,
  });
};

// Выбор мастера
export const trackMasterSelect = (masterId: string, masterName: string) => {
  trackEvent("select_item", {
    event_category: "booking",
    event_label: masterName,
    master_id: masterId,
    master_name: masterName,
  });
};

// Выбор времени
export const trackTimeslotSelect = (date: string, time: string) => {
  trackEvent("timeslot_select", {
    event_category: "booking",
    date,
    time,
  });
};

// Завершение записи
export const trackAppointmentBooked = (
  serviceId: string,
  serviceName: string,
  masterId: string,
  masterName: string,
  date: string,
  time: string,
  price: number,
  duration: number
) => {
  trackEvent("appointment_booked", {
    event_category: "conversion",
    event_label: `${serviceName} - ${masterName}`,
    service_id: serviceId,
    service_name: serviceName,
    master_id: masterId,
    master_name: masterName,
    date,
    time,
    price,
    duration,
    value: price,
  });

  // Дублируем как generate_lead
  trackEvent("generate_lead", {
    event_category: "conversion",
    event_label: serviceName,
    value: price,
  });
};

// Клик по телефону
export const trackPhoneClick = (location: string) => {
  trackEvent("phone_click", {
    event_category: "contact",
    event_label: "Phone call",
    cta_location: location,
  });
  trackEvent("generate_lead", {
    event_category: "conversion",
    event_label: "Phone",
    value: 0,
  });
};

// Клик по WhatsApp
export const trackWhatsAppClick = (location: string) => {
  trackEvent("whatsapp_click", {
    event_category: "contact",
    event_label: "WhatsApp",
    cta_location: location,
  });
  trackEvent("generate_lead", {
    event_category: "conversion",
    event_label: "WhatsApp",
    value: 0,
  });
};

// Клик по Telegram
export const trackTelegramClick = (location: string) => {
  trackEvent("telegram_click", {
    event_category: "contact",
    event_label: "Telegram",
    cta_location: location,
  });
};

// Просмотр списка услуг
export const trackServicesView = (category?: string) => {
  trackEvent("view_item_list", {
    event_category: "engagement",
    event_label: category || "All services",
    item_list_name: category || "Все услуги",
  });
};

// Cookie consent
export const updateConsentMode = (
  analytics: boolean,
  marketing: boolean
) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });

  console.log("[GA4] Consent updated:", { analytics, marketing });
};

// Инициализация consent mode (по умолчанию всё denied)
export const initConsentMode = () => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  console.log("[GA4] Consent mode initialized (default: denied)");
};
