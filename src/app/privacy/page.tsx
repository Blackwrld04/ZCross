'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, FileText, ArrowLeft, Trash2, Mail, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { LegalNavbar } from '@/components/LegalNavbar';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Non-Custodial Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif mb-4 text-slate-900 dark:text-white">
            Privacy Policy &amp; Data Transparency
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Effective Date: October 24, 2026. This Privacy Policy details every third-party service integrated into ZCross, the specific data collected, our non-custodial cryptographic guarantees, and your rights under GDPR, UK PECR, and CCPA.
          </p>
        </div>

        {/* Quick Action: Exercise Right to Erasure */}
        <div className="p-5 sm:p-6 mb-12 rounded-2xl bg-gray-50 dark:bg-zinc-950/70 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Exercise GDPR Article 17: Right to Erasure</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Instantly destroy all locally cached Orchard viewing keys, address book contacts, swap history, and session tokens.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('zcross:open_data_purge'));
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold transition shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Device Data Now</span>
          </button>
        </div>

        {/* Content Sections */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          
          {/* 1. Core Cryptographic Philosophy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              1. Non-Custodial Architecture &amp; Zero-Knowledge Commitments
            </h2>
            <p>
              ZCross is an open-source, non-custodial zero-knowledge bridge protocol designed to eliminate counterparty surveillance. Unlike traditional custodial cryptocurrency exchanges or centralized bridges, ZCross:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-zinc-400">
              <li>Does not maintain a centralized user account database with emails, usernames, or passwords.</li>
              <li>Never has access to, nor stores, your private spending keys or seed phrases.</li>
              <li>Generates all zero-knowledge proofs (Halo 2 / WASM) directly inside your web browser on client hardware.</li>
              <li>Rejects transparent Zcash addresses (<code className="text-xs font-mono">t-addr</code>) to prevent transparent graph linkage.</li>
            </ul>
          </section>

          {/* 2. Exhaustive Third-Party Services Matrix */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              2. Third-Party Services &amp; Data Collection Audit
            </h2>
            <p>
              In accordance with international privacy frameworks (GDPR Art. 13 &amp; 14), the table below explicitly discloses every third-party service, API, and tool integrated with ZCross, what data it collects, and why:
            </p>

            <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-100 dark:bg-zinc-900 text-slate-900 dark:text-white font-bold">
                  <tr>
                    <th className="p-3 border-b border-gray-200 dark:border-white/10">Service &amp; Provider</th>
                    <th className="p-3 border-b border-gray-200 dark:border-white/10">Purpose</th>
                    <th className="p-3 border-b border-gray-200 dark:border-white/10">Data Collected by Provider</th>
                    <th className="p-3 border-b border-gray-200 dark:border-white/10">Data Seen by ZCross</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      MoonPay
                      <div className="text-[11px] font-normal text-gray-500">MoonPay USA LLC / BVI</div>
                    </td>
                    <td className="p-3">Fiat-to-crypto on-ramp credit card &amp; Google Pay processing</td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Full legal name, email, billing address, government ID &amp; selfie (for tiered KYC compliance), card details, IP address, device fingerprint.
                    </td>
                    <td className="p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      Shielded order status, fiat amount, and destination Orchard UA. Zero raw card or identity numbers.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Google Pay Web API
                      <div className="text-[11px] font-normal text-gray-500">Google LLC</div>
                    </td>
                    <td className="p-3">1-Tap biometric payment tokenization in browser</td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Google Account identifier, payment method selection, device biometric confirmation (fingerprint/face).
                    </td>
                    <td className="p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      Ephemeral cryptographic payment token passed directly to processor. No Google profile data stored.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      NEAR Defuse Protocol
                      <div className="text-[11px] font-normal text-gray-500">1Click API / NEAR Foundation</div>
                    </td>
                    <td className="p-3">Cross-chain intent execution and market maker settlement</td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Public destination blockchain address (EVM, Solana, Bitcoin), requested quote amounts, public transaction hashes.
                    </td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Public solver fill receipt. Note: Source ZEC transaction remains private in Orchard pool with encrypted 512-byte memo.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Zcash lightwalletd Clusters
                      <div className="text-[11px] font-normal text-gray-500">Electric Coin Co. &amp; community nodes</div>
                    </td>
                    <td className="p-3">Compact block header synchronization and nullifier scanning</td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Connecting IP address, block range query.
                    </td>
                    <td className="p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      Consensus height and tree states. Spending keys never leave the client browser.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      WebAuthn / Passkeys
                      <div className="text-[11px] font-normal text-gray-500">Local Operating System Enclave</div>
                    </td>
                    <td className="p-3">Hardware-backed biometric authorization of local transactions</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Processed strictly on local secure hardware enclave (TouchID / FaceID / TPM). Never transmitted to any network server.
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      Cryptographic assertion signature only.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      CoinGecko API
                      <div className="text-[11px] font-normal text-gray-500">Gecko Labs Pte Ltd</div>
                    </td>
                    <td className="p-3">Real-time public cryptocurrency price estimation</td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Client/Server IP address during GET requests for exchange rates. No wallet data transmitted.
                    </td>
                    <td className="p-3 text-gray-600 dark:text-zinc-400">
                      Public USD exchange prices for ZEC, USDC, ETH, SOL, BTC.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Local Browser Storage & Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              3. Cookies and Local Device Storage
            </h2>
            <p>
              ZCross complies with the EU ePrivacy Directive and UK PECR regulations. We do not use third-party tracking pixels, Facebook Pixel, Google Analytics, or invasive session-replay spyware (such as Hotjar or FullStory).
            </p>
            <p>
              We utilize strictly necessary local storage keys to enable application functionality:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl font-mono">
                <span className="font-bold text-slate-900 dark:text-white block">zcross_theme</span>
                <span className="text-gray-500 dark:text-zinc-400 text-[11px]">Stores light/dark mode UI selection.</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl font-mono">
                <span className="font-bold text-slate-900 dark:text-white block">zcross_cookie_consent</span>
                <span className="text-gray-500 dark:text-zinc-400 text-[11px]">Records your GDPR consent preferences.</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl font-mono">
                <span className="font-bold text-slate-900 dark:text-white block">zcross_address_book</span>
                <span className="text-gray-500 dark:text-zinc-400 text-[11px]">Local contact labels saved exclusively on your device.</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl font-mono">
                <span className="font-bold text-slate-900 dark:text-white block">zcross_accounts</span>
                <span className="text-gray-500 dark:text-zinc-400 text-[11px]">Client-side encrypted viewing keys and shielded accounts.</span>
              </div>
            </div>
          </section>

          {/* 4. Your Rights Under GDPR & CCPA */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              4. User Rights Under GDPR, UK GDPR, and CCPA
            </h2>
            <p>Depending on your geographic location, you enjoy statutory rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-zinc-400">
              <li><strong>Right to Erasure (Article 17 GDPR):</strong> You have the absolute right to destroy all local records and session tokens at any time using our one-click Purge tool.</li>
              <li><strong>Right to Restrict Processing:</strong> You may reject non-essential telemetry via our cookie preference center.</li>
              <li><strong>Right of Access &amp; Portability:</strong> You may export your local address book and viewing keys directly through the wallet dashboard.</li>
              <li><strong>Right to Non-Discrimination:</strong> We do not penalize or restrict access for users exercising privacy rights.</li>
            </ul>
          </section>

          {/* 5. Contact Address for Legal & Privacy Requests */}
          <section className="space-y-3 pt-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
              5. Official Legal &amp; Privacy Contact
            </h2>
            <p>
              For formal legal notices, GDPR data requests, law enforcement inquiries, or regulatory communications, please contact our designated privacy representatives:
            </p>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Designated Privacy &amp; Legal Counsel</div>
                  <div className="font-mono text-gray-600 dark:text-zinc-400">privacy@zcross.network · legal@zcross.network</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Registered Correspondence Entity</div>
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
