// src/storage/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expense, Category, DEFAULT_CATEGORIES} from '../utils/types';

const EXPENSES_KEY = '@expenses';
const CATEGORIES_KEY = '@categories';

export class Storage {
  static async getExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(EXPENSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  }

  static async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
      throw error;
    }
  }

  static async addExpense(expense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      expenses.unshift(expense); // Add to beginning for latest-first ordering
      await this.saveExpenses(expenses);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  static async deleteExpense(expenseId: string): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(
        expense => expense.id !== expenseId,
      );
      await this.saveExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  }

  static async addCategory(category: Category): Promise<void> {
    try {
      const categories = await this.getCategories();
      categories.push(category);
      await this.saveCategories(categories);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const categories = await this.getCategories();
      const filteredCategories = categories.filter(
        category => category.id !== categoryId,
      );
      await this.saveCategories(filteredCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([EXPENSES_KEY, CATEGORIES_KEY]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  static async initializeDefaultCategories(): Promise<void> {
    try {
      const existingCategories = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (!existingCategories) {
        await this.saveCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
    }
  }
}
