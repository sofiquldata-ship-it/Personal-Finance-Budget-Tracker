import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent, formatDate } from '../../utils/formatters';
import { BarChart3, CreditCard, Flame, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { monthlyTransactions, kpis } = useFinance();

  const paymentBreakdown: Record<string, { count: number; spent: number }> = {
    Cash: { count: 0, spent: 0 },
    Card: { count: 0, spent: 0 },
    'bKash/Nagad': { count: 0, spent: 0 },
    'Bank Transfer': { count: 0, spent: 0 },
  };

  monthlyTransactions.forEach((tx) => {
    if (tx.type === 'expense') {
      if (!paymentBreakdown[tx.paymentMethod]) {
        paymentBreakdown[tx.paymentMethod] = { count: 0, spent: 0 };
      }
      paymentBreakdown[tx.paymentMethod].spent += tx.amount;
      paymentBreakdown[tx.paymentMethod].count += 1;
    }
  });

  const topExpenses = [...monthlyTransactions]
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const incomeSources: Record<string, number> = {};
  monthlyTransactions.forEach((tx) => {
    if (tx.type === 'income') {
      incomeSources[tx.category] = (incomeSources[tx.category] || 0) + tx.amount;
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            খরচ ও আর্থিক বিশ্লেষণ
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Payment Channels Breakdown */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                পেমেন্ট মাধ্যম বণ্টন
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              মোট {formatBDT(kpis.totalExpenses)}
            </span>
          </div>

          <div className="mt-3.5 space-y-3">
            {Object.entries(paymentBreakdown).map(([method, data]) => {
              const fraction = kpis.totalExpenses > 0 ? (data.spent / kpis.totalExpenses) * 100 : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {method} <span className="text-slate-400 text-[10px]">({data.count})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatBDT(data.spent)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
                        {formatPercent(fraction)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, fraction)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Largest Expenditures */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                শীর্ষ ব্যয়সমূহ
              </h3>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {topExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">কোনো খরচ রেকর্ড নেই</p>
            ) : (
              topExpenses.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tx.category}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {tx.notes || formatDate(tx.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                      {formatBDT(tx.amount)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {formatDate(tx.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Income Sources Composition */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                আয়ের উৎস
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +{formatBDT(kpis.totalIncome)}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {Object.keys(incomeSources).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">কোনো আয় রেকর্ড নেই</p>
            ) : (
              Object.entries(incomeSources).map(([source, amount]) => {
                const fraction = kpis.totalIncome > 0 ? (amount / kpis.totalIncome) * 100 : 0;
                return (
                  <div key={source} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{source}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[10px]">{formatPercent(fraction)}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatBDT(amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Financial Discipline & Health Checklist */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              সারসংক্ষেপ সূচক
            </h3>
          </div>

          <div className="mt-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">সঞ্চয়ের হার:</span>
              <span className={`font-mono font-bold ${kpis.savingsRate >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                {formatPercent(kpis.savingsRate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">বাজেট ব্যবহার:</span>
              <span className={`font-mono font-bold ${kpis.budgetUtilization <= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                {formatPercent(kpis.budgetUtilization)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">দৈনিক গড় খরচ:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatBDT(kpis.dailyAverageExpense)}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
