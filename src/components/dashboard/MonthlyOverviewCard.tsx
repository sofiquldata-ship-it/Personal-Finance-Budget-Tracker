import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { CalendarRange, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const MonthlyOverviewCard: React.FC = () => {
  const { monthlySummaries, currentMonth, setCurrentMonth } = useFinance();

  if (monthlySummaries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            মাস ভিত্তিক তুলনামূলক বিবরণী (Monthly Cycles Comparison)
          </h3>
        </div>
        <button
          onClick={() => setCurrentMonth('all')}
          className={`text-xs font-semibold px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentMonth === 'all'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          সব সময় (All-Time) মোট দেখুন
        </button>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
              <th className="py-2.5 pr-3 font-semibold">মাস (Month Cycle)</th>
              <th className="py-2.5 px-3 font-semibold text-right">আয় (Inflow)</th>
              <th className="py-2.5 px-3 font-semibold text-right">ব্যয় (Outflow)</th>
              <th className="py-2.5 px-3 font-semibold text-right">সঞ্চয় (Net Balance)</th>
              <th className="py-2.5 px-3 font-semibold text-right">হার (Rate)</th>
              <th className="py-2.5 pl-3 font-semibold text-right">ফিল্টার</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums">
            {monthlySummaries.map((m) => {
              const isSelected = currentMonth === m.monthYear;
              const isPositive = m.netSavings >= 0;

              return (
                <tr
                  key={m.monthYear}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? 'bg-slate-50/90 dark:bg-slate-800/60 font-bold' : ''
                  }`}
                >
                  <td className="py-3 pr-3 font-sans font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {m.displayName}
                    <span className="text-[11px] text-slate-400 font-normal ml-1.5 font-mono">
                      ({m.transactionCount} txs)
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatBDT(m.totalIncome)}
                  </td>

                  <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400 font-bold">
                    -{formatBDT(m.totalExpenses)}
                  </td>

                  <td
                    className={`py-3 px-3 text-right font-extrabold ${
                      isPositive
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {formatBDT(m.netSavings, { showSign: true })}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {formatPercent(m.savingsRate)}
                  </td>

                  <td className="py-3 pl-3 text-right">
                    <button
                      onClick={() => setCurrentMonth(m.monthYear)}
                      className={`px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
