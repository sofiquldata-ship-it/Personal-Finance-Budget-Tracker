import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ExpenseDonutChartProps {
  onSelectCategory?: (category: string) => void;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({ onSelectCategory }) => {
  const { categorySummaries, kpis } = useFinance();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const expensesWithSpending = categorySummaries.filter((c) => c.spent > 0);
  const totalExpense = kpis.totalExpenses;

  let cumulativeAngle = 0;
  const slices = expensesWithSpending.map((cat) => {
    const fraction = totalExpense > 0 ? cat.spent / totalExpense : 0;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    return {
      ...cat,
      fraction,
      percentageOfTotal: fraction * 100,
      startAngle,
      endAngle,
    };
  });

  const activeSlice = hoveredCategory
    ? slices.find((s) => s.category === hoveredCategory)
    : null;

  const size = 220;
  const center = size / 2;
  const radius = 80;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            খরচ বণ্টন
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {expensesWithSpending.length} টি খাত
        </span>
      </div>

      {expensesWithSpending.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2 text-xl">
            📊
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            এই মাসে কোনো খরচ এন্ট্রি নেই
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            খরচ যোগ করলে চার্ট দেখা যাবে
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          
          {/* Donut Graphic */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 drop-shadow-xs max-w-full"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-100 dark:text-slate-800/80"
              />

              {slices.map((slice) => {
                const strokeDasharray = `${(slice.fraction * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
                const strokeDashoffset = -cumulativeOffset;
                cumulativeOffset += slice.fraction * circumference;

                const isHovered = hoveredCategory === slice.category;

                return (
                  <circle
                    key={slice.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(slice.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => onSelectCategory && onSelectCategory(slice.category)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {activeSlice ? (
                <>
                  <span className="text-base">{getCategoryIcon(activeSlice.category)}</span>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                    {activeSlice.category}
                  </span>
                  <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {formatBDT(activeSlice.spent)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatPercent(activeSlice.percentageOfTotal)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    মোট খরচ
                  </span>
                  <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white">
                    {formatBDT(totalExpense)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Category List */}
          <div className="flex-1 w-full space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {slices.map((s) => (
              <div
                key={s.category}
                onMouseEnter={() => setHoveredCategory(s.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectCategory && onSelectCategory(s.category)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  hoveredCategory === s.category
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-sm shrink-0">{getCategoryIcon(s.category)}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {s.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatBDT(s.spent)}
                  </span>
                  <span className="font-mono text-slate-400 text-[10px] w-9 text-right">
                    {formatPercent(s.percentageOfTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};
