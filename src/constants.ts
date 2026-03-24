import type { JobCategory } from './types';

export const categories: { label: string; value: JobCategory }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Видеомонтаж', value: 'video' },
  { label: 'Дизайн', value: 'design' },
  { label: 'Маркетинг', value: 'marketing' },
  { label: 'Чаты', value: 'chats' },
  { label: 'Сайты', value: 'sites' },
  { label: 'Соцсети', value: 'social' },
  { label: 'CRM и боты', value: 'support' },
  { label: 'Другое', value: 'other' },
];

export const slogans = [
  'Разместить задание. Найти работу. Без регистрации.',
  'Это фриланс биржа',
  'Найти работу в онлайн бесплатно',
  'Разместить своё задание за 10₽',
  'Добавь задачу в ленту и жди отклики',
  'Ищите исполнителей тут',
];
