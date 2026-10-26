/**
 * Finance Domain Types and Interfaces for TakaTrack
 */

export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'House Rent'
  | 'Baby Care & Milk'
  | 'Bike & Fuel'
  | 'Groceries'
  | 'Utilities'
  | 'Healthcare'
  | 'Dining'
  | 'Transport'
  | 'Entertainment'
  | 'Personal'
  | 'Education'
  | 'Shopping'
  | 'Debt & Loan'
  | 'Miscellaneous';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Investments'
  | 'Rental Income'
  | 'Bonus / Gifts'
  | 'Other';

export type CategoryName = ExpenseCategory | IncomeCategory;

export type PaymentMethod = 'Cash' | 'Card' | 'bKash/Nagad' | 'Bank Transfer';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number; // in BDT (৳)
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthBudget {
  monthYear: string; // e.g. "2026-10"
  overallTarget: number; // overall monthly expense ceiling in BDT
  categoryBudgets: Record<string, number>; // Category name -> Limit in BDT
}

export interface CategorySummary {
  category: string;
  spent: number;
  budget: number;
  percentage: number;
  status: 'normal' | 'warning' | 'alert';
  color: string;
  transactionCount: number;
}

export interface MonthlySummary {
  monthYear: string; // "YYYY-MM"
  displayName: string; // e.g. "October 2026"
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
}

export interface FinancialKPIs {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // Percentage: (netSavings / totalIncome) * 100
  overallBudget: number;
  budgetUtilization: number; // Percentage: (totalExpenses / overallBudget) * 100
  remainingBudget: number;
  dailyAverageExpense: number;
  projectedMonthEndExpense: number;
}

export interface CategoryMetadata {
  name: string;
  type: TransactionType;
  color: string;
  defaultBudget: number;
  icon: string;
}
