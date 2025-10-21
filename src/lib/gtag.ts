export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YHP1KKSYE9';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Booking events
export const trackBookingStart = () => {
  event({
    action: 'booking_start',
    category: 'engagement',
    label: 'User started booking process',
  });
};

export const trackBookingComplete = (service: string, master: string) => {
  event({
    action: 'booking_complete',
    category: 'conversion',
    label: `${service} with ${master}`,
  });

  // Ecommerce purchase event
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: 0, // Добавь реальную стоимость
      currency: 'RUB',
      items: [{
        item_id: service,
        item_name: service,
        item_category: 'barbershop_service',
        item_variant: master,
        quantity: 1,
      }]
    });
  }
};

export const trackPhoneClick = (location: string) => {
  event({
    action: 'phone_click',
    category: 'engagement',
    label: location,
  });
};

export const trackWhatsAppClick = (location: string) => {
  event({
    action: 'whatsapp_click',
    category: 'engagement',
    label: location,
  });
};

// TypeScript definitions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
