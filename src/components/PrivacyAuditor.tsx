'use client';

import React from 'react';
import { X, ShieldCheck, Zap, CheckCircle2, Lock, Key } from 'lucide-react';

interface PrivacyAuditorProps {
  onClose: () => void;
}

export const PrivacyAuditor: React.FC<PrivacyAuditorProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Security &amp; Cryptographic Architecture</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Zero-Leak Security Invariants</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Mathematical verification of privacy guarantees, uniform memo padding, and non-custodial solver execution.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* 1. Privacy Pillar */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Pure Shielded Isolation</h3>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Zero transparent addresses (t-addr) accepted.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Pure Orchard pool (ZIP 316 Unified Addresses).
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Halo 2 recursive zero-knowledge proving system.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Zero transaction graph linkability.
              </li>
            </ul>
          </div>

          {/* 2. Metadata Defense */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Constant-Length Memos</h3>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> In-band ChaCha20-Poly1305 note ciphertexts.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> Exact 512-byte uniform padding eliminates side-channels.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> Destination chains and tokens hidden from observers.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> Forward secrecy across all note transfers.
              </li>
            </ul>
          </div>

          {/* 3. Non-Custodial Solvers */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Non-Custodial Solvers</h3>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /> Integration with NEAR Intents 1Click protocol.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /> Cryptographically signed guaranteed quotes.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /> Automatic timeout and shielded refund fallbacks.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /> No wrapped intermediary tokens or bridge honeypots.
              </li>
            </ul>
          </div>

          {/* 4. Compliance Receipts */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Verifiable Audit Receipts</h3>
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" /> Cryptographic audit receipt for every swap.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" /> Viewing Key fingerprints for institutional compliance.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" /> Spending authority remains 100% private.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" /> Verifiable on public blockchain explorers.
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Anti-Timing Chaff & Statistical Heuristic Shielding */}
        <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-800 dark:text-cyan-300">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">5. Statistical Timing-Correlation Defense (Chaff / Jitter)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-800 px-2.5 py-0.5 rounded-full">
              Anti-Heuristic Standard
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Even with 512-byte constant-padded encrypted memos, external surveillance vendors (TRM Labs, Chainalysis) attempt to correlate note broadcast timestamps in Zcash blocks with payout blocks on Arbitrum or Solana. ZCross mitigates this attack surface with automated solver jitter and chaff note generation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span>Randomized 15s–120s payout delay jitter.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span>Dual decoy Orchard note splits synthesized.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span>Zero temporal correlation with destination leg.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span>Protects high-value transfers from clustering.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-full bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs transition cursor-pointer shadow-sm"
        >
          Got it, Close Overview
        </button>
      </div>
    </div>
  );
};
