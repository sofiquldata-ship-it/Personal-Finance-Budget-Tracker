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

  // Filter only categories with spending
  const expensesWithSpending = categorySummaries.filter((c) => c.spent > 0);
  const totalExpense = kpis.totalExpenses;

  // Compute angles for donut slices
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

  // SVG Geometry Constants
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  // Helper to calculate SVG stroke-dasharray and stroke-dashoffset
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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            খরচের পাই চার্ট (Expense Distribution)
          </h2>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
          {expensesWithSpending.length} categories active
        </span>
      </div>

      {expensesWithSpending.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 text-2xl">
            📊
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            এই মাসে এখনও কোনো খরচ এন্ট্রি করা হয়নি
          </p>
          <p className="text-xs text-slate-400 mt-1">
            উপরে ১-ক্লিক বাটন দিয়ে খরচ যোগ করুন চার্ট দেখতে
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
          
          {/* Donut Graphic */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 drop-shadow-sm"
            >
              {/* Background Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-100 dark:text-slate-800/80"
              />

              {/* Slices */}
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

            {/* Donut Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {activeSlice ? (
                <>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[130px] flex items-center gap-1">
                    <span>{getCategoryIcon(activeSlice.category)}</span>
                    <span>{activeSlice.category}</span>
                  </span>
                  <span className="text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    {formatBDT(activeSlice.spent)}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPercent(activeSlice.percentageOfTotal)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Total Outflow
                  </span>
                  <span className="text-xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    {formatBDT(totalExpense)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hover for breakdown
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend with Percentage breakdown */}
          <div className="flex-1 w-full max-h-[240px] overflow-y-auto pr-1 space-y-1.5">
            {slices.map((slice) => {
              const isHovered = hoveredCategory === slice.category;
              return (
                <div
                  key={slice.category}
                  onMouseEnter={() => setHoveredCategory(slice.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => onSelectCategory && onSelectCategory(slice.category)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isHovered
                      ? 'bg-slate-100 dark:bg-slate-800 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{getCategoryIcon(slice.category)}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {slice.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {formatBDT(slice.spent)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-12 text-right">
                      {formatPercent(slice.percentageOfTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
