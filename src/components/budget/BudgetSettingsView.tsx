import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatBDT, formatMonthYear } from '../../utils/formatters';
import {
  Target,
  Copy,
  RotateCcw,
  Save,
  CheckCircle2,
  Calendar,
  Search,
  Scale,
  RefreshCw,
} from 'lucide-react';

export const BudgetSettingsView: React.FC = () => {
  const {
    currentBudget,
    updateOverallTarget,
    updateCategoryLimit,
    distributeOverallTargetToCategories,
    syncTargetFromCategories,
    copyBudgetFromPreviousMonth,
    resetCurrentMonthBudget,
    currentMonth,
    setCurrentMonth,
    availableMonths,
    kpis,
  } = useFinance();

  // Local state for Overall Target input. Blank when 0 or unset
  const [overallTargetInput, setOverallTargetInput] = useState<string>(
    (currentBudget.overallTarget || 0) > 0 ? currentBudget.overallTarget.toString() : ''
  );

  const [autoDistribute, setAutoDistribute] = useState<boolean>(true);
  const [applyToAllMonths, setApplyToAllMonths] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [categorySearch, setCategorySearch] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'special' | 'home' | 'other'>('all');

  // Synchronize input when currentBudget.overallTarget or month changes
  useEffect(() => {
    setOverallTargetInput(
      (currentBudget.overallTarget || 0) > 0 ? currentBudget.overallTarget.toString() : ''
    );
  }, [currentBudget.overallTarget, currentMonth]);

  // Calculate sum of all category limits
  const totalAllocatedCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.reduce((sum, cat) => {
      const limit = currentBudget.categoryBudgets[cat.name] || 0;
      return sum + limit;
    }, 0);
  }, [currentBudget]);

  const targetDifference = (currentBudget.overallTarget || 0) - totalAllocatedCategories;
  const isBudgetBalanced = Math.abs(targetDifference) === 0;

  const handleSaveOverallTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(overallTargetInput);
    const targetToSave = isNaN(val) || val < 0 ? 0 : val;

    updateOverallTarget(targetToSave, {
      autoDistribute,
      applyToAllMonths,
    });
    setSaveSuccessMsg(
      targetToSave > 0
        ? `মাসিক বাজেট ৳${targetToSave.toLocaleString('en-IN')} সেভ হয়েছে`
        : 'বাজেট টার্গেট রিসেট করা হয়েছে'
    );
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleApplyPreset = (amount: number) => {
    setOverallTargetInput(amount.toString());
    updateOverallTarget(amount, {
      autoDistribute,
      applyToAllMonths,
    });
    setSaveSuccessMsg(`বাজেট ৳${amount.toLocaleString('en-IN')} সেট করা হয়েছে`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleCategoryChange = (category: string, value: string) => {
    if (value.trim() === '') {
      updateCategoryLimit(category, 0);
      return;
    }
    const num = parseFloat(value);
    updateCategoryLimit(category, isNaN(num) || num < 0 ? 0 : num);
  };

  const handleQuickAdjust = (category: string, factor: number) => {
    const current = currentBudget.categoryBudgets[category] || 0;
    const nextVal = Math.round((current * factor) / 100) * 100;
    updateCategoryLimit(category, Math.max(0, nextVal));
  };

  const handleQuickAddAmount = (category: string, delta: number) => {
    const current = currentBudget.categoryBudgets[category] || 0;
    updateCategoryLimit(category, Math.max(0, current + delta));
  };

  const handleDistributeClick = () => {
    distributeOverallTargetToCategories();
    setSaveSuccessMsg('ক্যাটাগরিগুলোতে আনুপাতিক বণ্টন সম্পন্ন হয়েছে');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSyncFromCategoriesClick = () => {
    syncTargetFromCategories();
    setOverallTargetInput(totalAllocatedCategories > 0 ? totalAllocatedCategories.toString() : '');
    setSaveSuccessMsg(`মোট টার্গেট ৳${totalAllocatedCategories.toLocaleString('en-IN')} করা হয়েছে`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

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
      case 'Transport':
        return '🚗';
      case 'Entertainment':
        return '🎉';
      case 'Personal':
        return '👤';
      case 'Education':
        return '📚';
      case 'Shopping':
        return '🛍️';
      case 'Debt & Loan':
        return '💳';
      case 'Miscellaneous':
        return '📦';
      default:
        return '🏷️';
    }
  };

  const getCategoryBengaliLabel = (cat: string) => {
    switch (cat) {
      case 'Baby Care & Milk':
        return 'বাচ্চার দুধ ও যত্ন';
      case 'Bike & Fuel':
        return 'বাইক ও ফুয়েল';
      case 'Groceries':
        return 'বাজার ও মুদি';
      case 'House Rent':
        return 'বাসা ভাড়া';
      case 'Utilities':
        return 'বিদ্যুৎ ও বিল';
      case 'Healthcare':
        return 'ওষুধ ও চিকিৎসা';
      case 'Dining':
        return 'রেস্তোরাঁ ও নাশতা';
      case 'Transport':
        return 'যাতায়াত';
      case 'Entertainment':
        return 'বিনোদন';
      case 'Personal':
        return 'হাতখরচ';
      case 'Education':
        return 'শিক্ষা';
      case 'Shopping':
        return 'কেনাকাটা';
      case 'Debt & Loan':
        return 'ঋণ ও কিস্তি';
      case 'Miscellaneous':
        return 'অন্যান্য';
      default:
        return '';
    }
  };

  const filteredCategories = EXPENSE_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      getCategoryBengaliLabel(cat.name).toLowerCase().includes(categorySearch.toLowerCase());

    if (!matchesSearch) return false;

    if (filterGroup === 'special') {
      return cat.name === 'Baby Care & Milk' || cat.name === 'Bike & Fuel';
    }
    if (filterGroup === 'home') {
      return ['House Rent', 'Groceries', 'Utilities', 'Healthcare'].includes(cat.name);
    }
    if (filterGroup === 'other') {
      return !['Baby Care & Milk', 'Bike & Fuel', 'House Rent', 'Groceries', 'Utilities', 'Healthcare'].includes(
        cat.name
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Month Selector & Controls Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              মাসিক বাজেট ও টার্গেট
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              নির্বাচিত মাস: <strong className="text-slate-700 dark:text-slate-300">{formatMonthYear(currentMonth)}</strong>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {formatMonthYear(m)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const copied = copyBudgetFromPreviousMonth();
              if (copied) {
                setSaveSuccessMsg('গত মাসের বাজেট সফলভাবে কপি হয়েছে');
                setTimeout(() => setSaveSuccessMsg(null), 3000);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পূর্ববর্তী মাস কপি</span>
            <span className="sm:hidden">কপি</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetCurrentMonthBudget();
              setOverallTargetInput('');
              setSaveSuccessMsg('এই মাসের বাজেট খালি (০) করা হয়েছে');
              setTimeout(() => setSaveSuccessMsg(null), 3000);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>মুছে ফেলুন</span>
          </button>
        </div>
      </div>

      {/* Save Success Message */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Grid: Target Form & Category Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* Left: Overall Target Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              সার্বিক খরচ লক্ষ্য
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              এই মাসে সর্বোচ্চ খরচের মোট সীমা নির্ধারণ করুন
            </p>
          </div>

          {/* Active Target Banner */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300 block">
                চলতি টার্গেট
              </span>
              <div className="text-lg sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                {currentBudget.overallTarget > 0 ? formatBDT(currentBudget.overallTarget) : 'সেট করা নেই (৳০)'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ক্যাটাগরি মোট:</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {formatBDT(totalAllocatedCategories)}
              </span>
            </div>
          </div>

          {/* Target Form */}
          <form onSubmit={handleSaveOverallTarget} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                টার্গেট এমাউন্ট (BDT):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 pointer-events-none">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={overallTargetInput}
                  onChange={(e) => setOverallTargetInput(e.target.value)}
                  placeholder="টার্গেট লিখুন (যেমন: ৫০,০০০)"
                  className="w-full pl-8 pr-3 py-2 text-base sm:text-lg font-bold font-mono tabular-nums bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[30000, 50000, 75000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleApplyPreset(amt)}
                  className={`py-1 px-2.5 text-[11px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    Number(overallTargetInput) === amt
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  ৳{amt / 1000}k
                </button>
              ))}
            </div>

            <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoDistribute}
                  onChange={(e) => setAutoDistribute(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  ক্যাটাগরিগুলোতে আনুপাতিক বণ্টন করুন
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={applyToAllMonths}
                  onChange={(e) => setApplyToAllMonths(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  সব মাসের জন্য এই বাজেট প্রয়োগ করুন
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>টার্গেট সেভ করুন</span>
            </button>
          </form>

          {/* Quick sync helpers */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDistributeClick}
              className="flex items-center justify-center gap-1 p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Scale className="w-3 h-3 text-emerald-600" />
              <span>ক্যাটাগরিতে বণ্টন</span>
            </button>

            <button
              type="button"
              onClick={handleSyncFromCategoriesClick}
              className="flex items-center justify-center gap-1 p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-blue-600" />
              <span>যোগফল মিলিয়ে নিন</span>
            </button>
          </div>

        </div>

        {/* Right: Category Limits */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              খাতভিত্তিক বাজেট সীমা
            </h3>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              মোট: {formatBDT(totalAllocatedCategories)}
            </span>
          </div>

          {/* Search & filter pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="খাত খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setFilterGroup('all')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                সব
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('special')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'special'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                🍼 দুধ ও বাইক
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('home')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                বাসা ও বাজার
              </button>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredCategories.map((cat) => {
              const currentLimit = currentBudget.categoryBudgets[cat.name] || 0;
              const bengaliLabel = getCategoryBengaliLabel(cat.name);
              const isSpecial = cat.name === 'Baby Care & Milk' || cat.name === 'Bike & Fuel';

              return (
                <div
                  key={cat.name}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    isSpecial
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80'
                      : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{getCategoryIcon(cat.name)}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {cat.name}
                        </div>
                        {bengaliLabel && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {bengaliLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickAddAmount(cat.name, 500)}
                        className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                      >
                        +৳500
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddAmount(cat.name, 1000)}
                        className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                      >
                        +৳1k
                      </button>
                    </div>
                  </div>

                  {/* Input field with Currency Symbol */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-mono font-bold text-slate-400 pointer-events-none">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={currentLimit > 0 ? currentLimit : ''}
                      onChange={(e) => handleCategoryChange(cat.name, e.target.value)}
                      placeholder="০"
                      className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-bold tabular-nums bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
