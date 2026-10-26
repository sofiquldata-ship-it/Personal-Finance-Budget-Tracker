import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { HeroBalanceCard } from './components/dashboard/HeroBalanceCard';
import { KPICards } from './components/dashboard/KPICards';
import { BudgetProgress } from './components/dashboard/BudgetProgress';
import { ExpenseDonutChart } from './components/dashboard/ExpenseDonutChart';
import { CashFlowComparison } from './components/dashboard/CashFlowComparison';
import { TransactionTable } from './components/transactions/TransactionTable';
import { TransactionModal } from './components/transactions/TransactionModal';
import { BudgetSettingsView } from './components/budget/BudgetSettingsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { DataManagementModal } from './components/data/DataManagementModal';
import { QuickExpenseBar } from './components/dashboard/QuickExpenseBar';
import { MonthlyOverviewCard } from './components/dashboard/MonthlyOverviewCard';
import { formatMonthYear } from './utils/formatters';
import { Plus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const { currentMonth, setCategoryFilter, openAddTxModal, monthlyTransactions } = useFinance();

  const handleSelectCategoryFromDashboard = (catName: string) => {
    setCategoryFilter(catName);
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 transition-colors font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-10 space-y-4 sm:space-y-6">
        
        {/* View 1: Main Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">

            {/* 1. Hero Net Balance & Financial Runway Card */}
            <HeroBalanceCard />

            {/* 2. Quick Fast Tracking Station */}
            <QuickExpenseBar />

            {/* 3. Real-time KPI Metric Cards */}
            <KPICards />

            {/* 4. Split Grid: Interactive Donut & Cash Flow vs Budget Limits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
              
              {/* Left Column: Visual Analytics & Chart */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <ExpenseDonutChart onSelectCategory={handleSelectCategoryFromDashboard} />
                <CashFlowComparison />
              </div>

              {/* Right Column: Visual Budget Progress */}
              <div className="lg:col-span-6">
                <BudgetProgress
                  onNavigateToBudgetSettings={() => setActiveTab('budget')}
                  onSelectCategory={handleSelectCategoryFromDashboard}
                />
              </div>

            </div>

            {/* 5. Month-by-Month Comparison Table */}
            <MonthlyOverviewCard />

            {/* 6. Transactions Section Preview */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    সাম্প্রতিক লেনদেন
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({monthlyTransactions.length})
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('transactions')}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>সব লেনদেন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <TransactionTable />
            </div>

          </div>
        )}

        {/* View 2: Full Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-fade-in">
            <TransactionTable />
          </div>
        )}

        {/* View 3: Budget Setting & Target Formulations */}
        {activeTab === 'budget' && (
          <div className="space-y-4 animate-fade-in">
            <BudgetSettingsView />
          </div>
        )}

        {/* View 4: Analytics & Outflow Reports */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 animate-fade-in">
            <AnalyticsView />
          </div>
        )}

      </main>

      {/* Global Modals */}
      <TransactionModal />
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-200">TakaTrack (টাকা ট্র্যাক)</span>
            <span aria-hidden="true">·</span>
            <span>Personal Finance & Budgeting</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Bangladeshi Taka (৳)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Cloud & Local Sync Active</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium underline underline-offset-2 cursor-pointer"
            >
              Export Excel / CSV
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
