import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatBDT, formatMonthYear } from '../../utils/formatters';
import {
  Target,
  Copy,
  RotateCcw,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  Scale,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRightLeft,
  PieChart,
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

  // Local state for the Overall Target input, synced with active currentBudget.overallTarget
  const [overallTargetInput, setOverallTargetInput] = useState<string>(
    (currentBudget.overallTarget || 0).toString()
  );

  // Auto-distribute checkbox flag (default: true so changing target automatically updates categories)
  const [autoDistribute, setAutoDistribute] = useState<boolean>(true);
  const [applyToAllMonths, setApplyToAllMonths] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Category search & filter in right column
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'special' | 'home' | 'other'>('all');

  // CRITICAL FIX: Keep input synchronized whenever currentBudget.overallTarget or month changes
  useEffect(() => {
    setOverallTargetInput((currentBudget.overallTarget || 0).toString());
  }, [currentBudget.overallTarget, currentMonth]);

  // Calculate sum of all category limits
  const totalAllocatedCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.reduce((sum, cat) => {
      const limit = currentBudget.categoryBudgets[cat.name] ?? cat.defaultBudget;
      return sum + limit;
    }, 0);
  }, [currentBudget]);

  // Difference between overall target and sum of category allocations
  const targetDifference = (currentBudget.overallTarget || 0) - totalAllocatedCategories;
  const isBudgetBalanced = Math.abs(targetDifference) === 0;

  // Expected savings buffer based on Total Spend Target
  const targetSavingsBuffer = kpis.totalIncome - (currentBudget.overallTarget || 0);

  // Quick preset targets
  const quickTargetPresets = [50000, 75000, 85000, 100000, 120000, 150000];

  const handleSaveOverallTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(overallTargetInput);
    if (!isNaN(val) && val >= 0) {
      updateOverallTarget(val, {
        autoDistribute,
        applyToAllMonths,
      });
      setSaveSuccessMsg(
        autoDistribute
          ? `সার্বিক বাজেট ৳${val.toLocaleString('en-IN')} সেভ হয়েছে এবং ক্যাটাগরিগুলোতে আনুপাতিক বণ্টন সম্পন্ন হয়েছে`
          : `সার্বিক বাজেট ৳${val.toLocaleString('en-IN')} সফলভাবে সেভ হয়েছে`
      );
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  const handleApplyPreset = (amount: number) => {
    setOverallTargetInput(amount.toString());
    updateOverallTarget(amount, {
      autoDistribute,
      applyToAllMonths,
    });
    setSaveSuccessMsg(`সার্বিক বাজেট ৳${amount.toLocaleString('en-IN')} সেট করা হয়েছে`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleCategoryChange = (category: string, value: string) => {
    const num = parseFloat(value);
    updateCategoryLimit(category, isNaN(num) || num < 0 ? 0 : num);
  };

  const handleQuickAdjust = (category: string, factor: number) => {
    const current = currentBudget.categoryBudgets[category] ?? 0;
    const nextVal = Math.round((current * factor) / 100) * 100;
    updateCategoryLimit(category, Math.max(0, nextVal));
  };

  const handleQuickAddAmount = (category: string, delta: number) => {
    const current = currentBudget.categoryBudgets[category] ?? 0;
    updateCategoryLimit(category, Math.max(0, current + delta));
  };

  const handleDistributeClick = () => {
    distributeOverallTargetToCategories();
    setSaveSuccessMsg(`ক্যাটাগরিগুলোতে মোট ৳${currentBudget.overallTarget.toLocaleString('en-IN')} সমানুপাতিক হারে বণ্টন করা হয়েছে`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleSyncFromCategoriesClick = () => {
    syncTargetFromCategories();
    setOverallTargetInput(totalAllocatedCategories.toString());
    setSaveSuccessMsg(`সার্বিক বাজেট লক্ষ্য ক্যাটাগরির মোট বরাদ্দের সাথে মিলিয়ে ৳${totalAllocatedCategories.toLocaleString('en-IN')} করা হয়েছে`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
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
        return 'বাচ্চার দুধ ও শিশু যত্ন';
      case 'Bike & Fuel':
        return 'বাইক ফুয়েল ও সার্ভিসিং';
      case 'Groceries':
        return 'বাজার ও মুদি সামগ্রী';
      case 'House Rent':
        return 'বাসা ভাড়া';
      case 'Utilities':
        return 'বিদ্যুৎ, গ্যাস ও বিল';
      case 'Healthcare':
        return 'ওষুধ ও চিকিৎসা';
      case 'Dining':
        return 'রেস্তোরাঁ ও নাশতা';
      case 'Transport':
        return 'যাতায়াত ও ভাড়া';
      case 'Entertainment':
        return 'বিনোদন ও ইন্টারনেট';
      case 'Personal':
        return 'ব্যক্তিগত হাতখরচ';
      case 'Education':
        return 'শিক্ষা ও বই';
      case 'Shopping':
        return 'পোশাক ও কেনাকাটা';
      case 'Debt & Loan':
        return 'ঋণ ও কিস্তি';
      case 'Miscellaneous':
        return 'বিবিধ ও অন্যান্য';
      default:
        return '';
    }
  };

  // Filtered categories
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
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              বাজেট ও খরচ সীমা নির্ধারণ (Budget Goal Setting)
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {currentMonth === 'all' ? 'চলতি মাস: অক্টোবর ২০২৬' : formatMonthYear(currentMonth)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
            বাচ্চার দুধ, বাইক ফুয়েল, বাজার ও অনান্য পারিবারিক খাতের মাসিক খরচ সীমা সেট করুন। সার্বিক খরচ লক্ষ্য পরিবর্তন করলে ক্যাটাগরি সীমা স্বয়ংক্রিয়ভাবে সমন্বয় করা যায়।
          </p>
        </div>

        {/* Timeframe & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Month Dropdown Selector directly on the budget page */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
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
            onClick={() => copyBudgetFromPreviousMonth()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
            title="গত মাসের বাজেট কপি করুন"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">গত মাস থেকে কপি</span>
            <span className="sm:hidden">কপি</span>
          </button>

          <button
            type="button"
            onClick={() => resetCurrentMonthBudget()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/60"
            title="ডিফল্ট বাজেটে রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট (Reset)</span>
          </button>
        </div>
      </div>

      {/* Instant Feedback Toast */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Saved to Storage & Cloud</span>
        </div>
      )}

      {/* Grid: Overall Target Setting vs Category-wise Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): Overall Target Card & Smart Synchronization */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          
          {/* Card Header & Current Target Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>সার্বিক মাসিক খরচ লক্ষ্য (Total Spend Target)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                পুরো মাসে আপনি মোট সর্বোচ্চ কত টাকার মধ্যে খরচ সীমাবদ্ধ রাখতে চান
              </p>
            </div>
          </div>

          {/* Current Active Target Display */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200/90 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                বর্তমান কার্যকর টার্গেট (Active Target):
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                {formatBDT(currentBudget.overallTarget || 0)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ক্যাটাগরি মোট:</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {formatBDT(totalAllocatedCategories)}
              </span>
            </div>
          </div>

          {/* Quick Preset Amount Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              দ্রুত টার্গেট নির্বাচন করুন (Quick Presets):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickTargetPresets.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleApplyPreset(amount)}
                  className={`py-1.5 px-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer text-center ${
                    Number(overallTargetInput) === amount
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  ৳{amount / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Form to Input Custom Target */}
          <form onSubmit={handleSaveOverallTarget} className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                কাস্টম টার্গেট লিখুন (BDT):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pointer-events-none">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={overallTargetInput}
                  onChange={(e) => setOverallTargetInput(e.target.value)}
                  placeholder="যেমন: 75000"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-lg font-black font-mono tabular-nums bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            {/* Auto-distribute & Apply to All Checkboxes */}
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoDistribute}
                  onChange={(e) => setAutoDistribute(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  ক্যাটাগরিগুলোতে আনুপাতিক হারে বণ্টন করুন (Auto-distribute)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={applyToAllMonths}
                  onChange={(e) => setApplyToAllMonths(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  সব মাসের জন্য এই বাজেট প্রয়োগ করুন (Apply across all cycles)
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>টার্গেট সেভ করুন (Save Target: ৳{Number(overallTargetInput || 0).toLocaleString('en-IN')})</span>
            </button>
          </form>

          {/* Smart Balance Sync Actions */}
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              স্মার্ট সমন্বয় টুলস (Smart Sync):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDistributeClick}
                className="flex items-center justify-center gap-1.5 p-2 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                title="টার্গেট অনুযায়ী সব ক্যাটাগরি সীমা স্কেল করুন"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>ক্যাটাগরিতে বণ্টন</span>
              </button>

              <button
                type="button"
                onClick={handleSyncFromCategoriesClick}
                className="flex items-center justify-center gap-1.5 p-2 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                title="ক্যাটাগরিগুলোর যোগফল দিয়ে টার্গেট সেট করুন"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>ক্যাটাগরি যোগফল নিন</span>
              </button>
            </div>
          </div>

          {/* Budget Health Overview breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">সার্বিক খরচ লক্ষ্য (Overall Target):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatBDT(currentBudget.overallTarget || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">ক্যাটাগরি মোট বরাদ্দ (Allocated):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatBDT(totalAllocatedCategories)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">টার্গেট ও বরাদ্দের ব্যবধান:</span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                  isBudgetBalanced
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {isBudgetBalanced ? '✓ সমান্তরাল (Balanced)' : `পার্থক্য: ৳${Math.abs(targetDifference).toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">মোট মাসিক আয় (Income):</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {formatBDT(kpis.totalIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">টার্গেট অনুযায়ী প্রত্যাশিত সঞ্চয়:</span>
              <span
                className={`font-mono font-bold ${
                  targetSavingsBuffer >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatBDT(targetSavingsBuffer)}
              </span>
            </div>

            {totalAllocatedCategories > kpis.totalIncome && kpis.totalIncome > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2 mt-2 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  ক্যাটাগরি বাজেট মোট আয় থেকে {formatBDT(totalAllocatedCategories - kpis.totalIncome)} টাকা বেশি। সঞ্চয় নিশ্চিত করতে বাজেট কমান বা আয় বাড়ান।
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Category-by-Category Limits Editor */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ক্যাটাগরি ভিত্তিক বাজেট সীমা (Category Limits)</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {EXPENSE_CATEGORIES.length} Categories
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                বাচ্চার দুধ, বাইক ফুয়েলসহ প্রতিটি খাতের নিজস্ব খরচের সর্বোচ্চ সীমা পরিবর্তন করুন
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">মোট ক্যাটাগরি বরাদ্দ:</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {formatBDT(totalAllocatedCategories)}
              </span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="খাত খুঁজুন (e.g. Milk, Bike, Groceries)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterGroup('all')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                সবগুলো
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('special')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'special'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                🍼 দুধ ও বাইক
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('home')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterGroup === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                বাসা ও বাজার
              </button>
            </div>
          </div>

          {/* Category Cards Grid: Full Visibility with No Awkward Top Cutoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredCategories.map((cat) => {
              const currentLimit = currentBudget.categoryBudgets[cat.name] ?? cat.defaultBudget;
              const percentOfTotal =
                totalAllocatedCategories > 0 ? (currentLimit / totalAllocatedCategories) * 100 : 0;
              const bengaliLabel = getCategoryBengaliLabel(cat.name);
              const isSpecial = cat.name === 'Baby Care & Milk' || cat.name === 'Bike & Fuel';

              return (
                <div
                  key={cat.name}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isSpecial
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80 shadow-2xs'
                      : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Category Title & Icon (ALWAYS FULLY VISIBLE) */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-2xs">
                        {getCategoryIcon(cat.name)}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {cat.name}
                        </div>
                        {bengaliLabel && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {bengaliLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      {percentOfTotal.toFixed(1)}%
                    </span>
                  </div>

                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(cat.name, 0.9)}
                        className="text-[10px] font-mono font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 cursor-pointer"
                        title="১০% কমান"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(cat.name, 1.1)}
                        className="text-[10px] font-mono font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 cursor-pointer"
                        title="১০% বাড়ান"
                      >
                        +10%
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickAddAmount(cat.name, 500)}
                        className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                        title="+৫০০ টাকা যোগ করুন"
                      >
                        +৳500
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddAmount(cat.name, 1000)}
                        className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                        title="+১০০০ টাকা যোগ করুন"
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
                      value={currentLimit}
                      onChange={(e) => handleCategoryChange(cat.name, e.target.value)}
                      className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-bold tabular-nums bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
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
