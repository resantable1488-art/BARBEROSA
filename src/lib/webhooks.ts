// Интеграция с n8n webhooks

import { siteConfig } from "./config";

export interface BookingData {
  // Данные клиента
  name: string;
  phone: string;
  email?: string;

  // Детали записи
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  master: {
    id: string;
    name: string;
  };
  date: string;
  time: string;

  // Дополнительно
  comment?: string;
  source: string; // откуда пришел клиент
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };

  // Мета
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  bookingId?: string;
  error?: string;
}

// Отправка записи в n8n
export const sendBookingToN8N = async (
  data: BookingData,
  isTest: boolean = false
): Promise<WebhookResponse> => {
  try {
    const webhookUrl = isTest
      ? siteConfig.webhooks.n8nTest
      : siteConfig.webhooks.n8nProduction;

    console.log(`[n8n] Sending booking to ${isTest ? "TEST" : "PROD"}:`, data);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "new_booking",
        data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log("[n8n] Response:", result);

    return {
      success: true,
      message: "Запись успешно отправлена",
      bookingId: result.bookingId || result.id,
    };
  } catch (error) {
    console.error("[n8n] Error sending booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
};

// Отправка клика по телефону
export const sendPhoneClickToN8N = async (location: string) => {
  try {
    const webhookUrl = siteConfig.webhooks.n8nProduction;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "phone_click",
        data: {
          location,
          phone: siteConfig.contact.phone,
          timestamp: new Date().toISOString(),
          utm: getUTMParams(),
        },
      }),
    });
  } catch (error) {
    console.error("[n8n] Error sending phone click:", error);
  }
};

// Отправка клика по WhatsApp
export const sendWhatsAppClickToN8N = async (location: string) => {
  try {
    const webhookUrl = siteConfig.webhooks.n8nProduction;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "whatsapp_click",
        data: {
          location,
          whatsapp: siteConfig.contact.whatsapp,
          timestamp: new Date().toISOString(),
          utm: getUTMParams(),
        },
      }),
    });
  } catch (error) {
    console.error("[n8n] Error sending WhatsApp click:", error);
  }
};

// Отправка ошибки формы
export const sendFormErrorToN8N = async (
  formName: string,
  errorField: string,
  errorMessage: string,
  formData: any
) => {
  try {
    const webhookUrl = siteConfig.webhooks.n8nProduction;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "form_error",
        data: {
          formName,
          errorField,
          errorMessage,
          formData,
          timestamp: new Date().toISOString(),
          utm: getUTMParams(),
          url: typeof window !== "undefined" ? window.location.href : "",
        },
      }),
    });
  } catch (error) {
    console.error("[n8n] Error sending form error:", error);
  }
};

// Отправка брошенной формы
export const sendFormAbandonToN8N = async (
  formName: string,
  step: number,
  partialData: any
) => {
  try {
    const webhookUrl = siteConfig.webhooks.n8nProduction;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "form_abandon",
        data: {
          formName,
          step,
          partialData,
          timestamp: new Date().toISOString(),
          utm: getUTMParams(),
          url: typeof window !== "undefined" ? window.location.href : "",
        },
      }),
    });
  } catch (error) {
    console.error("[n8n] Error sending form abandon:", error);
  }
};

// Получение UTM параметров из URL
const getUTMParams = () => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    term: params.get("utm_term") || undefined,
    content: params.get("utm_content") || undefined,
  };
};

// Получение IP и User Agent (для серверной стороны)
export const getClientInfo = (request?: Request) => {
  return {
    ip:
      request?.headers.get("x-forwarded-for") ||
      request?.headers.get("x-real-ip") ||
      "unknown",
    userAgent: request?.headers.get("user-agent") || "unknown",
  };
};
