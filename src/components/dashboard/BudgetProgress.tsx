import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronRight, SlidersHorizontal, Target } from 'lucide-react';

interface BudgetProgressProps {
  onNavigateToBudgetSettings?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  onNavigateToBudgetSettings,
  onSelectCategory,
}) => {
  const { kpis, categorySummaries, currentBudget } = useFinance();

  // Categories that have either a budget or spent amount
  const activeCategories = categorySummaries.filter(
    (item) => item.budget > 0 || item.spent > 0
  );

  const overspentCount = categorySummaries.filter((c) => c.status === 'alert' && c.spent > 0).length;
  const warningCount = categorySummaries.filter((c) => c.status === 'warning').length;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Baby Care & Milk':
        return '🍼';
      case 'Bike & Fuel':
        return '🏍️';
      case 'Groceries':
        return '🛒';
      case 'House Rent':
        return '🏠';
      case 'Utilities':
        return '⚡';
      case 'Healthcare':
        return '🩺';
      case 'Dining':
        return '🍽️';
      default:
        return '🏷️';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>বাজেট লিমিট ও সতর্কতা (Budget Health)</span>
            </h2>
            {overspentCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{overspentCount} Over Limit</span>
              </span>
            ) : warningCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{warningCount} Near Limit</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All within limits</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ৮০% খরচে ওয়ার্নিং হলুদ এবং ১০০%+ এ লাল ওভারস্পেন্ডিং সতর্কতা
          </p>
        </div>

        {onNavigateToBudgetSettings && (
          <button
            onClick={onNavigateToBudgetSettings}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>টার্গেট পরিবর্তন (Adjust)</span>
          </button>
        )}
      </div>

      {/* Overall Spend Progress Bar */}
      <div className="pt-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            মোট মাসিক বাজেট টার্গেট: <strong className="font-mono text-slate-900 dark:text-white font-bold">{formatBDT(currentBudget.overallTarget)}</strong>
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {formatPercent(kpis.budgetUtilization)} ({formatBDT(kpis.totalExpenses)} খরচ)
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              kpis.budgetUtilization >= 100
                ? 'bg-rose-500'
                : kpis.budgetUtilization >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, kpis.budgetUtilization))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
          <span>
            {kpis.remainingBudget >= 0
              ? `বাকি আছে: ${formatBDT(kpis.remainingBudget)}`
              : `বাজেট ছাড়িয়েছে: ${formatBDT(Math.abs(kpis.remainingBudget))}`}
          </span>
          <span className="font-mono text-slate-400">
            {kpis.projectedMonthEndExpense > 0 && `Projected End: ${formatBDT(kpis.projectedMonthEndExpense)}`}
          </span>
        </div>
      </div>

      {/* Category-Wise Progress Bars */}
      <div className="pt-4 space-y-3.5">
        {activeCategories.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            এই মাসে এখনও কোনো ক্যাটাগরির খরচ বা বাজেট এন্ট্রি করা হয়নি।
          </div>
        ) : (
          activeCategories.map((item) => {
            const isOver = item.status === 'alert';
            const isWarn = item.status === 'warning';
            const remaining = item.budget - item.spent;

            return (
              <div
                key={item.category}
                className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base shrink-0">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">
                      ({item.transactionCount} tx)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatBDT(item.spent)}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1">
                        / {formatBDT(item.budget)}
                      </span>
                    </div>

                    {isOver ? (
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full">
                        {formatPercent(item.percentage)} Alert
                      </span>
                    ) : isWarn ? (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full">
                        {formatPercent(item.percentage)} Warn
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                        {formatPercent(item.percentage)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-rose-500'
                        : isWarn
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                  />
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  <span>
                    {remaining >= 0 ? (
                      `৳${remaining.toLocaleString('en-IN')} অবশিষ্ট`
                    ) : (
                      <strong className="text-rose-600 dark:text-rose-400 font-bold">
                        অতিরিক্ত খরচ ৳{Math.abs(remaining).toLocaleString('en-IN')}
                      </strong>
                    )}
                  </span>

                  {onSelectCategory && (
                    <button
                      onClick={() => onSelectCategory(item.category)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-0.5 transition-opacity cursor-pointer"
                    >
                      <span>লেনদেন ফিল্টার</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
