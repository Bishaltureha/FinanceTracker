// src/utils/types.ts
export interface Expense {
  name: string;
  emoji: string;
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
}

export interface ExpenseSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export type SortOption = 'latest' | 'amount';
export type FilterOption = 'all' | string; // 'all' or category name

export const DEFAULT_CATEGORIES: Category[] = [
  {id: '1', name: 'Food', emoji: '🍔'},
  {id: '2', name: 'Transport', emoji: '🚌'},
  {id: '3', name: 'Shopping', emoji: '🛍️'},
  {id: '4', name: 'Bills', emoji: '💡'},
  {id: '5', name: 'Other', emoji: '💰'},
];
export const CATEGORY_EMOJI: Record<string, string> = {
  Food: '🍔',
  Beverages: '☕',
  Transport: '🚌',
  Utilities: '📱',
  Shopping: '🛍️',
  Entertainment: '🎬',
  PersonalCare: '🧴',
  Health: '🏋️',
  Education: '📚',
};
