import { useEffect } from 'react';
import { visitorTracker } from '@/lib/visitor-tracking';
import { usePathname } from 'next/navigation';

export function useVisitorTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Трекинг просмотра страницы
    visitorTracker.trackPageView(pathname);
  }, [pathname]);

  return {
    trackFormStart: (formName: string) => visitorTracker.trackFormStart(formName),
    trackServiceInterest: (serviceName: string) =>
      visitorTracker.trackServiceInterest(serviceName),
    trackPhoneClick: () => visitorTracker.trackPhoneClick(),
    trackWhatsAppClick: () => visitorTracker.trackWhatsAppClick(),
    trackEvent: (eventName: string, eventData?: any) =>
      visitorTracker.trackEvent(eventName, eventData),
    getDataForBooking: () => visitorTracker.getDataForBooking(),
  };
}
