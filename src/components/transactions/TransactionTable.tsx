import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, PaymentMethod } from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatBDT, formatDate, formatMonthYear } from '../../utils/formatters';
import {
  Search,
  Download,
  Plus,
  Pencil,
  Trash2,
  Repeat,
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
            <Smartphone className="w-3 h-3" />
            <span>বিকাশ/নগদ</span>
          </span>
        );
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <Banknote className="w-3 h-3" />
            <span>নগদ</span>
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
            <CreditCard className="w-3 h-3" />
            <span>কার্ড</span>
          </span>
        );
      case 'Bank Transfer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Building className="w-3 h-3" />
            <span>ব্যাংক</span>
          </span>
        );
      default:
        return <span>{method}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden transition-all">
      
      {/* Controls Bar */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              লেনদেন তালিকা
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              ({filteredTransactions.length})
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>এক্সপোর্ট</span>
            </button>

            <button
              onClick={() => openAddTxModal()}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ এন্ট্রি</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-0.5">
          
          {/* Search */}
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খুঁজুন..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Timeframe */}
          <div>
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900">
                  {m === 'all' ? 'সব সময়' : formatMonthYear(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              সব
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              খরচ
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              আয়
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">সব ক্যাটাগরি</option>
              {allCategoryNames.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as 'all' | PaymentMethod)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">সব মাধ্যম</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

        </div>

        {isFilteringActive && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
            <span>ফিল্টার সক্রিয়</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>রিসেট</span>
            </button>
          </div>
        )}

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 text-[11px]">
              <th
                onClick={() => toggleSort('date')}
                className="py-2.5 px-3 sm:px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>তারিখ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-3 sm:px-4 font-semibold whitespace-nowrap">
                ক্যাটাগরি
              </th>

              <th className="py-2.5 px-3 sm:px-4 font-semibold whitespace-nowrap hidden sm:table-cell">
                মাধ্যম
              </th>

              <th className="py-2.5 px-3 sm:px-4 font-semibold hidden md:table-cell">
                বিবরণ
              </th>

              <th
                onClick={() => toggleSort('amount')}
                className="py-2.5 px-3 sm:px-4 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>পরিমাণ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-3 sm:px-4 font-semibold text-right whitespace-nowrap">
                অ্যাকশন
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  <p className="text-xs sm:text-sm font-semibold">কোনো লেনদেন পাওয়া যায়নি</p>
                  <button
                    onClick={() => openAddTxModal()}
                    className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন এন্ট্রি</span>
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
                    <td className="py-3 px-3 sm:px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                      {formatDate(tx.date)}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-base shrink-0">{getCategoryIcon(tx.category)}</span>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-xs">
                            {tx.category}
                          </div>
                          {tx.isRecurring && (
                            <span className="text-[10px] text-slate-400 font-mono inline-flex items-center gap-0.5">
                              <Repeat className="w-2.5 h-2.5" /> রিকারিং
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden sm:table-cell">
                      {renderPaymentBadge(tx.paymentMethod)}
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate hidden md:table-cell text-xs">
                      {tx.notes ? tx.notes : '—'}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-bold text-xs sm:text-sm tabular-nums ${
                          isExpense
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatBDT(tx.amount, { showSign: true, isExpense })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditTxModal(tx)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="সম্পাদনা"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTxToDelete(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
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

      {/* Delete Dialog */}
      {txToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              লেনদেন ডিলিট নিশ্চিত করুন
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">{txToDelete.category}</strong> এর{' '}
              <strong className="font-mono text-slate-900 dark:text-white">{formatBDT(txToDelete.amount)}</strong> টাকার এন্ট্রি কি ডিলিট করতে চান?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTxToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
              >
                ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
