"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone as PhoneIcon, Sparkles } from "lucide-react";
import { services, masters } from "@/lib/config";
import { sendBookingToN8N } from "@/lib/webhooks";
import { trackServiceSelect, trackMasterSelect, trackTimeslotSelect, trackAppointmentBooked } from "@/lib/analytics";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

export default function PremiumBookingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    masterId: "",
    date: "",
    time: "",
    name: "",
    phone: "",
  });

  const popularServices = services.filter(s => s.popular);
  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedMaster = masters.find(m => m.id === formData.masterId);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setFormData({ ...formData, serviceId });
      trackServiceSelect(service.id, service.name, service.priceFrom);
      setTimeout(() => setStep(2), 300);
    }
  };

  const handleMasterSelect = (masterId: string) => {
    const master = masters.find(m => m.id === masterId);
    if (master) {
      setFormData({ ...formData, masterId });
      trackMasterSelect(master.id, master.name);
      setTimeout(() => setStep(3), 300);
    }
  };

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, date });
    setTimeout(() => setStep(4), 300);
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, time });
    trackTimeslotSelect(formData.date, time);
    setTimeout(() => setStep(5), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Заполните имя и телефон");
      return;
    }

    setLoading(true);

    try {
      const service = services.find(s => s.id === formData.serviceId)!;
      const master = masters.find(m => m.id === formData.masterId)!;

      const bookingData = {
        name: formData.name,
        phone: formData.phone,
        email: "",
        service: {
          id: service.id,
          name: service.name,
          price: service.priceFrom,
          duration: service.durationMin,
        },
        master: {
          id: master.id,
          name: master.name,
        },
        date: formData.date,
        time: formData.time,
        comment: "",
        source: "website",
        utm: {},
        timestamp: new Date().toISOString(),
      };

      const result = await sendBookingToN8N(bookingData);

      if (result.success) {
        trackAppointmentBooked(
          service.id,
          service.name,
          master.id,
          master.name,
          formData.date,
          formData.time,
          service.priceFrom,
          service.durationMin
        );

        toast.success("Запись успешно отправлена!", {
          description: "Мы перезвоним в течение 15 минут",
          icon: <Sparkles className="w-5 h-5" />,
        });

        // Reset
        setFormData({
          serviceId: "",
          masterId: "",
          date: "",
          time: "",
          name: "",
          phone: "",
        });
        setStep(1);
      }
    } catch (error) {
      toast.error("Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <motion.div
            key={s}
            className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: step >= s ? "100%" : "0%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Service */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Выберите услугу</h3>
            <div className="grid gap-3">
              {popularServices.map((service) => (
                <motion.button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceSelect(service.id)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {service.name}
                      </p>
                      <p className="text-sm text-emerald-200/60">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">
                        {service.priceFrom}₽
                      </p>
                      <ChevronRight className="w-5 h-5 text-emerald-400 ml-auto" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Master */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Выберите мастера</h3>
            <div className="grid gap-3">
              {masters.slice(0, 4).map((master) => (
                <motion.button
                  key={master.id}
                  type="button"
                  onClick={() => handleMasterSelect(master.id)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 transition-all text-left"
                >
                  <p className="font-semibold text-white">{master.name}</p>
                  <p className="text-sm text-emerald-200/60">{master.title} • {master.experience}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Выберите дату</h3>
            <div className="grid grid-cols-2 gap-3">
              {getDateOptions().map((date) => (
                <motion.button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(format(date, "yyyy-MM-dd"))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 transition-all"
                >
                  <CalendarIcon className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm font-semibold text-white">
                    {format(date, "d MMMM", { locale: ru })}
                  </p>
                  <p className="text-xs text-emerald-200/60">
                    {format(date, "EEEE", { locale: ru })}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Time */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Выберите время</h3>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <motion.button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500 transition-all"
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <p className="text-sm font-semibold text-white">{time}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Contacts */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Ваши контакты</h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Имя *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Телефон *</Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (912) 345-67-89"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <p className="text-sm text-white/80">
                <strong>Услуга:</strong> {selectedService?.name}
              </p>
              <p className="text-sm text-white/80">
                <strong>Мастер:</strong> {selectedMaster?.name}
              </p>
              <p className="text-sm text-white/80">
                <strong>Дата:</strong> {formData.date} в {formData.time}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/50"
              size="lg"
            >
              {loading ? "Отправка..." : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Подтвердить запись
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      {step > 1 && step < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(step - 1)}
          className="w-full border-white/20 text-white hover:bg-white/5"
        >
          Назад
        </Button>
      )}
    </form>
  );
}
