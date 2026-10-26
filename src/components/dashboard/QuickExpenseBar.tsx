import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT } from '../../utils/formatters';
import { Zap, Check, Plus } from 'lucide-react';

export const QuickExpenseBar: React.FC = () => {
  const { addQuickExpense, openAddTxModal, monthlyTransactions } = useFinance();
  const [successToast, setSuccessToast] = useState<{ title: string; amount: number } | null>(null);

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
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            দ্রুত খরচ এন্ট্রি
          </h3>
        </div>

        {successToast && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 px-2.5 py-0.5 rounded-full animate-fade-in">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>যোগ হয়েছে: {formatBDT(successToast.amount)}</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        
        {/* Baby Care */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-sky-50 to-white dark:from-[#081b2b] dark:to-[#060e18] border border-sky-200/80 dark:border-sky-800/60 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍼</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  বাচ্চার দুধ
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  মোট: <strong className="text-sky-600 dark:text-sky-400">{formatBDT(babySpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Baby Care & Milk')}
              className="p-1 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[350, 500, 1000, 1500].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('Baby Care & Milk', amt, `দুধ ৳${amt}`)}
                className="py-1 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-sky-950/60 hover:bg-sky-500 hover:text-white text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800 rounded-lg transition-colors cursor-pointer"
              >
                ৳{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Bike & Fuel */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-orange-50 to-white dark:from-[#261607] dark:to-[#100903] border border-orange-200/80 dark:border-orange-800/60 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏍️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  বাইক ও ফুয়েল
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  মোট: <strong className="text-orange-600 dark:text-orange-400">{formatBDT(bikeSpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Bike & Fuel')}
              className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[200, 300, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('Bike & Fuel', amt, `অকটেন ৳${amt}`)}
                className="py-1 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-orange-950/60 hover:bg-orange-500 hover:text-white text-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800 rounded-lg transition-colors cursor-pointer"
              >
                ৳{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Groceries */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-emerald-50 to-white dark:from-[#062016] dark:to-[#040e0a] border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛒</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  বাজার ও সদাই
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  মোট: <strong className="text-emerald-600 dark:text-emerald-400">{formatBDT(grocerySpent)}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddTxModal('expense', 'Groceries')}
              className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[300, 500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('Groceries', amt, `বাজার ৳${amt}`)}
                className="py-1 px-1 text-center text-xs font-mono font-bold bg-white dark:bg-emerald-950/60 hover:bg-emerald-500 hover:text-white text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer"
              >
                ৳{amt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
