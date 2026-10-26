import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionType, PaymentMethod } from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatBDT } from '../../utils/formatters';
import { X, Calendar, CreditCard, Tag, FileText, Repeat, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
      setError('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    if (!date) {
      setError('তারিখ নির্বাচন করুন');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {txToEdit ? 'লেনদেন সম্পাদনা' : 'নতুন লেনদেন'}
          </h3>
          <button
            onClick={closeTxModal}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          
          {error && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Selector */}
          <div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>খরচ</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>আয়</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                পরিমাণ (BDT)
              </label>
              {numAmount > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBDT(numAmount)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-lg font-bold font-mono text-slate-400 pointer-events-none">
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
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              {[200, 350, 500, 1000, 2000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAmountChip(preset)}
                  className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  ৳{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ক্যাটাগরি
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                  <Tag className="w-3.5 h-3.5" />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-8 pr-6 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.name} value={cat.name} className="bg-white dark:bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পেমেন্ট মাধ্যম
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                  <CreditCard className="w-3.5 h-3.5" />
                </span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full pl-8 pr-6 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
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

          {/* Date & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                তারিখ
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-8 pr-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center h-10 px-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <label className="flex items-center gap-1.5 cursor-pointer w-full text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 cursor-pointer"
                />
                <Repeat className="w-3 h-3 text-slate-400" />
                <span>নিয়মিত রিকারিং</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              বিবরণ (ঐচ্ছিক)
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-2.5 text-slate-400 pointer-events-none">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: বাচ্চার দুধ, বাইক অকটেন..."
                maxLength={150}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTxModal}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs cursor-pointer"
            >
              {txToEdit ? 'সংরক্ষণ' : 'সেভ করুন'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
