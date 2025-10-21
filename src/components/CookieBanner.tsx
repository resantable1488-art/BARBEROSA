"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateConsentMode } from "@/lib/analytics";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Всегда включены
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Показываем баннер через 1 секунду после загрузки
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Применяем сохраненные настройки
      const saved = JSON.parse(consent);
      setPreferences(saved);
      updateConsentMode(saved.analytics, saved.marketing);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(prefs);
  };

  const handleRejectAll = () => {
    const prefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(prefs);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    updateConsentMode(prefs.analytics, prefs.marketing);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Мы используем файлы cookie</CardTitle>
              <CardDescription className="mt-2">
                Для улучшения работы сайта и анализа трафика. Вы можете настроить
                использование cookie или принять все.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRejectAll}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {showDetails && (
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox checked disabled id="necessary" />
              <div className="flex-1">
                <label htmlFor="necessary" className="font-medium text-sm">
                  Строго необходимые (всегда включены)
                </label>
                <p className="text-sm text-gray-600">
                  Необходимы для базовой функциональности сайта
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: !!checked })
                }
                id="analytics"
              />
              <div className="flex-1">
                <label htmlFor="analytics" className="font-medium text-sm">
                  Аналитические cookie
                </label>
                <p className="text-sm text-gray-600">
                  Помогают понять, как посетители используют сайт (Google Analytics)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: !!checked })
                }
                id="marketing"
              />
              <div className="flex-1">
                <label htmlFor="marketing" className="font-medium text-sm">
                  Маркетинговые cookie
                </label>
                <p className="text-sm text-gray-600">
                  Используются для показа релевантной рекламы
                </p>
              </div>
            </div>
          </CardContent>
        )}

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {showDetails ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="w-full sm:w-auto"
              >
                Назад
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="w-full sm:flex-1 bg-emerald-700 hover:bg-emerald-800"
              >
                Сохранить настройки
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="w-full sm:w-auto"
              >
                Отклонить все
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="w-full sm:w-auto"
              >
                Настроить
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 bg-emerald-700 hover:bg-emerald-800"
              >
                Принять все
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
