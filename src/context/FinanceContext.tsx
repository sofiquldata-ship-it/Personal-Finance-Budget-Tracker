import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  MonthBudget,
  FinancialKPIs,
  CategorySummary,
  MonthlySummary,
  TransactionType,
  PaymentMethod,
} from '../types/finance';
import {
  INITIAL_TRANSACTIONS,
  SAMPLE_DEMO_TRANSACTIONS,
  INITIAL_BUDGET,
  EXPENSE_CATEGORIES,
  CATEGORY_COLOR_MAP,
} from '../utils/constants';
import { generateCSV, triggerFileDownload, formatMonthYear } from '../utils/formatters';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  subscribeToUserTransactions,
  subscribeToUserBudgets,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore,
  saveBudgetToFirestore,
  syncLocalToFirestore,
  testConnection,
  getActiveUserId,
  initAutoConnect,
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface FinanceContextType {
  // Data
  transactions: Transaction[];
  currentMonth: string; // 'all' or 'YYYY-MM'
  setCurrentMonth: (month: string) => void;
  availableMonths: string[];
  
  // Computed for selected month or all-time
  monthlyTransactions: Transaction[];
  monthlySummaries: MonthlySummary[];
  kpis: FinancialKPIs;
  categorySummaries: CategorySummary[];
  currentBudget: MonthBudget;
  
  // Table Filtering & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: 'all' | TransactionType;
  setTypeFilter: (t: 'all' | TransactionType) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  methodFilter: 'all' | PaymentMethod;
  setMethodFilter: (m: 'all' | PaymentMethod) => void;
  sortBy: 'date' | 'amount';
  setSortBy: (s: 'date' | 'amount') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (o: 'asc' | 'desc') => void;
  filteredTransactions: Transaction[];

  // Transaction CRUD & Quick Entry
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addQuickExpense: (category: string, amount: number, notes?: string) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budget Operations
  updateOverallTarget: (
    target: number,
    options?: {
      autoDistribute?: boolean;
      targetMonth?: string;
      applyToAllMonths?: boolean;
    }
  ) => void;
  updateCategoryLimit: (category: string, limit: number, targetMonth?: string) => void;
  distributeOverallTargetToCategories: (targetMonth?: string) => void;
  syncTargetFromCategories: (targetMonth?: string) => void;
  copyBudgetFromPreviousMonth: (targetMonth?: string) => boolean;
  resetCurrentMonthBudget: (targetMonth?: string) => void;

  // Modals & Navigation
  isTxModalOpen: boolean;
  txToEdit: Transaction | null;
  openAddTxModal: (defaultType?: TransactionType, defaultCategory?: string) => void;
  openEditTxModal: (tx: Transaction) => void;
  closeTxModal: () => void;

  // Data Management
  exportCSV: () => void;
  exportJSONBackup: () => void;
  importJSONBackup: (jsonData: string) => boolean;
  clearAllTransactions: () => void;
  loadDemoData: () => void;
  resetToDefaultData: () => void;

  // Firebase Cloud Sync & Auto-Connection
  user: User | null;
  activeUserId: string;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isFirebaseConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'local_only';
  syncMessage: string;
  forceCloudSync: () => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'takatrack_transactions_v2',
  BUDGETS: 'takatrack_budgets_v2',
  THEME: 'takatrack_theme_mode',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Firebase User Auth & Auto-Connection State
  const [user, setUser] = useState<User | null>(null);
  const [activeUserId, setActiveUserId] = useState<string>(() => getActiveUserId());
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'local_only'>('syncing');
  const [syncMessage, setSyncMessage] = useState<string>('Firebase ক্লাউড সার্বক্ষণিক সংযুক্ত');

  useEffect(() => {
    // 1. Health check verification
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    // 2. Silent background auto-connect (Zero clicks required)
    initAutoConnect().then((uid) => {
      if (uid) {
        setActiveUserId(uid);
      }
    });

    // 3. Listen to auth state transitions
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        setActiveUserId(currentUser.uid);
      } else {
        setActiveUserId(getActiveUserId());
      }
      setIsFirebaseConnected(true);
      setSyncStatus('synced');
      setSyncMessage('Firebase ক্লাউড সার্বক্ষণিক সংযুক্ত');
    });

    return () => unsubscribe();
  }, []);

  // Transactions State - defaults to clean empty array for real user entry
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      localStorage.removeItem('takatrack_transactions_v1');
    } catch {
      // ignore
    }
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
      }
    }
    return [];
  });

  // Budgets State - starts clean with no pre-filled numbers
  const [budgets, setBudgets] = useState<Record<string, MonthBudget>>(() => {
    if (typeof window === 'undefined') return INITIAL_BUDGET;
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Clear legacy hardcoded dummy budget 104500 so target starts completely blank as requested
          if (parsed['2026-10']?.overallTarget === 104500) {
            delete parsed['2026-10'];
          }
          if (parsed['2026-09']?.overallTarget === 104500) {
            delete parsed['2026-09'];
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse stored budgets:', e);
      }
    }
    return INITIAL_BUDGET;
  });

  // Sync with Firestore in real-time continuously using activeUserId (Zero button clicks required)
  useEffect(() => {
    if (!activeUserId) return;

    setSyncStatus('syncing');
    let isSubscribed = true;

    const unsubTxs = subscribeToUserTransactions(activeUserId, (firestoreTxs) => {
      if (!isSubscribed) return;

      setTransactions((prevLocal) => {
        if (firestoreTxs.length > 0) {
          const firestoreIds = new Set(firestoreTxs.map((t) => t.id));
          const unsyncedLocal = prevLocal.filter((t) => !firestoreIds.has(t.id));

          // If there are local transactions that haven't been saved to Firestore yet, upload them
          if (unsyncedLocal.length > 0) {
            unsyncedLocal.forEach((tx) => {
              saveTransactionToFirestore(activeUserId, tx).catch((err) => {
                console.error('Background sync transaction error:', err);
              });
            });
            return [...unsyncedLocal, ...firestoreTxs];
          }
          return firestoreTxs;
        } else {
          // Firestore is currently empty for this user: upload all current local transactions
          if (prevLocal.length > 0) {
            prevLocal.forEach((tx) => {
              saveTransactionToFirestore(activeUserId, tx).catch((err) => {
                console.error('Initial upload local tx error:', err);
              });
            });
          }
          return prevLocal;
        }
      });

      setSyncStatus('synced');
      setSyncMessage('Firebase ক্লাউড সার্বক্ষণিক সংযুক্ত');
    });

    const unsubBudgets = subscribeToUserBudgets(activeUserId, (firestoreBudgets) => {
      if (!isSubscribed) return;

      setBudgets((prevLocal) => {
        if (Object.keys(firestoreBudgets).length > 0) {
          return { ...prevLocal, ...firestoreBudgets };
        } else {
          // Firestore has no budgets yet: upload local budgets to Firestore
          Object.values(prevLocal).forEach((b) => {
            if (b && typeof b.overallTarget === 'number') {
              saveBudgetToFirestore(activeUserId, b).catch(console.error);
            }
          });
          return prevLocal;
        }
      });
    });

    return () => {
      isSubscribed = false;
      unsubTxs();
      unsubBudgets();
    };
  }, [activeUserId]);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to save budgets to localStorage', e);
    }
  }, [budgets]);

  // Current selected month: defaults to 'all' so users see ALL their money & transactions easily,
  // or can pick any specific month (e.g. "2026-10", "2026-09", etc.)
  const [currentMonth, setCurrentMonth] = useState<string>('all');

  // Compute available months including 'all' + distinct transaction months + current month
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    
    // Add real current date month
    const now = new Date();
    const realCurrentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    monthsSet.add(realCurrentMonth);
    monthsSet.add('2026-10');

    // Add transaction months
    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        monthsSet.add(tx.date.substring(0, 7));
      }
    });

    // Add budget months
    Object.keys(budgets).forEach((m) => {
      if (m !== 'all') monthsSet.add(m);
    });

    const sortedMonths = Array.from(monthsSet).sort().reverse();
    return ['all', ...sortedMonths];
  }, [transactions, budgets]);

  // Active budget object for selected month (or active cycle)
  const currentBudget = useMemo<MonthBudget>(() => {
    const now = new Date();
    const realCurrentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const targetMonth = currentMonth === 'all' ? realCurrentMonth : currentMonth;
    if (budgets[targetMonth]) {
      return budgets[targetMonth];
    }
    // Clean blank target by default: no pre-filled values
    return {
      monthYear: targetMonth,
      overallTarget: 0,
      categoryBudgets: {},
    };
  }, [budgets, currentMonth]);

  // Transactions belonging to selected timeframe (all or specific month)
  const monthlyTransactions = useMemo(() => {
    if (currentMonth === 'all') {
      return transactions;
    }
    return transactions.filter((tx) => tx.date && tx.date.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  // Aggregated Month-by-Month summary list for comparing all months side-by-side
  const monthlySummaries = useMemo<MonthlySummary[]>(() => {
    const map: Record<string, { income: number; expenses: number; count: number }> = {};
    
    transactions.forEach((tx) => {
      const m = tx.date && tx.date.length >= 7 ? tx.date.substring(0, 7) : 'Unknown';
      if (!map[m]) map[m] = { income: 0, expenses: 0, count: 0 };
      if (tx.type === 'income') {
        map[m].income += tx.amount;
      } else {
        map[m].expenses += tx.amount;
      }
      map[m].count += 1;
    });

    return Object.keys(map)
      .sort()
      .reverse()
      .map((m) => {
        const income = map[m].income;
        const expenses = map[m].expenses;
        const net = income - expenses;
        const rate = income > 0 ? (net / income) * 100 : 0;
        return {
          monthYear: m,
          displayName: formatMonthYear(m),
          totalIncome: income,
          totalExpenses: expenses,
          netSavings: net,
          savingsRate: rate,
          transactionCount: map[m].count,
        };
      });
  }, [transactions]);

  // Financial KPIs calculated in real-time
  const kpis = useMemo<FinancialKPIs>(() => {
    let income = 0;
    let expenses = 0;

    monthlyTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += Number(tx.amount) || 0;
      } else {
        expenses += Number(tx.amount) || 0;
      }
    });

    const netSavings = income - expenses;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
    const overallBudget = currentBudget.overallTarget || 0;
    const budgetUtilization = overallBudget > 0 ? (expenses / overallBudget) * 100 : 0;
    const remainingBudget = overallBudget - expenses;

    // Daily average calculation
    const elapsedDays = Math.max(1, new Set(monthlyTransactions.map((tx) => tx.date)).size);
    const dailyAverageExpense = expenses > 0 ? expenses / elapsedDays : 0;
    const projectedMonthEndExpense = dailyAverageExpense * 30;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netSavings,
      savingsRate,
      overallBudget,
      budgetUtilization,
      remainingBudget,
      dailyAverageExpense,
      projectedMonthEndExpense,
    };
  }, [monthlyTransactions, currentBudget]);

  // Category Summaries with warning trigger thresholds:
  // - < 80%: 'normal'
  // - 80% to 99%: 'warning'
  // - >= 100%: 'alert'
  const categorySummaries = useMemo<CategorySummary[]>(() => {
    const expenseMap: Record<string, { spent: number; count: number }> = {};

    monthlyTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        if (!expenseMap[tx.category]) {
          expenseMap[tx.category] = { spent: 0, count: 0 };
        }
        expenseMap[tx.category].spent += Number(tx.amount) || 0;
        expenseMap[tx.category].count += 1;
      }
    });

    // Merge with defined expense categories (including Baby Care & Milk, Bike & Fuel, etc.)
    const categories: CategorySummary[] = EXPENSE_CATEGORIES.map((cat) => {
      const spent = expenseMap[cat.name]?.spent || 0;
      const budget = currentBudget.categoryBudgets[cat.name] ?? 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      
      let status: 'normal' | 'warning' | 'alert' = 'normal';
      if (budget > 0) {
        if (percentage >= 100) {
          status = 'alert';
        } else if (percentage >= 80) {
          status = 'warning';
        }
      }

      return {
        category: cat.name,
        spent,
        budget,
        percentage,
        status,
        color: cat.color || CATEGORY_COLOR_MAP[cat.name] || '#94A3B8',
        transactionCount: expenseMap[cat.name]?.count || 0,
      };
    });

    // Custom categories
    Object.keys(expenseMap).forEach((catName) => {
      if (!categories.find((c) => c.category === catName)) {
        const spent = expenseMap[catName].spent;
        const budget = currentBudget.categoryBudgets[catName] || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 100;
        categories.push({
          category: catName,
          spent,
          budget,
          percentage,
          status: percentage >= 100 ? 'alert' : percentage >= 80 ? 'warning' : 'normal',
          color: CATEGORY_COLOR_MAP[catName] || '#64748B',
          transactionCount: expenseMap[catName].count,
        });
      }
    });

    return categories.sort((a, b) => b.spent - a.spent);
  }, [monthlyTransactions, currentBudget]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = useMemo(() => {
    let result = monthlyTransactions;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.category.toLowerCase().includes(q) ||
          (tx.notes && tx.notes.toLowerCase().includes(q)) ||
          tx.paymentMethod.toLowerCase().includes(q) ||
          tx.amount.toString().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((tx) => tx.category === categoryFilter);
    }

    // Payment method filter
    if (methodFilter !== 'all') {
      result = result.filter((tx) => tx.paymentMethod === methodFilter);
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  }, [monthlyTransactions, searchQuery, typeFilter, categoryFilter, methodFilter, sortBy, sortOrder]);

  // Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);
  const [initialModalCategory, setInitialModalCategory] = useState<string | undefined>(undefined);

  const openAddTxModal = (defaultType?: TransactionType, defaultCategory?: string) => {
    setTxToEdit(null);
    setInitialModalCategory(defaultCategory);
    setIsTxModalOpen(true);
  };

  const openEditTxModal = (tx: Transaction) => {
    setTxToEdit(tx);
    setInitialModalCategory(undefined);
    setIsTxModalOpen(true);
  };

  const closeTxModal = () => {
    setIsTxModalOpen(false);
    setTxToEdit(null);
    setInitialModalCategory(undefined);
  };

  // Transaction CRUD operations - writes directly to Firestore in real-time
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTransactions((prev) => [newTx, ...prev]);

    // Save directly to Firestore with active persistent user ID
    if (activeUserId) {
      saveTransactionToFirestore(activeUserId, newTx).catch((err) => {
        console.error('Failed to sync transaction to Firestore:', err);
      });
    }
  };

  // 1-Click Quick Expense logger (e.g. Baby Milk, Bike Fuel)
  const addQuickExpense = (category: string, amount: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    addTransaction({
      date: today,
      type: 'expense',
      category,
      amount,
      paymentMethod: 'bKash/Nagad',
      isRecurring: false,
      notes: notes || `${category} quick entry`,
    });
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    let updatedTx: Transaction | null = null;
    setTransactions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedTx = {
            ...item,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          return updatedTx;
        }
        return item;
      })
    );

    if (activeUserId && updatedTx) {
      saveTransactionToFirestore(activeUserId, updatedTx).catch(console.error);
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    if (activeUserId) {
      deleteTransactionFromFirestore(activeUserId, id).catch(console.error);
    }
  };

  // Budget Operations
  const updateOverallTarget = (
    target: number,
    options?: {
      autoDistribute?: boolean;
      targetMonth?: string;
      applyToAllMonths?: boolean;
    }
  ) => {
    const targetMonth = options?.targetMonth || (currentMonth === 'all' ? '2026-10' : currentMonth);
    const validTarget = Math.max(0, target);

    setBudgets((prev) => {
      const existing = prev[targetMonth] || currentBudget;
      let newCategoryBudgets = { ...existing.categoryBudgets };

      // Optional auto-distribution proportionally to all active expense categories
      if (options?.autoDistribute && validTarget > 0) {
        const catEntries = EXPENSE_CATEGORIES.map((c) => ({
          name: c.name,
          current: existing.categoryBudgets[c.name] ?? c.defaultBudget,
        }));
        const totalCurrent = catEntries.reduce((acc, c) => acc + c.current, 0);
        const ratio = totalCurrent > 0 ? validTarget / totalCurrent : 1;
        let distributedSum = 0;

        catEntries.forEach((c, idx) => {
          if (idx === catEntries.length - 1) {
            newCategoryBudgets[c.name] = Math.max(0, validTarget - distributedSum);
          } else {
            const scaled = Math.max(0, Math.round((c.current * ratio) / 50) * 50);
            newCategoryBudgets[c.name] = scaled;
            distributedSum += scaled;
          }
        });
      }

      const updated: MonthBudget = {
        ...existing,
        monthYear: targetMonth,
        overallTarget: validTarget,
        categoryBudgets: newCategoryBudgets,
      };

      if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);

      const nextBudgets: Record<string, MonthBudget> = {
        ...prev,
        [targetMonth]: updated,
      };

      if (options?.applyToAllMonths) {
        Object.keys(prev).forEach((m) => {
          if (m !== targetMonth) {
            nextBudgets[m] = {
              ...prev[m],
              monthYear: m,
              overallTarget: validTarget,
              categoryBudgets: { ...newCategoryBudgets },
            };
            if (activeUserId) saveBudgetToFirestore(activeUserId, nextBudgets[m]).catch(console.error);
          }
        });
      }

      return nextBudgets;
    });
  };

  const distributeOverallTargetToCategories = (targetMonthInput?: string) => {
    const targetMonth = targetMonthInput || (currentMonth === 'all' ? '2026-10' : currentMonth);
    setBudgets((prev) => {
      const existing = prev[targetMonth] || currentBudget;
      const target = existing.overallTarget;
      if (target <= 0) return prev;

      const catEntries = EXPENSE_CATEGORIES.map((c) => ({
        name: c.name,
        current: existing.categoryBudgets[c.name] ?? c.defaultBudget,
      }));
      const totalCurrent = catEntries.reduce((acc, c) => acc + c.current, 0);
      const ratio = totalCurrent > 0 ? target / totalCurrent : 1;
      const newCategoryBudgets: Record<string, number> = {};
      let distributedSum = 0;

      catEntries.forEach((c, idx) => {
        if (idx === catEntries.length - 1) {
          newCategoryBudgets[c.name] = Math.max(0, target - distributedSum);
        } else {
          const scaled = Math.max(0, Math.round((c.current * ratio) / 50) * 50);
          newCategoryBudgets[c.name] = scaled;
          distributedSum += scaled;
        }
      });

      const updated: MonthBudget = {
        ...existing,
        monthYear: targetMonth,
        overallTarget: target,
        categoryBudgets: newCategoryBudgets,
      };

      if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);

      return {
        ...prev,
        [targetMonth]: updated,
      };
    });
  };

  const syncTargetFromCategories = (targetMonthInput?: string) => {
    const targetMonth = targetMonthInput || (currentMonth === 'all' ? '2026-10' : currentMonth);
    setBudgets((prev) => {
      const existing = prev[targetMonth] || currentBudget;
      const totalSum = EXPENSE_CATEGORIES.reduce((acc, cat) => {
        const val = existing.categoryBudgets[cat.name] ?? cat.defaultBudget;
        return acc + val;
      }, 0);

      const updated: MonthBudget = {
        ...existing,
        monthYear: targetMonth,
        overallTarget: totalSum,
      };

      if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);

      return {
        ...prev,
        [targetMonth]: updated,
      };
    });
  };

  const updateCategoryLimit = (category: string, limit: number, targetMonthInput?: string) => {
    const targetMonth = targetMonthInput || (currentMonth === 'all' ? '2026-10' : currentMonth);
    setBudgets((prev) => {
      const existing = prev[targetMonth] || currentBudget;
      const updatedCategories = {
        ...existing.categoryBudgets,
        [category]: Math.max(0, limit),
      };
      const updated: MonthBudget = {
        ...existing,
        monthYear: targetMonth,
        categoryBudgets: updatedCategories,
      };
      if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);
      return {
        ...prev,
        [targetMonth]: updated,
      };
    });
  };

  const copyBudgetFromPreviousMonth = (targetMonthInput?: string): boolean => {
    const targetMonth = targetMonthInput || (currentMonth === 'all' ? '2026-10' : currentMonth);
    const [year, month] = targetMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const prevBudget = budgets[prevMonthStr];
    if (!prevBudget) return false;

    const updated: MonthBudget = {
      monthYear: targetMonth,
      overallTarget: prevBudget.overallTarget,
      categoryBudgets: { ...prevBudget.categoryBudgets },
    };

    setBudgets((prev) => ({
      ...prev,
      [targetMonth]: updated,
    }));

    if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);
    return true;
  };

  const resetCurrentMonthBudget = (targetMonthInput?: string) => {
    const targetMonth = targetMonthInput || (currentMonth === 'all' ? '2026-10' : currentMonth);
    const updated: MonthBudget = {
      monthYear: targetMonth,
      overallTarget: 0,
      categoryBudgets: {},
    };

    setBudgets((prev) => ({
      ...prev,
      [targetMonth]: updated,
    }));

    if (activeUserId) saveBudgetToFirestore(activeUserId, updated).catch(console.error);
  };

  // Export CSV
  const exportCSV = () => {
    const csvData = generateCSV(filteredTransactions.length > 0 ? filteredTransactions : transactions);
    triggerFileDownload(csvData, `TakaTrack_Report_${currentMonth}.csv`, 'text/csv;charset=utf-8;');
  };

  // Export JSON Backup
  const exportJSONBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      transactions,
      budgets,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    triggerFileDownload(jsonStr, `TakaTrack_Backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // Import JSON Backup
  const importJSONBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && Array.isArray(parsed.transactions)) {
        setTransactions(parsed.transactions);
        if (parsed.budgets && typeof parsed.budgets === 'object') {
          setBudgets(parsed.budgets);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse backup JSON:', e);
      return false;
    }
  };

  // Clear all transactions completely for a fresh clean slate
  const clearAllTransactions = () => {
    setTransactions([]);
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    } catch (e) {
      console.error('Failed to clear stored transactions:', e);
    }
  };

  // Load sample demo data if explicitly requested
  const loadDemoData = () => {
    setTransactions(SAMPLE_DEMO_TRANSACTIONS);
    setCurrentMonth('all');
  };

  // Reset to clean default state
  const resetToDefaultData = () => {
    setTransactions([]);
    setBudgets(INITIAL_BUDGET);
    setCurrentMonth('all');
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error('Google Sign-In Error:', e);
      setSyncStatus('error');
      setSyncMessage('Google লগইন ব্যর্থ হয়েছে');
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutUser();
      setSyncStatus('local_only');
      setSyncMessage('লগআউট করা হয়েছে। ডেটা লোকাল ব্রাউজারে সংরক্ষিত।');
    } catch (e) {
      console.error('Google Sign-Out Error:', e);
    }
  };

  const forceCloudSync = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Firebase ক্লাউডে আপলোড হচ্ছে...');
      const { txCount, budgetCount } = await syncLocalToFirestore(activeUserId, transactions, budgets);
      setSyncStatus('synced');
      setSyncMessage(`${txCount} টি লেনদেন এবং ${budgetCount} টি বাজেট Firebase-এ সিঙ্ক হয়েছে`);
    } catch (e) {
      console.error('Manual sync failed:', e);
      setSyncStatus('error');
      setSyncMessage('ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে');
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        currentMonth,
        setCurrentMonth,
        availableMonths,
        monthlyTransactions,
        monthlySummaries,
        kpis,
        categorySummaries,
        currentBudget,
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        categoryFilter,
        setCategoryFilter,
        methodFilter,
        setMethodFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        filteredTransactions,
        addTransaction,
        addQuickExpense,
        updateTransaction,
        deleteTransaction,
        updateOverallTarget,
        updateCategoryLimit,
        distributeOverallTargetToCategories,
        syncTargetFromCategories,
        copyBudgetFromPreviousMonth,
        resetCurrentMonthBudget,
        isTxModalOpen,
        txToEdit,
        openAddTxModal,
        openEditTxModal,
        closeTxModal,
        exportCSV,
        exportJSONBackup,
        importJSONBackup,
        clearAllTransactions,
        loadDemoData,
        resetToDefaultData,
        user,
        activeUserId,
        signInWithGoogle: handleGoogleSignIn,
        signOut: handleGoogleSignOut,
        isFirebaseConnected,
        syncStatus,
        syncMessage,
        forceCloudSync,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
