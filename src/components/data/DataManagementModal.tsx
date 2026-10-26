import React, { useRef, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Cloud,
  Copy,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const {
    exportCSV,
    exportJSONBackup,
    importJSONBackup,
    clearAllTransactions,
    loadDemoData,
    transactions,
    user,
    signOut,
    forceCloudSync,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL transactions and start completely fresh? This cannot be undone.')) {
      clearAllTransactions();
      setFeedback({
        type: 'success',
        message: 'All dummy transactions and records have been cleared! You have a fresh slate.',
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleLoadDemo = () => {
    if (confirm('Load sample demonstration entries?')) {
      loadDemoData();
      setFeedback({
        type: 'success',
        message: 'Sample demo records loaded.',
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCopyVercelEnv = async () => {
    const envString = [
      `VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}`,
      `VITE_FIREBASE_APP_ID=${firebaseConfig.appId}`,
      `VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}`,
      `VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}`,
      `VITE_FIREBASE_DATABASE_ID=${firebaseConfig.firestoreDatabaseId}`,
      `VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}`,
      `VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(envString);
      setCopiedEnv(true);
      setFeedback({
        type: 'success',
        message: 'Vercel Environment Variables copied! Paste into Vercel Project Settings > Environment Variables.',
      });
      setTimeout(() => setCopiedEnv(false), 3000);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      console.error('Failed to copy env:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJSONBackup(content);
      if (success) {
        setFeedback({
          type: 'success',
          message: 'Data successfully restored from backup file!',
        });
        setTimeout(() => setFeedback(null), 3500);
      } else {
        setFeedback({
          type: 'error',
          message: 'Invalid backup file format. Please upload a valid TakaTrack JSON backup.',
        });
        setTimeout(() => setFeedback(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Cloud Database & Data Backup
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Firebase Firestore status, Vercel deployment keys, and backup tools
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* Cloud Database & Sync Status Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-500/5 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Cloud className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Firebase Firestore Database</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Connected
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Database ID: <code className="font-mono text-[10px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{firebaseConfig.firestoreDatabaseId}</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  {user ? (
                    <>Google অ্যাকাউন্ট: <strong className="text-slate-900 dark:text-white font-medium">{user.email}</strong></>
                  ) : (
                    <>সার্বক্ষণিক অটো-কানেকশন সক্রিয় (সব ডেটা স্বয়ংক্রিয়ভাবে Firebase ক্লাউডে সংরক্ষিত হচ্ছে)</>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={async () => {
                    await forceCloudSync();
                    setFeedback({
                      type: 'success',
                      message: 'Firebase ক্লাউডে সফলভাবে সিঙ্ক সম্পন্ন হয়েছে!',
                    });
                    setTimeout(() => setFeedback(null), 3500);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  <Cloud className="w-3 h-3" />
                  <span>এখনই ক্লাউড সিঙ্ক</span>
                </button>
                {user && (
                  <button
                    onClick={signOut}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    লগআউট
                  </button>
                )}

                <button
                  onClick={handleCopyVercelEnv}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Copy environment variables to paste in Vercel project settings"
                >
                  {copiedEnv ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEnv ? 'Copied .env!' : 'Copy Vercel .env'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 1. Export CSV */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                Export to CSV / Excel
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                UTF-8 BOM enabled for seamless Microsoft Excel opening
              </span>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* 2. Export JSON Backup */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                Full Database Backup (JSON)
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Backs up all transactions and budget settings
              </span>
            </div>
            <button
              onClick={exportJSONBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-colors shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
          </div>

          {/* 3. Restore JSON Backup */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                Restore from Backup
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Load previously saved JSON backup file
              </span>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-colors shadow-xs shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON</span>
              </button>
            </div>
          </div>

          {/* 4. Clear All Records (Fresh Start) */}
          <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">
                Clear All Transactions (Fresh Start)
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Wipes all records clean so you can enter your real data
              </span>
            </div>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>

          {/* 5. Optional Demo Data */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                Optional Demo Data
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Load sample demo entries to preview calculations
              </span>
            </div>
            <button
              onClick={handleLoadDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-colors shrink-0"
            >
              <span>Load Demo</span>
            </button>
          </div>

          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center pt-2">
            Total active transactions stored: <strong className="font-mono text-neutral-700 dark:text-neutral-300">{transactions.length}</strong>
          </div>

        </div>
      </div>
    </div>
  );
};
