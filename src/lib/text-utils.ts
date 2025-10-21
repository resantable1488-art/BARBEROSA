// Утилиты для правильного переноса текста

/**
 * Добавляет неразрывные пробелы перед короткими словами (предлоги, союзы)
 * чтобы они не висели в конце строки на мобильных устройствах
 *
 * Например:
 * "Алексей чистил мандарины и пинал картошку"
 * становится
 * "Алексей чистил мандарины и\u00A0пинал картошку"
 *
 * Теперь "и" не будет висеть в конце строки
 */
export function fixTextWrapping(text: string): string {
  if (!text) return text;

  // Список коротких слов (предлоги, союзы, частицы) которые не должны висеть в конце строки
  const shortWords = [
    // Предлоги
    'в', 'на', 'с', 'к', 'о', 'у', 'по', 'из', 'от', 'до', 'за', 'под', 'над', 'при', 'через', 'без', 'для', 'ко', 'со', 'во',
    // Союзы
    'и', 'а', 'но', 'или', 'да', 'что', 'как', 'чтобы', 'если', 'когда', 'где', 'куда', 'зачем', 'почему',
    // Частицы
    'не', 'ни', 'бы', 'ли', 'же', 'ведь', 'лишь', 'только', 'даже', 'уже',
    // Короткие слова
    'мы', 'вы', 'он', 'она', 'оно', 'они', 'их', 'её', 'его', 'их', 'то', 'та', 'те', 'ту', 'тот',
  ];

  // Создаём регулярное выражение для поиска
  // \s - пробел, (?=слово\s) - за которым следует короткое слово и пробел
  const pattern = new RegExp(`\\s(${shortWords.join('|')})\\s`, 'gi');

  // Заменяем обычный пробел после короткого слова на неразрывный пробел (\u00A0)
  const result = text.replace(pattern, (match, word) => {
    // \u00A0 - это неразрывный пробел (non-breaking space)
    return ` ${word}\u00A0`;
  });

  return result;
}

/**
 * Обёртка React компонента для автоматической обработки текста
 */
export function FixedText({ children }: { children: string }) {
  return <>{fixTextWrapping(children)}</>;
}

/**
 * Hook для обработки текста
 */
export function useFixedText(text: string): string {
  return fixTextWrapping(text);
}

/**
 * Удаляет лишние пробелы и переносы строк
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Множественные пробелы → один пробел
    .replace(/\n\s*\n/g, '\n') // Множественные переносы → один перенос
    .trim();
}

/**
 * Форматирует номер телефона
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    // +7 (999) 123-45-67
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }

  return phone;
}

/**
 * Обрезает текст до указанной длины с добавлением "..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
