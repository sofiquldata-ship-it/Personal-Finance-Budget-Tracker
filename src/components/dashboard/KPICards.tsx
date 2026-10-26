import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import {
  Wallet,
  PiggyBank,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const KPICards: React.FC = () => {
  const { kpis, monthlyTransactions } = useFinance();

  const isPositiveSavings = kpis.netSavings >= 0;
  const isBudgetConfigured = kpis.overallBudget > 0;
  const isBudgetExceeded = isBudgetConfigured && kpis.budgetUtilization >= 100;
  const isBudgetWarning = isBudgetConfigured && kpis.budgetUtilization >= 80 && !isBudgetExceeded;

  const incomeCount = monthlyTransactions.filter((tx) => tx.type === 'income').length;
  const expenseCount = monthlyTransactions.filter((tx) => tx.type === 'expense').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      
      {/* 1. Total Monthly Income */}
      <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            মোট আয়
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5">
          <div className="text-base sm:text-xl lg:text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white truncate">
            {formatBDT(kpis.totalIncome)}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-mono">
            {incomeCount} টি এন্ট্রি
          </div>
        </div>
      </div>

      {/* 2. Total Monthly Expenses */}
      <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            মোট ব্যয়
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5">
          <div className="text-base sm:text-xl lg:text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white truncate">
            {formatBDT(kpis.totalExpenses)}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-mono">
            {expenseCount} টি এন্ট্রি
          </div>
        </div>
      </div>

      {/* 3. Net Savings */}
      <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            সঞ্চয়
          </span>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold ${
              isPositiveSavings
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPositiveSavings ? <PiggyBank className="w-3.5 h-3.5 stroke-[2.5]" /> : <Wallet className="w-3.5 h-3.5 stroke-[2.5]" />}
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-base sm:text-xl lg:text-2xl font-extrabold font-mono tabular-nums truncate ${
              isPositiveSavings
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatBDT(kpis.netSavings, { showSign: true })}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-mono">
            {formatPercent(kpis.savingsRate)} সঞ্চয় হার
          </div>
        </div>
      </div>

      {/* 4. Budget Utilization */}
      <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            বাজেট ব্যবহার
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Gauge className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-2 sm:mt-2.5">
          {isBudgetConfigured ? (
            <>
              <div className="flex items-baseline justify-between">
                <div className="text-base sm:text-xl lg:text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white truncate">
                  {formatPercent(kpis.budgetUtilization)}
                </div>
              </div>

              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isBudgetExceeded
                      ? 'bg-rose-500'
                      : isBudgetWarning
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, kpis.budgetUtilization))}%` }}
                />
              </div>

              <div className="mt-1 text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                {kpis.remainingBudget >= 0
                  ? `${formatBDT(kpis.remainingBudget)} বাকি`
                  : `${formatBDT(Math.abs(kpis.remainingBudget))} অতিরিক্ত`}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                টার্গেট সেট নেই
              </div>
              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5" />
              <div className="mt-1 text-[10px] text-slate-400">
                বাজেট ট্যাব থেকে সেট করুন
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
