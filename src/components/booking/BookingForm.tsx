"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { services, masters } from "@/lib/config";
import { sendBookingToN8N } from "@/lib/webhooks";
import {
  trackFormStart,
  trackServiceSelect,
  trackMasterSelect,
  trackTimeslotSelect,
  trackAppointmentBooked,
} from "@/lib/analytics";
import { toast } from "sonner";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    masterId: "",
    date: undefined as Date | undefined,
    time: "",
    name: "",
    phone: "",
    comment: "",
  });

  const selectedService = services.find((s) => s.id === formData.serviceId);
  const selectedMaster = masters.find((m) => m.id === formData.masterId);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setFormData({ ...formData, serviceId });
      trackServiceSelect(service.id, service.name, service.priceFrom);
      trackFormStart("booking", 1);
    }
  };

  const handleMasterChange = (masterId: string) => {
    const master = masters.find((m) => m.id === masterId);
    if (master) {
      setFormData({ ...formData, masterId });
      trackMasterSelect(master.id, master.name);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date });
  };

  const handleTimeChange = (time: string) => {
    setFormData({ ...formData, time });
    if (formData.date) {
      trackTimeslotSelect(format(formData.date, "yyyy-MM-dd"), time);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.masterId || !formData.date || !formData.time || !formData.name || !formData.phone) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setLoading(true);

    try {
      const service = services.find((s) => s.id === formData.serviceId);
      const master = masters.find((m) => m.id === formData.masterId);

      if (!service || !master) {
        throw new Error("Service or master not found");
      }

      // Рассчитываем полную цену: базовая цена услуги + надбавка мастера
      const totalPrice = service.priceFrom + master.priceAdd;

      const bookingData = {
        name: formData.name,
        phone: formData.phone,
        email: "",
        service: {
          id: service.id,
          name: service.name,
          price: totalPrice,
          duration: service.durationMin,
        },
        master: {
          id: master.id,
          name: master.name,
        },
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,
        comment: formData.comment,
        source: "website",
        utm: {
          source: new URLSearchParams(window.location.search).get("utm_source") || undefined,
          medium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
          campaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
        },
        timestamp: new Date().toISOString(),
      };

      // Отправка в n8n
      const result = await sendBookingToN8N(bookingData);

      if (result.success) {
        // GA4 событие
        trackAppointmentBooked(
          service.id,
          service.name,
          master.id,
          master.name,
          bookingData.date,
          formData.time,
          totalPrice,
          service.durationMin
        );

        toast.success("Запись успешно отправлена!", {
          description: "Мы перезвоним вам в течение 15 минут для подтверждения",
        });

        // Сброс формы
        setFormData({
          serviceId: "",
          masterId: "",
          date: undefined,
          time: "",
          name: "",
          phone: "",
          comment: "",
        });
        setStep(1);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Ошибка отправки", {
        description: "Попробуйте позвонить нам напрямую",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Шаг 1: Выбор услуги */}
      <div className="space-y-2">
        <Label htmlFor="service">Услуга *</Label>
        <Select value={formData.serviceId} onValueChange={handleServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите услугу" />
          </SelectTrigger>
          <SelectContent>
            {services.filter((s) => s.popular).map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} — {service.priceFrom}-{service.priceTo} ₽
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedService && (
          <p className="text-sm text-gray-600">
            {selectedService.duration} • {selectedService.description}
          </p>
        )}
      </div>

      {/* Шаг 2: Выбор мастера */}
      {formData.serviceId && (
        <div className="space-y-2">
          <Label htmlFor="master">Мастер *</Label>
          <Select value={formData.masterId} onValueChange={handleMasterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите мастера или авто-подбор" />
            </SelectTrigger>
            <SelectContent>
              {masters.map((master) => (
                <SelectItem key={master.id} value={master.id}>
                  {master.name} — {master.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Шаг 3: Дата и время */}
      {formData.masterId && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Дата *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "d MMMM yyyy", { locale: ru })
                  ) : (
                    "Выберите дату"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Время *</Label>
            <Select value={formData.time} onValueChange={handleTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Шаг 4: Контактные данные */}
      {formData.date && formData.time && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Ваше имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Иван"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (912) 345-67-89"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Пожелания по стрижке..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            size="lg"
            disabled={loading}
          >
            {loading ? "Отправка..." : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Записаться
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </>
      )}
    </form>
  );
}
