import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatMonthYear } from '../../utils/formatters';
import {
  Plus,
  Moon,
  Sun,
  LayoutDashboard,
  ReceiptText,
  Target,
  BarChart3,
  Database,
  ChevronLeft,
  ChevronRight,
  Cloud,
  LogOut,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'analytics' | 'data';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDataModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDataModal }) => {
  const {
    currentMonth,
    setCurrentMonth,
    availableMonths,
    openAddTxModal,
    user,
    signOut,
    isDarkMode,
    toggleDarkMode,
  } = useFinance();

  const currentIdx = availableMonths.indexOf(currentMonth);
  const handlePrevMonth = () => {
    if (currentIdx !== -1 && currentIdx < availableMonths.length - 1) {
      setCurrentMonth(availableMonths[currentIdx + 1]);
    } else {
      const [year, month] = currentMonth.split('-').map(Number);
      const prev = new Date(year, month - 2, 1);
      const prevStr = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(prevStr);
    }
  };

  const handleNextMonth = () => {
    if (currentIdx > 0) {
      setCurrentMonth(availableMonths[currentIdx - 1]);
    } else {
      const [year, month] = currentMonth.split('-').map(Number);
      const next = new Date(year, month, 1);
      const nextStr = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(nextStr);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between gap-3 h-14 sm:h-16">
          
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-sm">
              ৳
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              TakaTrack
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ড্যাশবোর্ড</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              <span>লেনদেন</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>বাজেট</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>অ্যানালিটিক্স</span>
            </button>

            <button
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>ব্যাকআপ</span>
            </button>
          </nav>

          {/* Right Actions: Month Picker & User & Dark Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Quick Month Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-1.5 sm:px-2 py-1 border border-slate-200/80 dark:border-slate-700/80">
              <button
                onClick={handlePrevMonth}
                disabled={currentMonth === 'all'}
                className="p-1 hover:text-slate-900 dark:hover:text-white rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer px-1"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {m === 'all' ? 'সব সময়' : formatMonthYear(m)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextMonth}
                disabled={currentMonth === 'all'}
                className="p-1 hover:text-slate-900 dark:hover:text-white rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cloud Auto-Connected Live Indicator */}
            {user ? (
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-slate-200 dark:hover:bg-slate-700 border border-emerald-300/80 dark:border-emerald-700/80 cursor-pointer transition-colors"
                title={`${user.email || 'User'} (লগআউট করতে ক্লিক করুন)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate max-w-[65px] sm:max-w-[100px]">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                </span>
                <LogOut className="w-3 h-3 text-slate-400 hover:text-rose-500 ml-0.5" />
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/90 dark:border-emerald-700/80 rounded-xl shadow-2xs select-none"
                title="Firebase ডেটাবেস সার্বক্ষণিক অটো-কানেক্টেড"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] sm:text-xs">ক্লাউড লাইভ</span>
              </div>
            )}

            {/* Desktop Add Transaction Button */}
            <button
              onClick={() => openAddTxModal()}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>এন্ট্রি</span>
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          <span>লেনদেন</span>
        </button>

        <button
          onClick={() => openAddTxModal()}
          className="flex items-center justify-center w-11 h-11 -mt-4 bg-emerald-600 text-white rounded-full shadow-md active:scale-90 transition-transform"
          aria-label="Add Transaction"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'budget'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>বাজেট</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-semibold ${
            activeTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>অ্যানালিটিক্স</span>
        </button>
      </div>
    </header>
  );
};
