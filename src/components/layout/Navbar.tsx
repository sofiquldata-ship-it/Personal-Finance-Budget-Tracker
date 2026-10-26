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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Globe,
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
    signInWithGoogle,
    signOut,
    isDarkMode,
    toggleDarkMode,
    isFirebaseConnected,
  } = useFinance();

  // Navigation between months
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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Top Row */}
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              ৳
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>TakaTrack</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                টাকা ট্র্যাক ও বাজেট
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ড্যাশবোর্ড (Dashboard)</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              <span>লেনদেন (Transactions)</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>বাজেট লিমিট (Budgets)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>অ্যানালিটিক্স (Analytics)</span>
            </button>

            <button
              onClick={onOpenDataModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap cursor-pointer"
              title="Backup, Restore & Export CSV"
            >
              <Database className="w-4 h-4" />
              <span>এক্সপোর্ট / ব্যাকআপ</span>
            </button>
          </nav>

          {/* Right Actions & Auth Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Firebase Auth & Cloud Sync */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate max-w-[120px]">{user.displayName || user.email?.split('@')[0]}</span>
                </span>
                <button
                  onClick={signOut}
                  className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  title={`Signed in as ${user.email}. Click to sign out.`}
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Sync records to Google Firebase Cloud database"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Google Sync</span>
              </button>
            )}

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => openAddTxModal()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Entry</span>
            </button>

          </div>
        </div>

        {/* Sub-bar: Active Timeframe & Month / All-Time Quick Bar */}
        <div className="flex flex-wrap items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-600 dark:text-slate-300 gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[11px] font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>টাইমফ্রেম:</span>
            </span>

            {/* Quick Segmented Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setCurrentMonth('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentMonth === 'all'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                সব সময় (All-Time)
              </button>

              <div className="flex items-center pl-1 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={handlePrevMonth}
                  disabled={currentMonth === 'all'}
                  className="p-1 hover:text-slate-900 dark:hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 dark:text-white px-1.5 py-1 text-xs focus:outline-none cursor-pointer"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                      {m === 'all' ? 'All Time (সব সময়)' : formatMonthYear(m)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleNextMonth}
                  disabled={currentMonth === 'all'}
                  className="p-1 hover:text-slate-900 dark:hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {currentMonth === 'all' ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                <Globe className="w-3 h-3" />
                <span>সার্বিক মোট হিসাব সক্রিয়</span>
              </span>
            ) : null}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2.5">
            <span>মুদ্রা: <strong className="text-slate-700 dark:text-slate-300 font-mono font-bold">BDT (৳)</strong></span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenDataModal}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Click to view Firebase database details & backup tools"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-medium">Firebase Connected</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-md ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-md ${
            activeTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span>Records</span>
        </button>

        <button
          onClick={() => openAddTxModal()}
          className="flex flex-col items-center justify-center w-12 h-12 -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full shadow-lg active:scale-90 transition-transform"
          aria-label="Add Transaction"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-md ${
            activeTab === 'budget'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>Budgets</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-md ${
            activeTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Insights</span>
        </button>
      </div>
    </header>
  );
};
