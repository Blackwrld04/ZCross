'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, AlertTriangle, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { LegalNavbar } from '@/components/LegalNavbar';

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Framework &amp; Liability Limitation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif mb-4 text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Effective Date: October 24, 2026. Please read these Terms of Service carefully before interacting with the ZCross software, smart contracts, or web interface.
          </p>
        </div>

        {/* Highlighted Warning Box */}
        <div className="p-5 sm:p-6 mb-10 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Important Notice: Non-Custodial Protocol &amp; Complete Assumption of Risk</span>
          </div>
          <p className="leading-relaxed">
            ZCross is a decentralized, non-custodial software application that provides client-side tooling to compose cryptographic transactions on public blockchains. ZCross does not take custody of, control, transmit, or hold title to any digital assets at any time.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          
          {/* 1. Protocol Nature */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              1. Nature of the Protocol &amp; Non-Custodial Status
            </h2>
            <p>
              The ZCross interface is a graphical client enabling users to formulate transactions for the Zcash Orchard shielded pool, NEAR Defuse solver networks, and connected blockchain protocols. At no point does the ZCross Protocol Foundation or its developers act as a broker, custodian, financial intermediary, money transmitter, or clearing agent.
            </p>
            <p>
              You maintain 100% exclusive control and custody of your cryptographic private keys, viewing keys, and digital assets. You are solely responsible for securing your seed phrases and backup keys.
            </p>
          </section>

          {/* 2. Comprehensive Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              2. Strict Limitation of Liability
            </h2>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 uppercase font-mono text-xs text-gray-800 dark:text-zinc-200 leading-normal">
              TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL ZCROSS, ITS CONTRIBUTORS, DIRECTORS, AFFILIATES, OR DEVELOPERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, ASSETS, OR CRYPTOGRAPHIC VALUE ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE PROTOCOL, WHETHER UNDER CONTRACT, TORT (INCLUDING NEGLIGENCE), OR STRICT LIABILITY.
            </div>
            <p>
              The developers and contributors do not guarantee that the software will be uninterrupted, error-free, or entirely impervious to bugs, smart contract failures, solver timeouts, or network reorganizations.
            </p>
          </section>

          {/* 3. Disclaimer of Warranties */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              3. Disclaimer of Warranties
            </h2>
            <p>
              THE PROTOCOL, INTERFACE, AND ALL ASSOCIATED SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          {/* 4. Prohibited Jurisdictions & Sanctions */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              4. Sanctions &amp; Prohibited Activities
            </h2>
            <p>You expressly represent and warrant that you:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-zinc-400">
              <li>Are not an individual or entity subject to sanctions administered or enforced by the U.S. Department of the Treasury&apos;s Office of Foreign Assets Control (OFAC), the United Nations Security Council, the European Union, or His Majesty&apos;s Treasury (UK).</li>
              <li>Do not reside in, or access the interface from, any comprehensively sanctioned jurisdiction (including Cuba, Iran, North Korea, Syria, or the Crimea/Donetsk/Luhansk regions).</li>
              <li>Will not use ZCross to conduct money laundering, terrorist financing, ransomware payouts, or illegal market manipulation.</li>
            </ul>
          </section>

          {/* 5. Autonomous Refunds & Solver Invariants */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              5. Solver Mechanics, Timing &amp; Refunds
            </h2>
            <p>
              Cross-chain intents rely upon autonomous, competitive solvers across decentralized networks. While ZCross enforces a strict Autonomous Refund Protocol that dispatches returns to your shielded Orchard vault upon timeout or failure, you acknowledge that blockchain transactions are irreversible once permanently confirmed. See our dedicated <Link href="/refunds" className="text-amber-500 underline font-semibold">Refund Policy</Link> for detailed mechanics.
            </p>
          </section>

          {/* 6. Governing Law & Dispute Resolution */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              6. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the substantive laws of Switzerland, without regard to conflict of law principles. Any dispute or claim arising out of or relating to these Terms shall be resolved by binding, confidential arbitration in Zug, Switzerland. You expressly waive any right to participate in a class-action lawsuit or class-wide arbitration.
            </p>
          </section>

          {/* 7. Legal Contact */}
          <section className="space-y-3 pt-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              7. Legal &amp; Regulatory Inquiries
            </h2>
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Legal Department</div>
                  <div className="font-mono text-gray-600 dark:text-zinc-400">legal@zcross.network</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Registered Headquarters</div>
                  <div className="text-gray-600 dark:text-zinc-400">
                    ZCross Protocol Foundation<br />
                    c/o Dammstrasse 19, 6300 Zug, Switzerland
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
