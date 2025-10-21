"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Calendar, Clock, User, Scissors, ChevronRight, Crown, Wind, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { services, masters } from "@/lib/config";
import { siteConfig } from "@/lib/config";
import { toast } from "sonner";
import { trackEvent, trackFormError } from "@/lib/analytics";
import { sendBookingToN8N } from "@/lib/webhooks";
import Link from "next/link";

// Категории услуг
const serviceCategories = [
  { id: "Стрижки", label: "Стрижки", icon: Scissors, color: "red" },
  { id: "Борода", label: "Борода", icon: Wind, color: "blue" },
  { id: "Комплексы", label: "Комплексы", icon: Crown, color: "purple" },
  { id: "Окрашивание", label: "Окрашивание", icon: Sparkles, color: "yellow" },
  { id: "Особые случаи", label: "Особые случаи", icon: Crown, color: "white" },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("Стрижки");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Доступные временные слоты
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00"
  ];

  // Фильтр недоступных дат (только будущие)
  const disabledDays = { before: new Date() };

  // Фильтрованные услуги по категории
  const filteredServices = services.filter(s => s.category === selectedCategory);

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedMasterData = masters.find(m => m.id === selectedMaster);

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null;
      case 2: return selectedMaster !== null;
      case 3: return selectedDate !== undefined;
      case 4: return selectedTime !== null;
      case 5: return clientName.trim() !== "" && clientPhone.trim() !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1);
      if (step === 1) trackEvent("select_item", { item_id: selectedService, item_name: selectedServiceData?.name });
      if (step === 2) trackEvent("select_item", { item_id: selectedMaster, item_name: selectedMasterData?.name });
      if (step === 3 && selectedDate) trackEvent("timeslot_select", { date: format(selectedDate, "yyyy-MM-dd") });
      if (step === 4) trackEvent("timeslot_select", { time: selectedTime });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast.error("Заполните все поля");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        service: selectedServiceData?.name || "",
        serviceId: selectedService,
        master: selectedMasterData?.name || "",
        masterId: selectedMaster,
        date: format(selectedDate, "dd.MM.yyyy", { locale: ru }),
        time: selectedTime,
        name: clientName,
        phone: clientPhone,
        price: selectedServiceData?.priceFrom,
      };

      // Отправка в API
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Ошибка при отправке");

      // Analytics
      trackEvent("appointment_booked", {
        service_id: selectedService,
        service_name: selectedServiceData?.name,
        master_id: selectedMaster,
        master_name: selectedMasterData?.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        price: selectedServiceData?.priceFrom,
      });

      trackEvent("generate_lead", {
        lead_type: "booking",
        value: selectedServiceData?.priceFrom,
      });

      // n8n webhook
      await sendBookingToN8N(bookingData);

      // Редирект на страницу благодарности
      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Ошибка записи:", error);
      toast.error("Произошла ошибка. Попробуйте позвонить нам: " + siteConfig.contact.phone);
      trackFormError("booking_submit", String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white/80">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>
          </Link>
          <div className="text-2xl font-bold text-white">БАРБЕРОСА</div>
          <div className="text-white/60 text-sm hidden md:block">
            {siteConfig.contact.phone}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step < 6 && (
        <div className="fixed top-16 left-0 w-full h-1 bg-slate-800 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <AnimatePresence mode="wait">
          {/* Шаг 1: Выбор услуги */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Выберите услугу
                </h1>
                <p className="text-white/60">
                  Шаг {step} из {totalSteps}
                </p>
              </div>

              {/* Категории фильтров */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {serviceCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <Button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`
                        ${isActive
                          ? cat.color === "red" ? "bg-red-600 hover:bg-red-700" :
                            cat.color === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                            cat.color === "purple" ? "bg-purple-600 hover:bg-purple-700" :
                            cat.color === "yellow" ? "bg-yellow-600 hover:bg-yellow-700" :
                            "bg-white text-slate-900 hover:bg-gray-100"
                          : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>

              {/* Сетка услуг - без скролла, компактно */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Card
                      className={`p-2 cursor-pointer transition-all h-full ${
                        selectedService === service.id
                          ? "bg-gradient-to-br from-red-600 to-red-700 border-red-400 text-white"
                          : "bg-slate-800/50 border-slate-700 hover:border-red-500/50 text-white"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <Scissors className="w-4 h-4" />
                        {selectedService === service.id && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      <h3 className="text-sm font-bold mb-1 line-clamp-2 leading-tight">{service.name}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black">
                          {service.priceFrom}₽
                        </span>
                        <span className="opacity-60 text-[10px]">{service.durationMin}мин</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Шаг 2: Выбор мастера */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Выберите мастера
                </h1>
                <p className="text-white/60">
                  Шаг {step} из {totalSteps}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {masters.map((master) => (
                  <motion.div
                    key={master.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Card
                      className={`p-2 cursor-pointer transition-all ${
                        selectedMaster === master.id
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400 text-white"
                          : "bg-slate-800/50 border-slate-700 hover:border-blue-500/50 text-white"
                      }`}
                      onClick={() => setSelectedMaster(master.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <User className="w-4 h-4" />
                        {selectedMaster === master.id && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      <h3 className="text-sm font-bold mb-1 line-clamp-1">{master.name}</h3>
                      <p className="text-xs mb-1 line-clamp-1 opacity-80">
                        {master.specialization}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="opacity-60">{master.experience}</span>
                        {master.priceAdd && master.priceAdd > 0 && (
                          <span className="font-bold">+{master.priceAdd}₽</span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Шаг 3: Выбор даты */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Выберите дату
                </h1>
                <p className="text-white/60">
                  Шаг {step} из {totalSteps}
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700 p-6 max-w-md mx-auto">
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    locale={ru}
                    className="rounded-md"
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Шаг 4: Выбор времени */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Выберите время
                </h1>
                <p className="text-white/60">
                  Шаг {step} из {totalSteps} • {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: ru })}
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {timeSlots.map((time) => {
                  const isUnavailable = Math.random() > 0.7; // Симуляция занятости
                  return (
                    <motion.button
                      key={time}
                      whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                      whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                      onClick={() => !isUnavailable && setSelectedTime(time)}
                      disabled={isUnavailable}
                      className={`p-4 rounded-lg font-bold transition-all ${
                        selectedTime === time
                          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white scale-105"
                          : isUnavailable
                          ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                          : "bg-slate-800/50 text-white hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      {time}
                      {selectedTime === time && <Check className="w-4 h-4 mx-auto mt-1" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Шаг 5: Контактные данные */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Ваши контакты
                </h1>
                <p className="text-white/60">
                  Шаг {step} из {totalSteps}
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md mx-auto">
                {/* Итоги выбора */}
                <div className="mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <h3 className="text-white font-bold mb-3">Ваш выбор:</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Услуга:</span>
                      <span className="font-semibold text-white">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Мастер:</span>
                      <span className="font-semibold text-white">{selectedMasterData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Дата:</span>
                      <span className="font-semibold text-white">
                        {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: ru })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Время:</span>
                      <span className="font-semibold text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span>Цена:</span>
                      <span className="font-bold text-emerald-400 text-lg">
                        {(selectedServiceData?.priceFrom || 0) + (selectedMasterData?.priceAdd || 0)}₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Форма */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Ваше имя</Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Иван"
                      className="bg-slate-900 border-slate-700 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+7 (912) 345-67-89"
                      className="bg-slate-900 border-slate-700 text-white mt-2"
                    />
                  </div>
                  <p className="text-xs text-white/50">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mt-8 max-w-2xl mx-auto"
          >
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Назад
              </Button>
            )}
            <div className="flex-1" />
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-blue-600 disabled:opacity-50"
              >
                Далее
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? "Отправка..." : "Записаться"}
                <Check className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
