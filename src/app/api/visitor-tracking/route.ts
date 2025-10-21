import { NextRequest, NextResponse } from 'next/server';
import { amoCRM } from '@/lib/amocrm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, visitorData, page, eventData } = body;

    // Логирование для отладки
    console.log('Visitor tracking event:', event, visitorData);

    // Отправка в amoCRM только для важных событий
    const importantEvents = [
      'form_start',
      'service_interest',
      'phone_click',
      'whatsapp_click',
    ];

    if (importantEvents.includes(event)) {
      try {
        // Создание "холодного лида" в amoCRM
        const leadName = generateLeadName(event, eventData);
        const leadNote = generateLeadNote(event, visitorData, eventData);

        // Поиск существующего контакта по visitor ID через примечания
        // Если не найден - создаем анонимного
        const contactName = `Посетитель ${visitorData.visitorId.substring(0, 8)}`;

        // Создание анонимного контакта (без телефона/email)
        const contactId = await amoCRM.createContact({
          name: contactName,
          phone: '',
          custom_fields_values: [
            {
              field_id: 0, // ID поля "Visitor ID" в amoCRM (нужно заменить)
              values: [{ value: visitorData.visitorId }],
            },
          ],
        });

        if (contactId) {
          // Создание лида
          const leadId = await amoCRM.createLead(
            {
              name: leadName,
              price: 0,
              custom_fields_values: [
                {
                  field_id: 0, // ID поля "UTM Source"
                  values: [{ value: visitorData.utmSource || 'direct' }],
                },
                {
                  field_id: 0, // ID поля "Referrer"
                  values: [{ value: visitorData.referrer || 'direct' }],
                },
              ],
            },
            contactId
          );

          // Добавление примечания с деталями
          if (leadId) {
            await amoCRM.addNote(leadId, 'leads', leadNote);
          }

          console.log('amoCRM lead created:', { contactId, leadId });
        }
      } catch (amoCRMError) {
        console.error('amoCRM visitor tracking error:', amoCRMError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked',
    });
  } catch (error) {
    console.error('Visitor tracking API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Tracking error',
      },
      { status: 500 }
    );
  }
}

function generateLeadName(event: string, eventData?: any): string {
  switch (event) {
    case 'form_start':
      return `Заполнение формы: ${eventData?.formName || 'Запись'}`;
    case 'service_interest':
      return `Интерес к услуге: ${eventData?.serviceName || 'Неизвестно'}`;
    case 'phone_click':
      return 'Клик по телефону';
    case 'whatsapp_click':
      return 'Клик по WhatsApp';
    default:
      return 'Взаимодействие с сайтом';
  }
}

function generateLeadNote(
  event: string,
  visitorData: any,
  eventData?: any
): string {
  const utm = visitorData.utmSource
    ? `
📊 UTM параметры:
- Source: ${visitorData.utmSource || '-'}
- Medium: ${visitorData.utmMedium || '-'}
- Campaign: ${visitorData.utmCampaign || '-'}
- Term: ${visitorData.utmTerm || '-'}
- Content: ${visitorData.utmContent || '-'}`
    : '';

  return `
🌐 Событие: ${event}

👤 Visitor ID: ${visitorData.visitorId}
📅 Первый визит: ${new Date(visitorData.firstVisit).toLocaleString('ru-RU')}
📈 Просмотров страниц: ${visitorData.pageViews}
🔗 Referrer: ${visitorData.referrer || 'direct'}
📍 Landing Page: ${visitorData.landingPage || '-'}
📍 Текущая страница: ${visitorData.currentPage || '-'}
${utm}

💻 Браузер: ${visitorData.userAgent || '-'}
🖥️ Разрешение экрана: ${visitorData.screenResolution || '-'}
🌍 Язык: ${visitorData.language || '-'}

${eventData ? `\n📝 Дополнительно: ${JSON.stringify(eventData, null, 2)}` : ''}
`;
}
