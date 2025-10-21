// amoCRM API Client для Барбероса

const AMOCRM_DOMAIN = process.env.AMOCRM_DOMAIN; // например: yourcompany.amocrm.ru
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN;
const AMOCRM_PIPELINE_ID = parseInt(process.env.AMOCRM_PIPELINE_ID || '1', 10); // ID воронки

export interface AmoCRMContact {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{ value: string }>;
  }>;
}

export interface AmoCRMLead {
  id?: number;
  name: string;
  price: number;
  pipeline_id?: number;
  status_id?: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{ value: string }>;
  }>;
}

export interface AmoCRMTask {
  task_type_id: number; // 1 = Звонок, 2 = Встреча
  text: string;
  complete_till: number; // Unix timestamp
  entity_id: number; // ID сделки
  entity_type: 'leads' | 'contacts';
}

class AmoCRMClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    if (!AMOCRM_DOMAIN || !AMOCRM_ACCESS_TOKEN) {
      console.warn('amoCRM credentials not configured');
    }

    this.baseURL = `https://${AMOCRM_DOMAIN}/api/v4`;
    this.headers = {
      'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  // Поиск контакта по телефону
  async findContactByPhone(phone: string): Promise<AmoCRMContact | null> {
    try {
      const cleanPhone = phone.replace(/[^\d]/g, '');
      const response = await fetch(
        `${this.baseURL}/contacts?query=${cleanPhone}`,
        { headers: this.headers }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data._embedded?.contacts?.[0] || null;
    } catch (error) {
      console.error('amoCRM findContactByPhone error:', error);
      return null;
    }
  }

  // Создание контакта
  async createContact(contact: AmoCRMContact): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseURL}/contacts`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify([
          {
            name: contact.name,
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [{ value: contact.phone, enum_code: 'WORK' }],
              },
              ...(contact.email
                ? [
                    {
                      field_code: 'EMAIL',
                      values: [{ value: contact.email, enum_code: 'WORK' }],
                    },
                  ]
                : []),
            ],
          },
        ]),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('amoCRM createContact error:', error);
        return null;
      }

      const data = await response.json();
      return data._embedded?.contacts?.[0]?.id || null;
    } catch (error) {
      console.error('amoCRM createContact error:', error);
      return null;
    }
  }

  // Создание сделки (лида)
  async createLead(
    lead: AmoCRMLead,
    contactId: number
  ): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseURL}/leads`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify([
          {
            name: lead.name,
            price: lead.price,
            pipeline_id: lead.pipeline_id || AMOCRM_PIPELINE_ID,
            _embedded: {
              contacts: [{ id: contactId }],
            },
            custom_fields_values: lead.custom_fields_values || [],
          },
        ]),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ amoCRM createLead error:', response.status, error);
        return null;
      }

      const data = await response.json();
      const leadId = data._embedded?.leads?.[0]?.id || null;
      if (leadId) {
        console.log('✅ Lead created successfully:', leadId);
      }
      return leadId;
    } catch (error) {
      console.error('amoCRM createLead error:', error);
      return null;
    }
  }

  // Создание задачи
  async createTask(task: AmoCRMTask): Promise<number | null> {
    try {
      console.log('Creating task with data:', task);

      const response = await fetch(`${this.baseURL}/tasks`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify([task]),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ amoCRM createTask error:', response.status, error);
        return null;
      }

      const data = await response.json();
      const taskId = data._embedded?.tasks?.[0]?.id || null;

      if (taskId) {
        console.log('✅ Task created with ID:', taskId);
      } else {
        console.error('❌ Task creation response missing ID:', data);
      }

      return taskId;
    } catch (error) {
      console.error('❌ amoCRM createTask exception:', error);
      return null;
    }
  }

  // Обновление сделки
  async updateLead(leadId: number, data: Partial<AmoCRMLead>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/leads/${leadId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error('amoCRM updateLead error:', error);
      return false;
    }
  }

  // Добавление примечания к сделке
  async addNote(
    entityId: number,
    entityType: 'leads' | 'contacts',
    text: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/${entityType}/${entityId}/notes`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify([
          {
            note_type: 'common',
            params: { text },
          },
        ]),
      });

      return response.ok;
    } catch (error) {
      console.error('amoCRM addNote error:', error);
      return false;
    }
  }

  // Получение цены услуги по названию
  private getServicePrice(serviceName: string): number {
    const prices: Record<string, number> = {
      'Стрижка машинкой': 1000,
      'Стрижка ножницами': 1500,
      'Модельная стрижка': 1800,
      'Детская стрижка (до 12 лет)': 800,
      'Стрижка для школьников (12-16 лет)': 1000,
      'Моделирование бороды': 800,
      'Бритье опасной бритвой': 1200,
      'Камуфляж седины': 600,
      'Комплекс (стрижка + борода)': 2000,
      'Укладка': 500,
      'Пилинг кожи головы': 1500,
      'SPA уход за волосами': 2000,
    };
    return prices[serviceName] || 1500;
  }

  // Полный процесс создания записи клиента
  async processBooking(booking: {
    name: string;
    phone: string;
    email?: string;
    service: string;
    master: string;
    date: string;
    time: string;
    price?: number;
    source?: string;
    utm?: Record<string, string>;
  }): Promise<{ contactId: number | null; leadId: number | null }> {
    try {
      // 1. Поиск существующего контакта
      let contact = await this.findContactByPhone(booking.phone);
      let contactId: number | null = null;

      if (contact) {
        contactId = contact.id!;
        console.log('Found existing contact:', contactId);
      } else {
        // 2. Создание нового контакта
        contactId = await this.createContact({
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
        });
        console.log('Created new contact:', contactId);
      }

      if (!contactId) {
        throw new Error('Failed to create/find contact');
      }

      // 2.5. Обновление контакта с доп. полями (услуга, мастер, дата)
      try {
        await fetch(`${this.baseURL}/contacts/${contactId}`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            custom_fields_values: [
              {
                field_id: 1335817, // Услуга
                values: [{ value: booking.service }],
              },
              {
                field_id: 1335819, // Мастер
                values: [{ value: booking.master }],
              },
              {
                field_id: 1335821, // Дата записи
                values: [{ value: Math.floor(new Date(`${booking.date} ${booking.time}`).getTime() / 1000) }],
              },
            ],
          }),
        });
      } catch (err) {
        console.error('Failed to update contact custom fields:', err);
      }

      // 3. Создание сделки
      const leadName = `${booking.service} - ${booking.master} (${booking.date} ${booking.time})`;

      // Формирование UTM полей для лида (используем встроенные tracking_data поля)
      const customFields: any[] = [];
      if (booking.utm) {
        if (booking.utm.utmSource) {
          customFields.push({
            field_code: 'UTM_SOURCE',
            values: [{ value: booking.utm.utmSource }],
          });
        }
        if (booking.utm.utmMedium) {
          customFields.push({
            field_code: 'UTM_MEDIUM',
            values: [{ value: booking.utm.utmMedium }],
          });
        }
        if (booking.utm.utmCampaign) {
          customFields.push({
            field_code: 'UTM_CAMPAIGN',
            values: [{ value: booking.utm.utmCampaign }],
          });
        }
        if (booking.utm.utmTerm) {
          customFields.push({
            field_code: 'UTM_TERM',
            values: [{ value: booking.utm.utmTerm }],
          });
        }
        if (booking.utm.utmContent) {
          customFields.push({
            field_code: 'UTM_CONTENT',
            values: [{ value: booking.utm.utmContent }],
          });
        }
      }

      // Получаем цену из услуги
      const servicePrice = this.getServicePrice(booking.service);

      const leadId = await this.createLead(
        {
          name: leadName,
          price: booking.price || servicePrice || 1500, // Используем цену из booking или из услуги
          custom_fields_values: customFields,
        },
        contactId
      );

      if (leadId) {
        console.log('✅ Created lead:', leadId);
      } else {
        console.error('❌ Failed to create lead for contact:', contactId);
      }

      // 4. Создание задачи "Подтвердить запись"
      if (leadId) {
        // Вычисляем время для задачи: за 1 час до записи, но не раньше чем через 15 минут от текущего времени
        const appointmentTime = new Date(booking.date + ' ' + booking.time);
        const taskTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // За час до записи
        const now = new Date();
        const minTaskTime = new Date(now.getTime() + 15 * 60 * 1000); // Минимум через 15 минут

        // Если задача должна быть раньше чем через 15 минут, ставим её через 15 минут
        const finalTaskTime = taskTime < minTaskTime ? minTaskTime : taskTime;

        const taskId = await this.createTask({
          task_type_id: 1, // Звонок
          text: `Подтвердить запись клиента ${booking.name} на ${booking.date} в ${booking.time}`,
          complete_till: Math.floor(finalTaskTime.getTime() / 1000),
          entity_id: leadId,
          entity_type: 'leads',
        });

        if (taskId) {
          console.log('✅ Task created successfully:', taskId);
        } else {
          console.error('❌ Failed to create task for lead:', leadId);
        }

        // 5. Добавление примечания с UTM-метками (если есть)
        if (booking.utm && Object.keys(booking.utm).length > 0) {
          const utmText = Object.entries(booking.utm)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
          await this.addNote(
            leadId,
            'leads',
            `Источник:\n${utmText}\n\nБраузер: ${booking.source || 'Не определён'}`
          );
        }
      }

      return { contactId, leadId };
    } catch (error) {
      console.error('amoCRM processBooking error:', error);
      return { contactId: null, leadId: null };
    }
  }
}

export const amoCRM = new AmoCRMClient();
