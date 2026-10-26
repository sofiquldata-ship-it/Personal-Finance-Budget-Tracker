import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { CalendarRange } from 'lucide-react';

export const MonthlyOverviewCard: React.FC = () => {
  const { monthlySummaries, currentMonth, setCurrentMonth } = useFinance();

  if (monthlySummaries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            মাসিক তুলনামূলক হিসাব
          </h3>
        </div>
        <button
          onClick={() => setCurrentMonth('all')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
            currentMonth === 'all'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          সব সময়
        </button>
      </div>

      <div className="mt-2.5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
              <th className="py-2 pr-3 font-semibold">মাস</th>
              <th className="py-2 px-3 font-semibold text-right">আয়</th>
              <th className="py-2 px-3 font-semibold text-right">ব্যয়</th>
              <th className="py-2 px-3 font-semibold text-right">সঞ্চয়</th>
              <th className="py-2 px-3 font-semibold text-right">হার</th>
              <th className="py-2 pl-3 font-semibold text-right">বাছাই</th>
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
                  <td className="py-2.5 pr-3 font-sans font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {m.displayName}
                    <span className="text-[10px] text-slate-400 font-normal ml-1 font-mono">
                      ({m.transactionCount})
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatBDT(m.totalIncome)}
                  </td>

                  <td className="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400 font-bold">
                    -{formatBDT(m.totalExpenses)}
                  </td>

                  <td
                    className={`py-2.5 px-3 text-right font-extrabold ${
                      isPositive
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {formatBDT(m.netSavings, { showSign: true })}
                  </td>

                  <td className="py-2.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    {formatPercent(m.savingsRate)}
                  </td>

                  <td className="py-2.5 pl-3 text-right">
                    <button
                      onClick={() => setCurrentMonth(m.monthYear)}
                      className={`px-2 py-0.5 text-[11px] font-sans font-semibold rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? 'সক্রিয়' : 'দেখুন'}
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
