/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TakaTrack Backend API Server
 * Full-stack Express server providing REST endpoints for financial records,
 * budget targets, real-time KPI summaries, and CSV report streaming.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory persistent cache for server-side operations
interface TransactionEntity {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  paymentMethod: string;
  isRecurring: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

let serverTransactions: TransactionEntity[] = [];

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'TakaTrack API',
    timestamp: new Date().toISOString(),
    currency: 'BDT (৳)',
  });
});

// GET /api/transactions - Retrieve transactions with optional filtering
app.get('/api/transactions', (req: Request, res: Response) => {
  const { month, type, category } = req.query;
  let results = [...serverTransactions];

  if (typeof month === 'string') {
    results = results.filter((tx) => tx.date.startsWith(month));
  }
  if (typeof type === 'string' && (type === 'income' || type === 'expense')) {
    results = results.filter((tx) => tx.type === type);
  }
  if (typeof category === 'string' && category !== 'all') {
    results = results.filter((tx) => tx.category === category);
  }

  res.json({
    count: results.length,
    data: results,
  });
});

// POST /api/transactions - Create a new transaction
app.post('/api/transactions', (req: Request, res: Response) => {
  const { date, type, category, amount, paymentMethod, isRecurring, notes } = req.body;

  if (!date || !type || !category || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Missing required transaction fields or invalid amount' });
    return;
  }

  const newTx: TransactionEntity = {
    id: `tx-srv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    date,
    type,
    category,
    amount,
    paymentMethod: paymentMethod || 'Cash',
    isRecurring: Boolean(isRecurring),
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  serverTransactions.unshift(newTx);
  res.status(201).json({ success: true, data: newTx });
});

// PUT /api/transactions/:id - Update existing transaction
app.put('/api/transactions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = serverTransactions.findIndex((tx) => tx.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }

  const existing = serverTransactions[index];
  const updated: TransactionEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  serverTransactions[index] = updated;
  res.json({ success: true, data: updated });
});

// DELETE /api/transactions/:id - Delete transaction
app.delete('/api/transactions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const prevCount = serverTransactions.length;
  serverTransactions = serverTransactions.filter((tx) => tx.id !== id);

  if (serverTransactions.length === prevCount) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }

  res.json({ success: true, message: 'Transaction deleted' });
});

// GET /api/summary - Real-time KPI calculations for a given month
app.get('/api/summary', (req: Request, res: Response) => {
  const month = typeof req.query.month === 'string' ? req.query.month : '2026-10';
  const monthly = serverTransactions.filter((tx) => tx.date.startsWith(month));

  let totalIncome = 0;
  let totalExpenses = 0;

  monthly.forEach((tx) => {
    if (tx.type === 'income') totalIncome += tx.amount;
    else totalExpenses += tx.amount;
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  res.json({
    month,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate: Math.round(savingsRate * 10) / 10,
    currency: 'BDT',
  });
});

// Export CSV stream
app.get('/api/export-csv', (req: Request, res: Response) => {
  const month = typeof req.query.month === 'string' ? req.query.month : '2026-10';
  const monthly = serverTransactions.filter((tx) => tx.date.startsWith(month));

  const headers = ['Date', 'Type', 'Category', 'Amount (BDT)', 'Payment Method', 'Recurring', 'Notes'];
  const rows = monthly.map((tx) => [
    `"${tx.date}"`,
    `"${tx.type.toUpperCase()}"`,
    `"${tx.category}"`,
    tx.amount,
    `"${tx.paymentMethod}"`,
    tx.isRecurring ? '"Yes"' : '"No"',
    `"${(tx.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="TakaTrack_Export_${month}.csv"`);
  res.send(csv);
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TakaTrack Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
