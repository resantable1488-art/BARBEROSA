// Visitor tracking system для отправки данных в amoCRM

export interface VisitorData {
  visitorId: string;
  sessionId: string;
  firstVisit: string;
  lastVisit: string;
  pageViews: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  currentPage?: string;
  timeOnSite?: number;
  userAgent?: string;
  screenResolution?: string;
  language?: string;
}

export interface PageVisit {
  url: string;
  title: string;
  timestamp: string;
  timeSpent: number;
}

class VisitorTracker {
  private readonly VISITOR_ID_KEY = 'barberosa_visitor_id';
  private readonly SESSION_ID_KEY = 'barberosa_session_id';
  private readonly VISITOR_DATA_KEY = 'barberosa_visitor_data';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 минут

  // Генерация уникального ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Получение или создание visitor ID
  getVisitorId(): string {
    if (typeof window === 'undefined') return '';

    let visitorId = localStorage.getItem(this.VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = this.generateId();
      localStorage.setItem(this.VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  }

  // Получение или создание session ID
  getSessionId(): string {
    if (typeof window === 'undefined') return '';

    const now = Date.now();
    let sessionId = sessionStorage.getItem(this.SESSION_ID_KEY);
    const lastActivity = sessionStorage.getItem('last_activity');

    // Проверка таймаута сессии
    if (sessionId && lastActivity) {
      const timeSinceLastActivity = now - parseInt(lastActivity);
      if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
        sessionId = null;
      }
    }

    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem(this.SESSION_ID_KEY, sessionId);
    }

    sessionStorage.setItem('last_activity', now.toString());
    return sessionId;
  }

  // Получение UTM параметров из URL
  getUTMParameters(): {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  } {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    const utm: any = {};

    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach((param) => {
      const value = params.get(param);
      if (value) {
        const key = param.replace('utm_', 'utm');
        utm[key] = value;
      }
    });

    // Сохранить UTM параметры в localStorage (first-touch attribution)
    if (Object.keys(utm).length > 0) {
      const savedUTM = localStorage.getItem('barberosa_utm');
      if (!savedUTM) {
        localStorage.setItem('barberosa_utm', JSON.stringify(utm));
      }
    }

    return utm;
  }

  // Получение сохраненных UTM параметров
  getSavedUTMParameters(): any {
    if (typeof window === 'undefined') return {};

    const savedUTM = localStorage.getItem('barberosa_utm');
    return savedUTM ? JSON.parse(savedUTM) : {};
  }

  // Получение данных о посетителе
  getVisitorData(): VisitorData {
    if (typeof window === 'undefined') {
      return {
        visitorId: '',
        sessionId: '',
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        pageViews: 0,
      };
    }

    const visitorId = this.getVisitorId();
    const sessionId = this.getSessionId();
    const utm = this.getSavedUTMParameters();

    let data = localStorage.getItem(this.VISITOR_DATA_KEY);
    let visitorData: VisitorData;

    if (data) {
      visitorData = JSON.parse(data);
      visitorData.lastVisit = new Date().toISOString();
      visitorData.pageViews += 1;
      visitorData.sessionId = sessionId;
    } else {
      visitorData = {
        visitorId,
        sessionId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        pageViews: 1,
        ...utm,
        referrer: document.referrer || 'direct',
        landingPage: window.location.pathname,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
      };
    }

    visitorData.currentPage = window.location.pathname;
    localStorage.setItem(this.VISITOR_DATA_KEY, JSON.stringify(visitorData));

    return visitorData;
  }

  // Трекинг просмотра страницы
  trackPageView(pagePath?: string) {
    if (typeof window === 'undefined') return;

    const visitorData = this.getVisitorData();
    const utm = this.getUTMParameters();

    // Отправка данных на сервер
    this.sendToServer({
      event: 'page_view',
      visitorData: {
        ...visitorData,
        ...utm,
      },
      page: {
        url: pagePath || window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Трекинг события
  trackEvent(eventName: string, eventData?: any) {
    if (typeof window === 'undefined') return;

    const visitorData = this.getVisitorData();

    this.sendToServer({
      event: eventName,
      visitorData,
      eventData,
      timestamp: new Date().toISOString(),
    });
  }

  // Трекинг начала заполнения формы
  trackFormStart(formName: string) {
    this.trackEvent('form_start', { formName });
  }

  // Трекинг интереса к услуге
  trackServiceInterest(serviceName: string) {
    this.trackEvent('service_interest', { serviceName });
  }

  // Трекинг клика по телефону
  trackPhoneClick() {
    this.trackEvent('phone_click', { method: 'website' });
  }

  // Трекинг клика по WhatsApp
  trackWhatsAppClick() {
    this.trackEvent('whatsapp_click', { method: 'website' });
  }

  // Отправка данных на сервер
  private async sendToServer(data: any) {
    try {
      await fetch('/api/visitor-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Visitor tracking error:', error);
    }
  }

  // Получение всех данных для отправки в amoCRM при бронировании
  getDataForBooking() {
    if (typeof window === 'undefined') return {};

    const visitorData = this.getVisitorData();
    const utm = this.getSavedUTMParameters();

    return {
      visitorId: visitorData.visitorId,
      sessionId: visitorData.sessionId,
      firstVisit: visitorData.firstVisit,
      pageViews: visitorData.pageViews,
      utm,
      referrer: visitorData.referrer,
      landingPage: visitorData.landingPage,
    };
  }
}

export const visitorTracker = new VisitorTracker();
