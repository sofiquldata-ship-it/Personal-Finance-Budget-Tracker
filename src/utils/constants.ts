import { ExpenseCategory, IncomeCategory, PaymentMethod, CategoryMetadata, MonthBudget, Transaction } from '../types/finance';

export const EXPENSE_CATEGORIES: CategoryMetadata[] = [
  { name: 'House Rent', type: 'expense', color: '#6366F1', defaultBudget: 0, icon: 'Home' },
  { name: 'Baby Care & Milk', type: 'expense', color: '#0EA5E9', defaultBudget: 0, icon: 'Baby' },
  { name: 'Bike & Fuel', type: 'expense', color: '#F97316', defaultBudget: 0, icon: 'Bike' },
  { name: 'Groceries', type: 'expense', color: '#10B981', defaultBudget: 0, icon: 'ShoppingBag' },
  { name: 'Utilities', type: 'expense', color: '#F59E0B', defaultBudget: 0, icon: 'Zap' },
  { name: 'Healthcare', type: 'expense', color: '#EF4444', defaultBudget: 0, icon: 'Activity' },
  { name: 'Dining', type: 'expense', color: '#EC4899', defaultBudget: 0, icon: 'Utensils' },
  { name: 'Transport', type: 'expense', color: '#8B5CF6', defaultBudget: 0, icon: 'Car' },
  { name: 'Entertainment', type: 'expense', color: '#06B6D4', defaultBudget: 0, icon: 'Film' },
  { name: 'Personal', type: 'expense', color: '#14B8A6', defaultBudget: 0, icon: 'User' },
  { name: 'Education', type: 'expense', color: '#3B82F6', defaultBudget: 0, icon: 'BookOpen' },
  { name: 'Shopping', type: 'expense', color: '#E11D48', defaultBudget: 0, icon: 'Package' },
  { name: 'Debt & Loan', type: 'expense', color: '#64748B', defaultBudget: 0, icon: 'CreditCard' },
  { name: 'Miscellaneous', type: 'expense', color: '#94A3B8', defaultBudget: 0, icon: 'Layers' },
];

export const INCOME_CATEGORIES: CategoryMetadata[] = [
  { name: 'Salary', type: 'income', color: '#10B981', defaultBudget: 0, icon: 'Briefcase' },
  { name: 'Freelance', type: 'income', color: '#06B6D4', defaultBudget: 0, icon: 'Laptop' },
  { name: 'Business', type: 'income', color: '#8B5CF6', defaultBudget: 0, icon: 'TrendingUp' },
  { name: 'Investments', type: 'income', color: '#F59E0B', defaultBudget: 0, icon: 'PieChart' },
  { name: 'Rental Income', type: 'income', color: '#6366F1', defaultBudget: 0, icon: 'Building' },
  { name: 'Bonus / Gifts', type: 'income', color: '#EC4899', defaultBudget: 0, icon: 'Gift' },
  { name: 'Other', type: 'income', color: '#94A3B8', defaultBudget: 0, icon: 'CircleDollarSign' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Card',
  'bKash/Nagad',
  'Bank Transfer',
];

export const CATEGORY_COLOR_MAP: Record<string, string> = {
  'House Rent': '#6366F1',
  'Baby Care & Milk': '#0EA5E9',
  'Bike & Fuel': '#F97316',
  'Groceries': '#10B981',
  'Utilities': '#F59E0B',
  'Healthcare': '#EF4444',
  'Dining': '#EC4899',
  'Transport': '#8B5CF6',
  'Entertainment': '#06B6D4',
  'Personal': '#14B8A6',
  'Education': '#3B82F6',
  'Shopping': '#E11D48',
  'Debt & Loan': '#64748B',
  'Miscellaneous': '#94A3B8',
  'Salary': '#10B981',
  'Freelance': '#06B6D4',
  'Business': '#8B5CF6',
  'Investments': '#F59E0B',
  'Rental Income': '#6366F1',
  'Bonus / Gifts': '#EC4899',
  'Other': '#94A3B8',
};

// Initial state is clean and empty so the user can enter their own real data
export const INITIAL_TRANSACTIONS: Transaction[] = [];

// Optional sample records for demo preview if explicitly requested
export const SAMPLE_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-inc-01',
    date: '2026-10-01',
    type: 'income' as const,
    category: 'Salary',
    amount: 115000,
    paymentMethod: 'Bank Transfer' as const,
    isRecurring: true,
    notes: 'Monthly Executive Salary - Prime Tech Ltd',
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'tx-inc-02',
    date: '2026-10-12',
    type: 'income' as const,
    category: 'Freelance',
    amount: 28000,
    paymentMethod: 'Bank Transfer' as const,
    isRecurring: false,
    notes: 'UI/UX Design system consultation - FinLab',
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-12T14:30:00Z',
  },
  {
    id: 'tx-exp-01',
    date: '2026-10-02',
    type: 'expense' as const,
    category: 'House Rent',
    amount: 25000,
    paymentMethod: 'Bank Transfer' as const,
    isRecurring: true,
    notes: 'Apartment monthly rent payment',
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'tx-exp-02',
    date: '2026-10-03',
    type: 'expense' as const,
    category: 'Groceries',
    amount: 5400,
    paymentMethod: 'Card' as const,
    isRecurring: false,
    notes: 'Weekly pantry replenishment',
    createdAt: '2026-10-03T18:20:00Z',
    updatedAt: '2026-10-03T18:20:00Z',
  },
];

// Budgets start completely blank/empty with zero pre-filled values
export const INITIAL_BUDGET: Record<string, MonthBudget> = {};
