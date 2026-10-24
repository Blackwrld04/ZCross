'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, X, HardDrive, KeyRound, BookOpen, Clock } from 'lucide-react';

interface DataPurgeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DataPurgeModal({ isOpen: propIsOpen, onClose: propOnClose }: DataPurgeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [purgedCount, setPurgedCount] = useState<number>(0);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true);
    window.addEventListener('zcross:open_data_purge', handleOpen);
    return () => window.removeEventListener('zcross:open_data_purge', handleOpen);
  }, []);

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setInternalOpen(false);
    }
    setConfirmText('');
    setPurgeSuccess(false);
  };

  const handleExecutePurge = async () => {
    if (confirmText.trim().toUpperCase() !== 'PURGE') return;
    setIsPurging(true);

    try {
      let count = 0;

      try {
        await fetch('/api/onramp/clear', { method: 'POST' });
        count += 1;
      } catch {
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        count += window.localStorage.length;
        window.localStorage.clear();
      }

      if (typeof window !== 'undefined' && window.sessionStorage) {
        count += window.sessionStorage.length;
        window.sessionStorage.clear();
      }

      if (typeof window !== 'undefined' && window.indexedDB && window.indexedDB.databases) {
        try {
          const dbs = await window.indexedDB.databases();
          dbs.forEach((db) => {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
              count += 1;
            }
          });
        } catch {
        }
      }

      if (typeof document !== 'undefined') {
        document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
      }

      setPurgedCount(count);
      setPurgeSuccess(true);
      setIsPurging(false);

      setTimeout(() => {
        window.location.href = '/';
      }, 1800);
    } catch (err) {
      console.error('Error purging data:', err);
      setIsPurging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purge-dialog-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPurging) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-[500px] bg-white dark:bg-black border border-red-500/30 rounded-[28px] shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2
                id="purge-dialog-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif"
              >
                Delete Account &amp; Purge Data
              </h2>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                GDPR Article 17 Right to Erasure / Data Purge
              </p>
            </div>
          </div>
          {!isPurging && (
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {purgeSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center animate-in zoom-in">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Account &amp; Data Permanently Erased
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Successfully purged {purgedCount} local keys, contacts, cached transactions, and session cookies. Resetting application...
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Non-custodial explanation alert */}
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-xs text-red-700 dark:text-red-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-800 dark:text-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>Permanent &amp; Irreversible Local Action</span>
              </div>
              <p className="leading-relaxed">
                ZCross is a <strong>non-custodial zero-knowledge bridge</strong>. We do not store your private keys, passwords, or emails on central servers. Your account data resides entirely within your device&apos;s browser storage.
              </p>
            </div>

            {/* What will be purged */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-zinc-300 block">
                The following data will be permanently wiped:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Orchard Keys &amp; Seeds</span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">Address Book Contacts</span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="truncate">Cached Swap Orders</span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">Cookies &amp; State DBs</span>
                </div>
              </div>
            </div>

            {/* Confirmation input */}
            <div className="space-y-2 pt-2">
              <label
                htmlFor="confirm-purge-input"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300"
              >
                Type <span className="font-mono text-red-600 dark:text-red-400 font-black">PURGE</span> to confirm data destruction:
              </label>
              <input
                id="confirm-purge-input"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="PURGE"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-red-500/30 rounded-xl text-center font-mono text-sm font-bold tracking-widest text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPurging}
                className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePurge}
                disabled={confirmText.trim().toUpperCase() !== 'PURGE' || isPurging}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-bold transition shadow-lg shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPurging ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Wiping Device Data...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
