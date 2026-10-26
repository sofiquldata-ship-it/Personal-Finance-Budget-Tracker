import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent, formatMonthYear } from '../../utils/formatters';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Wallet,
} from 'lucide-react';

interface HeroBalanceCardProps {
  onOpenQuickLog?: () => void;
}

export const HeroBalanceCard: React.FC<HeroBalanceCardProps> = () => {
  const { kpis, currentMonth, setCurrentMonth, openAddTxModal, user, signInWithGoogle } = useFinance();

  const isSurplus = kpis.netSavings >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 bg-gradient-to-br from-white via-slate-50/90 to-white dark:from-[#0d1527] dark:via-[#090e1a] dark:to-[#050811] border border-slate-200/90 dark:border-slate-800/80 shadow-sm transition-all">
      
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left: Net Balance */}
        <div className="space-y-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-300/60 dark:border-emerald-800/80">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{currentMonth === 'all' ? 'সব সময়ের নেট ব্যালান্স' : `নেট ব্যালান্স (${formatMonthYear(currentMonth)})`}</span>
            </span>

            {/* Timeframe Pill Switcher */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
              <button
                type="button"
                onClick={() => setCurrentMonth('all')}
                className={`px-2 py-0.5 rounded-full font-medium transition-all ${
                  currentMonth === 'all'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                সব সময়
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                  setCurrentMonth(cur);
                }}
                className={`px-2 py-0.5 rounded-full font-medium transition-all ${
                  currentMonth !== 'all'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                চলতি মাস
              </button>
            </div>

            {user ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ক্লাউড সিঙ্ক</span>
              </span>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>সিঙ্ক করুন</span>
              </button>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h1
                className={`text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight tabular-nums ${
                  isSurplus
                    ? 'text-slate-900 dark:text-white'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatBDT(kpis.netSavings, { showSign: true })}
              </h1>
              <span
                className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isSurplus
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300/70 dark:border-emerald-800'
                    : 'text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300/70 dark:border-rose-800'
                }`}
              >
                {isSurplus ? 'উদ্বৃত্ত' : 'ঘাটতি'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Section: Inflow / Outflow & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3.5">
          
          {/* Metrics summary card */}
          <div className="grid grid-cols-2 gap-2.5 p-3 sm:p-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xs w-full sm:w-auto sm:min-w-[240px]">
            {/* Inflow */}
            <div className="space-y-0.5 pr-2.5 border-r border-slate-100 dark:border-slate-800">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                <span>মোট আয়</span>
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums block">
                +{formatBDT(kpis.totalIncome)}
              </span>
            </div>

            {/* Outflow */}
            <div className="space-y-0.5 pl-1.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                <span>মোট ব্যয়</span>
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums block">
                -{formatBDT(kpis.totalExpenses)}
              </span>
            </div>

            {/* Savings Rate Bar */}
            <div className="col-span-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">সঞ্চয়ের হার:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(kpis.savingsRate)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, kpis.savingsRate))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => openAddTxModal('expense')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>- খরচ যোগ</span>
            </button>

            <button
              onClick={() => openAddTxModal('income')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300/70 dark:border-emerald-800 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ আয় যোগ</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
