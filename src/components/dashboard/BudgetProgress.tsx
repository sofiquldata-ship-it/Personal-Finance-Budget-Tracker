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

  const isBudgetConfigured = (currentBudget.overallTarget || 0) > 0;

  // Categories that have a budget set
  const activeCategories = categorySummaries.filter((item) => item.budget > 0 || item.spent > 0);
  const overspentCount = categorySummaries.filter((c) => c.budget > 0 && c.status === 'alert' && c.spent > 0).length;
  const warningCount = categorySummaries.filter((c) => c.budget > 0 && c.status === 'warning').length;

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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>বাজেট অগ্রগতি</span>
          </h2>
          {isBudgetConfigured && (
            overspentCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-3 h-3" />
                <span>{overspentCount} বাজেট অতিক্রম</span>
              </span>
            ) : warningCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-3 h-3" />
                <span>{warningCount} সীমার কাছাকাছি</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>সীমার মধ্যে</span>
              </span>
            )
          )}
        </div>

        {onNavigateToBudgetSettings && (
          <button
            onClick={onNavigateToBudgetSettings}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>টার্গেট সেট</span>
          </button>
        )}
      </div>

      {/* Target Status / Progress Bar */}
      {!isBudgetConfigured ? (
        <div className="py-6 text-center space-y-2.5">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              এই মাসের বাজেট টার্গেট এখনও সেট করা হয়নি
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              খরচ নিয়ন্ত্রণে রাখতে নিজের মাসিক টার্গেট নির্ধারণ করুন
            </p>
          </div>
          {onNavigateToBudgetSettings && (
            <button
              onClick={onNavigateToBudgetSettings}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>টার্গেট সেট করুন</span>
            </button>
          )}
        </div>
      ) : (
        <div className="pt-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              টার্গেট: <strong className="font-mono text-slate-900 dark:text-white">{formatBDT(currentBudget.overallTarget)}</strong>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {formatPercent(kpis.budgetUtilization)} ({formatBDT(kpis.totalExpenses)} খরচ)
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
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

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            <span>
              {kpis.remainingBudget >= 0
                ? `অবশিষ্ট: ${formatBDT(kpis.remainingBudget)}`
                : `অতিরিক্ত: ${formatBDT(Math.abs(kpis.remainingBudget))}`}
            </span>
            <span className="font-mono text-slate-400">
              দৈনিক গড়: {formatBDT(kpis.dailyAverageExpense)}
            </span>
          </div>
        </div>
      )}

      {/* Category-Wise Progress Bars */}
      {isBudgetConfigured && activeCategories.length > 0 && (
        <div className="pt-3 space-y-2.5">
          {activeCategories.slice(0, 5).map((item) => {
            const isOver = item.status === 'alert';
            const isWarn = item.status === 'warning';

            return (
              <div
                key={item.category}
                className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{getCategoryIcon(item.category)}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                      {formatBDT(item.spent)}
                    </span>
                    {item.budget > 0 && (
                      <span className="text-slate-400 text-[10px] font-mono">
                        / {formatBDT(item.budget)}
                      </span>
                    )}
                  </div>
                </div>

                {item.budget > 0 && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : isWarn
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
