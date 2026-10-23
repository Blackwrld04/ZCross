'use client';

import React from 'react';
import Link from 'next/link';
import { ZCrossLogo } from '@/components/BrandLogos';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, Trash2, ArrowLeft } from 'lucide-react';

export function LegalNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-transform group-hover:scale-105">
              <ZCrossLogo className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              ZCross
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-white/10">
            Legal &amp; Compliance
          </span>
        </div>

        {/* Center/Right Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/privacy"
            className="hidden md:inline-block text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition px-2.5 py-1.5 rounded-lg"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hidden md:inline-block text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition px-2.5 py-1.5 rounded-lg"
          >
            Terms
          </Link>
          <Link
            href="/refunds"
            className="hidden md:inline-block text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition px-2.5 py-1.5 rounded-lg"
          >
            Refunds
          </Link>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('zcross:open_data_purge'));
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            title="Erase all local cryptographic keys and cached data"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Purge Data</span>
          </button>

          <ThemeToggle variant="badge" />

          <Link
            href="/swap"
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-black dark:bg-amber-500 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-amber-400 transition shadow-xs shrink-0"
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
