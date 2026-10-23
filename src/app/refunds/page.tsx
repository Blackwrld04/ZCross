'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCcw, ArrowLeft, ShieldCheck, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { LegalNavbar } from '@/components/LegalNavbar';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white selection:bg-amber-500 selection:text-black">
      <LegalNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to ZCross Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="border-b border-gray-200 dark:border-white/10 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-4">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Autonomous Protocol Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif mb-4 text-slate-900 dark:text-white">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Effective Date: October 24, 2026. This policy explains how autonomous programmatic refunds work for cross-chain swaps, fiat on-ramp card purchases, and timeout handling.
          </p>
        </div>

        {/* SLA Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Autonomous Solver SLA</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">&lt; 30 Mins</div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Unfilled or timed-out cross-chain intents are automatically returned to your shielded Orchard vault.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Fiat On-Ramp Void</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">Instant Void</div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Failed or undelivered Google Pay / card checkouts have pre-authorizations released immediately.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Human Tickets</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">Smart Contract</div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Refunds are programmatic and cryptographic. No support ticket or approval queue required.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          
          {/* Section 1: Cross-chain Swaps */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              1. Cross-Chain Shielded Swaps &amp; Autonomous Refund Protocol
            </h2>
            <p>
              When initiating a cross-chain swap from Shielded Zcash (Orchard) to external chains (Arbitrum USDC, Solana SOL, Bitcoin), your transaction includes an encrypted fallback return address inside the 512-byte memo.
            </p>
            <p>
              In the rare event that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-zinc-400">
              <li>Market volatility causes execution price to exceed your configured slippage tolerance;</li>
              <li>Network congestion prevents solver fill within the maximum 30-minute validity window; or</li>
              <li>The destination chain halts or encounters consensus reorganizations;</li>
            </ul>
            <p>
              The ZCross Autonomous Refund Engine (<code className="font-mono text-xs">AutonomousRefundEngine</code>) automatically unlocks the escrowed deposit and disburses an Orchard shielded refund back to your designated fallback address.
            </p>
          </section>

          {/* Section 2: Fiat On-Ramp */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              2. Fiat On-Ramp (Google Pay &amp; Card Payments)
            </h2>
            <p>
              Fiat on-ramp purchases are facilitated via licensed partner infrastructure (such as MoonPay):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-zinc-400">
              <li><strong>Pre-fulfillment Cancellation:</strong> If MoonPay cannot deliver the ZEC to your shielded Orchard Unified Address within 60 minutes due to compliance checks or banking declines, the card pre-authorization hold is voided automatically.</li>
              <li><strong>Post-Delivery Blockchain Finality:</strong> Once the ZEC transaction is mined and confirmed in the Zcash shielded Orchard pool, the transaction is cryptographically final. Due to the immutable nature of public blockchains, confirmed cryptocurrency disbursements cannot be recalled or refunded.</li>
              <li><strong>Chargeback &amp; Dispute Policy:</strong> Unauthorized transactions or fraudulent card usage are handled under standard card network rules (Visa/Mastercard) directly via MoonPay support.</li>
            </ul>
          </section>

          {/* Section 3: Invariant Protection */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              3. Strict Zero Transparent Address Rule
            </h2>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
              <strong>Crucial Safety Warning:</strong> ZCross enforces a strict zero-transparent-hop invariant. Any attempt to provide a transparent Zcash address (<code className="font-mono">t1...</code>) as a refund destination will be rejected by client validation and solver contracts. Refund addresses must strictly be shielded Unified Addresses (<code className="font-mono">u1...</code>).
            </div>
          </section>

          {/* Section 4: Contact & Escalations */}
          <section className="space-y-3 pt-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              4. Refund Inquiries &amp; Support Assistance
            </h2>
            <p>
              If an autonomous refund has not been received within 45 minutes of swap initiation, please check your nullifier sync status or reach out to our protocol operations team:
            </p>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 text-xs font-mono">
              Email: <span className="font-bold text-slate-900 dark:text-white">refunds@zcross.network</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
