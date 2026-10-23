'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X, ChevronRight, Sliders, Check } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'zcross_cookie_consent';

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    performance: false,
    functional: false,
    timestamp: '',
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Small delay to allow initial page render without jarring layout shift
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore local storage error
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      const payload = {
        ...prefs,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('zcross:cookie_consent', { detail: payload }));
    } catch {
      // Ignore storage error
    }
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      performance: true,
      functional: true,
      timestamp: '',
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      performance: false,
      functional: false,
      timestamp: '',
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Privacy and Cookie Consent"
      className="fixed bottom-0 sm:bottom-6 inset-x-0 sm:inset-x-auto sm:right-6 z-[9990] w-full sm:max-w-[480px] p-4 sm:p-0 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-[24px] shadow-2xl p-5 text-slate-900 dark:text-white ring-1 ring-black/5 dark:ring-white/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Privacy &amp; Cookie Consent
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                EU / UK GDPR &amp; ePrivacy Directive Compliant
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed mb-4">
          ZCross uses strictly necessary local storage cookies to maintain cryptographic session state, theme preferences, and RPC connectivity. No personal tracking or cross-site profiling cookies are used.
        </p>

        {/* Detailed Preferences Accordion */}
        {showPreferences ? (
          <div className="space-y-3 mb-4 p-3.5 bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-white/10 rounded-xl text-xs">
            {/* Essential */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Strictly Necessary</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Required for client-side zero-knowledge proofs, theme, and wallet routing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-4 h-4 accent-amber-500 opacity-60 cursor-not-allowed"
              />
            </div>

            {/* Performance */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Anonymous Performance Telemetry
                </span>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Aggregated solver latency and bridge success rates (zero wallet links).
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.performance}
                onChange={(e) =>
                  setPreferences({ ...preferences, performance: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Functional Settings
                </span>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Caches chosen destination chains and currency presets locally.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) =>
                  setPreferences({ ...preferences, functional: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        ) : null}

        {/* Links */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400 mb-4">
          <Link
            href="/privacy"
            className="hover:text-black dark:hover:text-white underline underline-offset-2 transition"
          >
            Privacy Policy
          </Link>
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center gap-1 text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white font-medium transition cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>{showPreferences ? 'Hide Options' : 'Customize'}</span>
          </button>
          <Link
            href="/terms"
            className="hover:text-black dark:hover:text-white underline underline-offset-2 transition"
          >
            Terms of Service
          </Link>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {showPreferences ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="col-span-2 py-2.5 px-4 rounded-xl bg-black dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save My Preferences</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition cursor-pointer"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="py-2.5 px-3 rounded-xl bg-black dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
