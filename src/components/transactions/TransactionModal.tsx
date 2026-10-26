import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType, PaymentMethod } from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatBDT } from '../../utils/formatters';
import { X, Calendar, CreditCard, Tag, FileText, Repeat, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const { isTxModalOpen, txToEdit, closeTxModal, addTransaction, updateTransaction, currentMonth } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<string>('Baby Care & Milk');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash/Nagad');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync form when modal opens or editing item changes
  useEffect(() => {
    if (txToEdit) {
      setType(txToEdit.type);
      setCategory(txToEdit.category);
      setAmount(txToEdit.amount.toString());
      setDate(txToEdit.date);
      setPaymentMethod(txToEdit.paymentMethod);
      setIsRecurring(txToEdit.isRecurring);
      setNotes(txToEdit.notes || '');
      setError(null);
    } else {
      // Default new entry
      setType('expense');
      setCategory('Baby Care & Milk');
      setAmount('');
      
      const today = new Date().toISOString().split('T')[0];
      if (currentMonth === 'all' || today.startsWith(currentMonth)) {
        setDate(today);
      } else {
        setDate(`${currentMonth}-01`);
      }
      setPaymentMethod('bKash/Nagad');
      setIsRecurring(false);
      setNotes('');
      setError(null);
    }
  }, [txToEdit, isTxModalOpen, currentMonth]);

  // Adjust default category when type toggles
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Baby Care & Milk');
    } else {
      setCategory('Salary');
    }
  };

  if (!isTxModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('দয়া করে ০ এর বেশি সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    if (!date) {
      setError('সঠিক তারিখ নির্বাচন করুন');
      return;
    }

    if (!category.trim()) {
      setError('ক্যাটাগরি নির্বাচন করুন');
      return;
    }

    if (txToEdit) {
      updateTransaction(txToEdit.id, {
        type,
        category,
        amount: numAmount,
        date,
        paymentMethod,
        isRecurring,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        type,
        category,
        amount: numAmount,
        date,
        paymentMethod,
        isRecurring,
        notes: notes.trim(),
      });
    }

    closeTxModal();
  };

  const handleAmountChip = (presetVal: number) => {
    setAmount(presetVal.toString());
  };

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const numAmount = parseFloat(amount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{txToEdit ? 'লেনদেন সম্পাদনা করুন (Edit)' : 'নতুন লেনদেন রেকর্ড করুন (New Entry)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              বাংলাদেশি টাকা (BDT ৳) তে প্রতিদিনের আয় ও ব্যয় ট্র্যাক করুন
            </p>
          </div>
          <button
            onClick={closeTxModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Selector (Segmented buttons) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              লেনদেনের ধরণ (Transaction Flow)
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>Expense (খরচ)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Income (আয়)</span>
              </button>
            </div>
          </div>

          {/* Amount Input with Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                টাকার পরিমাণ (Amount ৳) <span className="text-rose-500">*</span>
              </label>
              {numAmount > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBDT(numAmount)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xl font-black font-mono text-slate-400 pointer-events-none">
                ৳
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Quick:</span>
              {[200, 350, 500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAmountChip(preset)}
                  className="px-2 py-0.5 text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/80"
                >
                  ৳{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Payment Method Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ক্যাটাগরি (Category) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Tag className="w-4 h-4" />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.name} value={cat.name} className="bg-white dark:bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                পেমেন্ট চ্যানেল (Payment Channel)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <CreditCard className="w-4 h-4" />
                </span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method} className="bg-white dark:bg-slate-900">
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Date & Recurring Toggle Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            
            {/* Date Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                তারিখ (Date) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center h-11 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer w-full text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <Repeat className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">প্রতি মাসের নিয়মিত (Recurring)</span>
              </label>
            </div>

          </div>

          {/* Notes / Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              নোট বা বিবরণ (Notes) - ঐচ্ছিক
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                <FileText className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: আড়ং বাচ্চার দুধ, বাইক অকটেন রিফিল, বেতন"
                maxLength={150}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTxModal}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {txToEdit ? 'পরিবর্তন সংরক্ষণ করুন' : 'রেকর্ড সেভ করুন'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
