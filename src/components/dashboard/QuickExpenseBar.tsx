import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT } from '../../utils/formatters';
import { Zap, Check, Fuel, Baby, ShoppingCart, Plus, Smartphone, Sparkles } from 'lucide-react';

export const QuickExpenseBar: React.FC = () => {
  const { addQuickExpense, openAddTxModal, monthlyTransactions } = useFinance();
  const [successToast, setSuccessToast] = useState<{ title: string; amount: number } | null>(null);

  // Calculate spent this cycle
  const babySpent = monthlyTransactions
    .filter((tx) => tx.type === 'expense' && tx.category === 'Baby Care & Milk')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const bikeSpent = monthlyTransactions
    .filter((tx) => tx.type === 'expense' && tx.category === 'Bike & Fuel')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const grocerySpent = monthlyTransactions
    .filter((tx) => tx.type === 'expense' && tx.category === 'Groceries')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleQuickAdd = (category: string, amount: number, label: string) => {
    addQuickExpense(category, amount, label);
    setSuccessToast({ title: label, amount });
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-3">
      {/* Header Label & Success feedback */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Fast Daily Tracking Station (দ্রুত ১-ক্লিক এন্ট্রি ডক)</span>
          </h3>
        </div>

        {successToast && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full animate-fade-in shadow-sm">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>যোগ হয়েছে: {successToast.title} ({formatBDT(successToast.amount)})</span>
          </div>
        )}
      </div>

      {/* Grid of Interactive Quick Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Baby Care & Milk Station */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-sky-50 via-white to-sky-100/40 dark:from-[#081b2b] dark:via-[#091522] dark:to-[#060e18] border border-sky-200/90 dark:border-sky-800/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl shadow-xs">
                🍼
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>বাচ্চার দুধ (Baby Milk & Care)</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  মোট খরচ: <strong className="text-sky-600 dark:text-sky-400 font-bold">{formatBDT(babySpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Baby Care & Milk')}
              className="p-1.5 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-lg transition-colors cursor-pointer"
              title="Add custom baby care expense"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleQuickAdd('Baby Care & Milk', 350, 'Liquid Milk / তরল দুধ')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-sky-950/70 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 text-sky-900 dark:text-sky-200 border border-sky-200/80 dark:border-sky-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳350
            </button>
            <button
              onClick={() => handleQuickAdd('Baby Care & Milk', 500, 'Baby Milk / দুধ')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-sky-950/70 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 text-sky-900 dark:text-sky-200 border border-sky-200/80 dark:border-sky-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳500
            </button>
            <button
              onClick={() => handleQuickAdd('Baby Care & Milk', 1000, 'Formula Milk / গুঁড়ো দুধ')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-sky-950/70 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 text-sky-900 dark:text-sky-200 border border-sky-200/80 dark:border-sky-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳1,000
            </button>
            <button
              onClick={() => handleQuickAdd('Baby Care & Milk', 1500, 'Diapers / বেবি কেয়ার')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-sky-950/70 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 text-sky-900 dark:text-sky-200 border border-sky-200/80 dark:border-sky-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳1,500
            </button>
          </div>
        </div>

        {/* Card 2: Bike & Fuel Station */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-orange-50 via-white to-amber-100/40 dark:from-[#261607] dark:via-[#191007] dark:to-[#100903] border border-orange-200/90 dark:border-orange-800/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl shadow-xs">
                🏍️
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>বাইক ফুয়েল (Bike Octane & Fuel)</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  মোট খরচ: <strong className="text-orange-600 dark:text-orange-400 font-bold">{formatBDT(bikeSpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Bike & Fuel')}
              className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 rounded-lg transition-colors cursor-pointer"
              title="Add custom bike expense or servicing"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleQuickAdd('Bike & Fuel', 200, 'Bike Octane refill ৳200')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-orange-950/70 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-orange-900 dark:text-orange-200 border border-orange-200/80 dark:border-orange-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳200
            </button>
            <button
              onClick={() => handleQuickAdd('Bike & Fuel', 300, 'Bike Octane refill ৳300')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-orange-950/70 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-orange-900 dark:text-orange-200 border border-orange-200/80 dark:border-orange-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳300
            </button>
            <button
              onClick={() => handleQuickAdd('Bike & Fuel', 500, 'Bike Octane refill ৳500')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-orange-950/70 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-orange-900 dark:text-orange-200 border border-orange-200/80 dark:border-orange-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳500
            </button>
            <button
              onClick={() => handleQuickAdd('Bike & Fuel', 1000, 'Bike Full Tank / সার্ভিস ৳1000')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-orange-950/70 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-orange-900 dark:text-orange-200 border border-orange-200/80 dark:border-orange-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳1,000
            </button>
          </div>
        </div>

        {/* Card 3: Daily Market & Groceries Station */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-100/40 dark:from-[#062016] dark:via-[#081811] dark:to-[#040e0a] border border-emerald-200/90 dark:border-emerald-800/70 shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl shadow-xs">
                🛒
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>কাঁচাবাজার ও সদাই (Groceries)</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  মোট খরচ: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatBDT(grocerySpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Groceries')}
              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
              title="Add custom grocery expense"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleQuickAdd('Groceries', 500, 'Daily Market / বাজার ৳500')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-emerald-950/70 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳500
            </button>
            <button
              onClick={() => handleQuickAdd('Groceries', 1000, 'Weekly Groceries / সদাই ৳1000')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-emerald-950/70 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳1,000
            </button>
            <button
              onClick={() => handleQuickAdd('Groceries', 2000, 'Large Pantry / মাসের বাজার ৳2000')}
              className="py-2 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-emerald-950/70 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              ৳2,000
            </button>
            <button
              onClick={() => openAddTxModal('expense', 'Groceries')}
              className="py-2 px-1 text-center text-xs font-sans font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl transition-colors cursor-pointer"
            >
              Custom+
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
