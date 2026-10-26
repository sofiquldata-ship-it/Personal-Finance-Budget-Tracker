import { Transaction } from '../types/finance';

/**
 * Formats a number as Bangladeshi Taka (৳) with standard subcontinental/international grouping
 * e.g. 25000 -> "৳25,000", 150000 -> "৳1,50,000"
 */
export function formatBDT(amount: number, options?: { showSign?: boolean; isExpense?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with en-IN which uses standard South Asian digit grouping (lakh/crore) familiar in Bangladesh
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absAmount);

  if (options?.showSign) {
    if (options.isExpense) {
      return `-৳${formattedNumber}`;
    }
    return isNegative ? `-৳${formattedNumber}` : `+৳${formattedNumber}`;
  }

  return isNegative ? `-৳${formattedNumber}` : `৳${formattedNumber}`;
}

/**
 * Formats percentage with 1 decimal place or 0 decimals if whole number
 */
export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  const rounded = Math.round(value * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

/**
 * Format date string YYYY-MM-DD to human readable format (e.g., "24 Oct 2026")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Converts monthYear "2026-10" to readable "October 2026" or "all" to "All Time (সব লেনদেন)"
 */
export function formatMonthYear(monthYear: string): string {
  if (!monthYear || monthYear === 'all') return 'All Time (সব লেনদেন)';
  const parts = monthYear.split('-');
  if (parts.length !== 2) return monthYear;
  const [yearStr, monthStr] = parts;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIdx = parseInt(monthStr, 10) - 1;
  return `${monthNames[monthIdx] || ''} ${yearStr}`;
}

/**
 * Generate CSV text with UTF-8 BOM for Excel compatibility
 */
export function generateCSV(transactions: Transaction[]): string {
  const headers = ['Date', 'Type', 'Category', 'Amount (BDT)', 'Payment Method', 'Recurring', 'Notes'];
  
  const rows = transactions.map((tx) => [
    `"${tx.date}"`,
    `"${tx.type.toUpperCase()}"`,
    `"${tx.category}"`,
    tx.amount,
    `"${tx.paymentMethod}"`,
    tx.isRecurring ? '"Yes"' : '"No"',
    `"${(tx.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Prefix with \uFEFF (UTF-8 BOM) so Microsoft Excel opens it without character corruption
  return '\uFEFF' + csvContent;
}

/**
 * Browser file download trigger
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
