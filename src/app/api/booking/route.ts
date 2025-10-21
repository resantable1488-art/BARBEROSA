import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjvtdsedcdwuefzaskwi.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdnRkc2VkY2R3dWVmemFza3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM5NjY0MCwiZXhwIjoyMDc1OTcyNjQwfQ.B2V8GmaNAGW2XkNf9thd0yA0C31G7GzCQ4K8qdMTuOU';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация данных
    if (!body.name || !body.phone || !body.date || !body.time || !body.master || !body.service) {
      return NextResponse.json(
        { success: false, error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Создаем клиент Supabase с service role key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Сохранение в Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          master: body.master,
          service: body.service,
          date: body.date,
          time: body.time,
          price: body.price || null,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[BOOKING] Supabase error:', dbError);
      // НЕ фейлим - продолжаем с n8n
    }

    // Отправка в n8n webhook
    const webhookUrl = 'https://n8n.autopine.ru/webhook/barberosa-booking';

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'new_booking',
          booking: {
            id: booking?.id || null,
            name: body.name,
            phone: body.phone,
            email: body.email,
            master: body.master,
            service: body.service,
            date: body.date,
            time: body.time,
            created_at: booking?.created_at || new Date().toISOString(),
          },
          metadata: {
            ip: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (webhookError) {
      console.error('[BOOKING] n8n webhook error:', webhookError);
    }

    return NextResponse.json({
      success: true,
      message: 'Запись успешно создана! Мы свяжемся с вами для подтверждения.',
      bookingId: booking?.id || null,
      data: {
        name: body.name,
        date: body.date,
        time: body.time,
        master: body.master,
        service: body.service,
      },
    });
  } catch (error) {
    console.error('[BOOKING] API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Произошла ошибка при создании записи',
      },
      { status: 500 }
    );
  }
}
