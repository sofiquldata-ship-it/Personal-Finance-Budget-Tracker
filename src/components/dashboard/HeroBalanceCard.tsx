import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatBDT, formatPercent, formatMonthYear } from '../../utils/formatters';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  Calendar,
  Layers,
} from 'lucide-react';

interface HeroBalanceCardProps {
  onOpenQuickLog?: () => void;
}

export const HeroBalanceCard: React.FC<HeroBalanceCardProps> = ({ onOpenQuickLog }) => {
  const { kpis, currentMonth, setCurrentMonth, openAddTxModal, user, signInWithGoogle } = useFinance();

  const isSurplus = kpis.netSavings >= 0;

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50/90 to-white dark:from-[#0d1527] dark:via-[#090e1a] dark:to-[#050811] border border-slate-200/90 dark:border-slate-800/80 shadow-lg dark:shadow-2xl transition-all">
      
      {/* Dynamic ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Section: Net Balance & Timeframe Pills */}
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-300/60 dark:border-emerald-800/80">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{currentMonth === 'all' ? 'All-Time Net Balance (সার্বিক ব্যালান্স)' : `Net Balance (${formatMonthYear(currentMonth)})`}</span>
            </span>

            {/* Quick All-Time vs Current Month Switcher Button */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
              <button
                type="button"
                onClick={() => setCurrentMonth('all')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  currentMonth === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                সব সময় (All-Time)
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                  setCurrentMonth(cur);
                }}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  currentMonth !== 'all'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                চলতি মাস (Monthly)
              </button>
            </div>

            {user ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Synced</span>
              </span>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
                title="Connect Google Account to backup on Firebase"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Sync to Firebase</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight tabular-nums ${
                  isSurplus
                    ? 'text-slate-900 dark:text-white'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatBDT(kpis.netSavings, { showSign: true })}
              </h1>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isSurplus
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300/70 dark:border-emerald-800'
                    : 'text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300/70 dark:border-rose-800'
                }`}
              >
                {isSurplus ? 'Net Surplus (উদ্বৃত্ত)' : 'Deficit Alert (ঘাটতি)'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              {currentMonth === 'all'
                ? 'আপনার সার্বিক আয় থেকে মোট খরচের পর বর্তমান মোট সেভিংস বা সঞ্চয় ব্যালান্স।'
                : `${formatMonthYear(currentMonth)} এর মোট আয় থেকে মোট ব্যয় বাদ দিয়ে অবশিষ্ট ব্যালান্স।`}
            </p>
          </div>

        </div>

        {/* Right Section: Inflow / Outflow Bento Pills & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-4">
          
          {/* Metrics summary card */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-sm min-w-[280px]">
            {/* Inflow */}
            <div className="space-y-1 pr-3 border-r border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                <span>Total Inflow</span>
              </span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums block">
                +{formatBDT(kpis.totalIncome)}
              </span>
              <span className="text-[10px] text-slate-400">বেতন ও মোট আয়</span>
            </div>

            {/* Outflow */}
            <div className="space-y-1 pl-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                <span>Total Outflow</span>
              </span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums block">
                -{formatBDT(kpis.totalExpenses)}
              </span>
              <span className="text-[10px] text-slate-400">বাজার, দুধ, বাইক ও খরচ</span>
            </div>

            {/* Savings Rate Gauge bar */}
            <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Savings Rate (সঞ্চয়ের হার):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(kpis.savingsRate)}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, kpis.savingsRate))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => openAddTxModal('expense')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-98 rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>- Add Expense (খরচ)</span>
            </button>

            <button
              onClick={() => openAddTxModal('income')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300/70 dark:border-emerald-800 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Income (আয়)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
