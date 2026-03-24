export function detectContactType(contact: string): 'email' | 'link' | 'phone' {
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(contact)) return 'email';
  if (/^(http|https|tg):\/\//i.test(contact) || /^@[\w]{5,32}$/.test(contact) || /\.(com|ru|net|org|me|io)/i.test(contact)) {
    return 'link';
  }
  return 'phone';
}

export function getContactButtonText(contactType: 'email' | 'link' | 'phone'): string {
  if (contactType === 'link') return 'Перейти';
  if (contactType === 'email') return 'Написать';
  return 'Копировать номер';
}

export function pluralizeResponses(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} отклик`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} отклика`;
  return `${count} откликов`;
}

export function formatJobDate(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  if (now.toDateString() === date.toDateString()) {
    return `сегодня в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${date.getDate()} ${months[date.getMonth()]} в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
