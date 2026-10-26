import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, PaymentMethod } from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatBDT, formatDate, formatMonthYear } from '../../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Plus,
  Pencil,
  Trash2,
  Repeat,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  CreditCard,
  X,
  Smartphone,
  Banknote,
  Building,
} from 'lucide-react';

export const TransactionTable: React.FC = () => {
  const {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    methodFilter,
    setMethodFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    deleteTransaction,
    openEditTxModal,
    openAddTxModal,
    exportCSV,
    currentMonth,
    setCurrentMonth,
    availableMonths,
  } = useFinance();

  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Combine unique categories for filter dropdown
  const allCategoryNames = Array.from(
    new Set([
      ...EXPENSE_CATEGORIES.map((c) => c.name),
      ...INCOME_CATEGORIES.map((c) => c.name),
    ])
  );

  const toggleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleConfirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setMethodFilter('all');
  };

  const isFilteringActive =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    methodFilter !== 'all';

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
      case 'Salary':
        return '💼';
      case 'Business':
        return '🏢';
      case 'Freelance':
        return '💻';
      default:
        return '🏷️';
    }
  };

  const renderPaymentBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'bKash/Nagad':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-500/10 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
            <Smartphone className="w-3 h-3" />
            <span>bKash/Nagad</span>
          </span>
        );
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <Banknote className="w-3 h-3" />
            <span>Cash (নগদ)</span>
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
            <CreditCard className="w-3 h-3" />
            <span>Card</span>
          </span>
        );
      case 'Bank Transfer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Building className="w-3 h-3" />
            <span>Bank Transfer</span>
          </span>
        );
      default:
        return <span>{method}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden transition-all">
      
      {/* Table Header & Controls Bar */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>লেনদেনের খতিয়ান (Transaction Ledger)</span>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                ({filteredTransactions.length} entries)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filtered timeframe: <strong className="text-slate-700 dark:text-slate-300 font-medium">{formatMonthYear(currentMonth)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              title="Export filtered records to CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => openAddTxModal()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Add Entry</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          
          {/* Live Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, category, amount..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Timeframe Selector (All Time vs Month) */}
          <div>
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900">
                  {m === 'all' ? 'All Time (সব লেনদেন)' : formatMonthYear(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories (সব ক্যাটাগরি)</option>
              {allCategoryNames.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-slate-900">
                  {getCategoryIcon(cat)} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as 'all' | PaymentMethod)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Channels (সব মাধ্যম)</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

        </div>

        {isFilteringActive && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>ফিল্টার সক্রিয়: প্রদর্শিত হচ্ছে মেলা ফলাফল</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>রিসেট ফিল্টার (Reset Filters)</span>
            </button>
          </div>
        )}

      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th
                onClick={() => toggleSort('date')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>তারিখ (Date)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                ক্যাটাগরি ও প্রবাহ (Category)
              </th>

              <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                পেমেন্ট চ্যানেল (Channel)
              </th>

              <th className="py-3.5 px-4 font-semibold">
                নোট / বিবরণ (Notes)
              </th>

              <th
                onClick={() => toggleSort('amount')}
                className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>পরিমাণ (Amount ৳)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap">
                অ্যাকশন
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-500 dark:text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-2">
                    📑
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">কোনো লেনদেন পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-400 mt-1">
                    সার্চ কুয়েরি পরিবর্তন করুন বা নতুন এন্ট্রি যোগ করুন
                  </p>
                  <button
                    onClick={() => openAddTxModal()}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন এন্ট্রি যোগ করুন</span>
                  </button>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isExpense = tx.type === 'expense';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                      {formatDate(tx.date)}
                    </td>

                    {/* Category & Flow */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 shadow-2xs ${
                            isExpense
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                          }`}
                        >
                          {getCategoryIcon(tx.category)}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {tx.category}
                            </span>
                            {tx.isRecurring && (
                              <span className="text-[10px] text-slate-400 font-mono inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                <Repeat className="w-2.5 h-2.5" /> Recurring
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isExpense ? 'Debit (ব্যয়)' : 'Credit (আয়)'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Payment Channel */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderPaymentBadge(tx.paymentMethod)}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[260px] truncate">
                      {tx.notes ? tx.notes : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-extrabold text-sm sm:text-base tabular-nums ${
                          isExpense
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatBDT(tx.amount, { showSign: true, isExpense })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditTxModal(tx)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit transaction"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTxToDelete(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {txToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              লেনদেন ডিলিট নিশ্চিত করুন
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              আপনি কি নিশ্চিত যে <strong className="text-slate-800 dark:text-slate-200">{txToDelete.category}</strong> এর{' '}
              <strong className="font-mono text-slate-900 dark:text-white">{formatBDT(txToDelete.amount)}</strong> টাকার এন্ট্রি ডিলিট করতে চান?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTxToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                ডিলিট করুন (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
