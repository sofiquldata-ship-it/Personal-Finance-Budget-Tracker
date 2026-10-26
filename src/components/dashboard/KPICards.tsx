import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Gauge,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

export const KPICards: React.FC = () => {
  const { kpis, monthlyTransactions, currentMonth } = useFinance();

  const isPositiveSavings = kpis.netSavings >= 0;
  const isBudgetExceeded = kpis.budgetUtilization >= 100;
  const isBudgetWarning = kpis.budgetUtilization >= 80 && !isBudgetExceeded;

  // Transaction counts by type
  const incomeCount = monthlyTransactions.filter((tx) => tx.type === 'income').length;
  const expenseCount = monthlyTransactions.filter((tx) => tx.type === 'expense').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Monthly Income */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Inflow (মোট আয়)
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatBDT(kpis.totalIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-medium">{incomeCount} streams</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Inflow</span>
          </div>
        </div>
      </div>

      {/* 2. Total Monthly Expenses */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Outflow (মোট ব্যয়)
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatBDT(kpis.totalExpenses)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-medium">{expenseCount} debits</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              Avg {formatBDT(kpis.dailyAverageExpense)}/day
            </span>
          </div>
        </div>
      </div>

      {/* 3. Net Savings / Balance */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Net Savings (সঞ্চয়)
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              isPositiveSavings
                ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPositiveSavings ? <PiggyBank className="w-4 h-4 stroke-[2.5]" /> : <Wallet className="w-4 h-4 stroke-[2.5]" />}
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
              isPositiveSavings
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatBDT(kpis.netSavings, { showSign: true })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Income − Expenses</span>
            <span aria-hidden="true">·</span>
            <span className={isPositiveSavings ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
              {isPositiveSavings ? 'Surplus Positive' : 'Deficit Alert'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Budget Utilization Gauge */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Budget Burn (বাজেট ব্যবহার)
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Gauge className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatPercent(kpis.budgetUtilization)}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Target: <span className="font-semibold text-slate-800 dark:text-slate-200">100%</span>
            </div>
          </div>

          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBudgetExceeded
                  ? 'bg-rose-500'
                  : isBudgetWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, kpis.budgetUtilization))}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {kpis.remainingBudget >= 0
                ? `${formatBDT(kpis.remainingBudget)} remaining`
                : `${formatBDT(Math.abs(kpis.remainingBudget))} over budget`}
            </span>
            {isBudgetExceeded && (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Overspent
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
