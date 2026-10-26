import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent, formatDate } from '../../utils/formatters';
import { BarChart3, CreditCard, Flame, ArrowUpRight, ArrowDownLeft, ShieldCheck, Wallet } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { monthlyTransactions, kpis, currentMonth } = useFinance();

  // Payment method distribution
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

  // Top 5 largest individual expenses
  const topExpenses = [...monthlyTransactions]
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Income sources breakdown
  const incomeSources: Record<string, number> = {};
  monthlyTransactions.forEach((tx) => {
    if (tx.type === 'income') {
      incomeSources[tx.category] = (incomeSources[tx.category] || 0) + tx.amount;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Financial Insights & Outflow Analysis
          </h2>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Detailed metrics, payment method distributions, and top expenditure drivers for {currentMonth}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Channels Breakdown */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Payment Channel Distribution
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Total {formatBDT(kpis.totalExpenses)}
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {Object.entries(paymentBreakdown).map(([method, data]) => {
              const fraction = kpis.totalExpenses > 0 ? (data.spent / kpis.totalExpenses) * 100 : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {method} <span className="text-neutral-400 text-[11px]">({data.count} txs)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {formatBDT(data.spent)}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 w-12 text-right">
                        {formatPercent(fraction)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, fraction)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Largest Expenditures */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Top 5 High-Value Outflows
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Ranked by BDT</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {topExpenses.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No expense entries logged</p>
            ) : (
              topExpenses.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {tx.category}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {tx.notes || formatDate(tx.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {formatBDT(tx.amount)}
                    </span>
                    <span className="block text-[10px] text-neutral-400 font-mono">
                      {formatDate(tx.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Income Sources Composition */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Income Streams Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">
              {formatBDT(kpis.totalIncome)}
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {Object.keys(incomeSources).length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No income entries logged</p>
            ) : (
              Object.entries(incomeSources).map(([source, amount]) => {
                const fraction = kpis.totalIncome > 0 ? (amount / kpis.totalIncome) * 100 : 0;
                return (
                  <div key={source} className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{source}</span>
                      <span className="text-neutral-400 ml-2 font-mono text-[11px]">{formatPercent(fraction)}</span>
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
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Financial Health Indicators
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Target Savings Benchmark (20%+):
                </span>
                <span className={`font-mono font-bold ${kpis.savingsRate >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                  {formatPercent(kpis.savingsRate)} {kpis.savingsRate >= 20 ? '✓ Healthy' : '⚠ Below benchmark'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Budget Utilization Safety:
                </span>
                <span className={`font-mono font-bold ${kpis.budgetUtilization <= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {formatPercent(kpis.budgetUtilization)} {kpis.budgetUtilization <= 100 ? '✓ On track' : '⚠ Over budget'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Projected End of Month Spend:
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {formatBDT(kpis.projectedMonthEndExpense)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[11px] text-neutral-500 dark:text-neutral-400">
            Tip: Maintaining a savings rate above 20% in Bangladeshi Taka builds a 6-month emergency reserve and safeguards purchasing power against inflation.
          </div>
        </div>

      </div>

    </div>
  );
};
