import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';

export const CashFlowComparison: React.FC = () => {
  const { kpis, monthlyTransactions } = useFinance();

  const total = Math.max(kpis.totalIncome, kpis.totalExpenses, 1);
  const incomeWidth = Math.min(100, (kpis.totalIncome / total) * 100);
  const expenseWidth = Math.min(100, (kpis.totalExpenses / total) * 100);

  // Recurring vs One-off breakdown
  const recurringExpense = monthlyTransactions
    .filter((tx) => tx.type === 'expense' && tx.isRecurring)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const oneOffExpense = kpis.totalExpenses - recurringExpense;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            ক্যাশ ফ্লো তুলনা (Cash Flow & Ratio)
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Ratio: {kpis.totalIncome > 0 ? (kpis.totalExpenses / kpis.totalIncome).toFixed(2) : '0'}x
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Income bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Total Inflow (মোট আয়)</span>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {formatBDT(kpis.totalIncome)}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${incomeWidth}%` }}
            />
          </div>
        </div>

        {/* Expenses bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Total Outflow (মোট ব্যয়)</span>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {formatBDT(kpis.totalExpenses)}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${expenseWidth}%` }}
            />
          </div>
        </div>

        {/* Detailed expense composition */}
        <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              Fixed / Recurring Commitments (স্থায়ী খরচ)
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {formatBDT(recurringExpense)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
              {kpis.totalExpenses > 0 ? formatPercent((recurringExpense / kpis.totalExpenses) * 100) : '0%'} of expenses
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              Daily & One-Off Spend (দৈনিক ও অপ্রত্যাশিত)
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {formatBDT(oneOffExpense)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
              {kpis.totalExpenses > 0 ? formatPercent((oneOffExpense / kpis.totalExpenses) * 100) : '0%'} of expenses
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
