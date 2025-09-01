// src/utils/dateUtils.ts

import {Expense, ExpenseSummary, CategoryBreakdown} from './types';

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateForGrouping = (date: string): string => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
};

export const isToday = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const isThisWeek = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return d >= startOfWeek && d <= today;
};

export const isThisMonth = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  );
};

export const calculateSummary = (expenses: Expense[]): ExpenseSummary => {
  const summary = {today: 0, thisWeek: 0, thisMonth: 0};

  expenses.forEach(expense => {
    if (isToday(expense.date)) summary.today += expense.amount;
    if (isThisWeek(expense.date)) summary.thisWeek += expense.amount;
    if (isThisMonth(expense.date)) summary.thisMonth += expense.amount;
  });

  return summary;
};

// ✅ Unified version: supports optional month/year
export const calculateCategoryBreakdown = (
  expenses: Expense[],
  month?: number, // 1-12
  year?: number,
): CategoryBreakdown[] => {
  const filteredExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    const matchMonth = month ? d.getMonth() + 1 === month : true;
    const matchYear = year ? d.getFullYear() === year : true;
    return matchMonth && matchYear;
  });

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals: {[key: string]: {total: number; count: number}} = {};

  filteredExpenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = {total: 0, count: 0};
    }
    categoryTotals[exp.category].total += exp.amount;
    categoryTotals[exp.category].count += 1;
  });

  return Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category,
      total: data.total,
      percentage: total > 0 ? Math.round((data.total / total) * 100) : 0,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total);
};

export const formatCurrency = (amount: number): string =>
  `$${amount.toFixed(2)}`;

export const groupExpensesByDate = (
  expenses: Expense[],
): {[key: string]: Expense[]} => {
  const grouped: {[key: string]: Expense[]} = {};
  expenses.forEach(expense => {
    const dateKey = formatDateForGrouping(expense.date);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(expense);
  });
  return grouped;
};

export const generateId = (): string =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);
