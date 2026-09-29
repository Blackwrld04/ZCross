'use client';

import React, { useState } from 'react';
import { 
  Shield, Zap, CheckCircle2, ArrowLeftRight, ArrowUpRight, 
  Settings, HelpCircle, MoreHorizontal, Plus, ArrowLeft,
  CreditCard, RefreshCw, BarChart2, Check, Lock, ExternalLink,
  Layers, Terminal, Cpu, Clock, Key
} from 'lucide-react';
import { SwapCard, DestinationToken } from './SwapCard';

interface WalletDashboardProps {
  network: 'mainnet' | 'testnet';
  destinations: DestinationToken[];
  onQuoteGenerated: (quoteData: any) => void;
  onOpenAuditor: () => void;
  onBackToLanding: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  network,
  destinations,
  onQuoteGenerated,
  onOpenAuditor,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'swap' | 'accounts' | 'transactions' | 'corridors' | 'watcher'>('dashboard');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-geist">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-amber-400 text-lg">⚡</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Protocol Overview
        </button>

        <div className="flex items-center gap-3">
          <span className="badge-tag badge-gold">
            Zcash Shielded Orchard (Halo 2)
          </span>
          <button
            onClick={onOpenAuditor}
            className="badge-tag badge-emerald cursor-pointer hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            Zero-Leak Invariant Guarded
          </button>
        </div>
      </div>

      {/* Main Desktop Window Frame matching user's design */}
      <div
        className="border-gradient before:rounded-[28px] [animation:fadeSlideIn_0.5s_ease-in-out_0.05s_both] xl:bg-neutral-900/80 bg-neutral-900/60 rounded-[28px] mr-auto ml-auto shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl border border-white/10 overflow-hidden"
      >
        {/* Desktop chrome */}
        <div
          className="flex sm:px-6 [animation:fadeSlideIn_0.5s_ease-in-out_0.1s_both] border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between bg-black/40"
        >
          <div className="flex gap-3 items-center [animation:fadeSlideIn_0.5s_ease-in-out_0.15s_both]">
            <div className="flex gap-2 items-center">
              <span className="h-3.5 w-3.5 rounded-full bg-red-500/90 inline-block cursor-pointer hover:opacity-80" onClick={onBackToLanding} title="Exit to Landing"></span>
              <span className="h-3.5 w-3.5 rounded-full bg-amber-400/90 inline-block cursor-pointer hover:opacity-80" onClick={() => setActiveTab('dashboard')} title="Dashboard"></span>
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/90 inline-block cursor-pointer hover:opacity-80" onClick={() => setActiveTab('swap')} title="Shielded Swap"></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3">
              <span className="text-xl font-semibold tracking-tight text-white font-geist">Z-HyperIntent Wallet</span>
              <span className="text-xs text-white/40 font-geist">Desktop Node</span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pure Shielded Mode (0 Leaks)
              </span>
            </div>
          </div>

          {/* Top actions */}
          <div className="flex items-center gap-2 sm:gap-3 [animation:fadeSlideIn_0.5s_ease-in-out_0.2s_both] relative">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('swap')}
                className={`inline-flex gap-2 border-gradient before:rounded-lg text-sm rounded-lg pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center font-geist cursor-pointer transition ${
                  activeTab === 'swap' 
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg' 
                    : 'text-slate-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Plus className="w-4 h-4" />
                New Shielded Swap
              </button>
            </div>

            <button
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className="inline-flex border-gradient before:rounded-lg hover:bg-white/10 bg-white/5 rounded-lg pt-2 pr-2 pb-2 pl-2 items-center justify-center cursor-pointer transition"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </button>

            {/* Options Dropdown */}
            {showOptionsDropdown && (
              <div className="absolute right-0 top-10 z-30 w-60 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-2 text-sm text-slate-300">
                <button
                  onClick={() => { setActiveTab('swap'); setShowOptionsDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                  Shielded Intent Swap
                </button>
                <button
                  onClick={() => { onOpenAuditor(); setShowOptionsDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Audit Zero-Leak Proofs
                </button>
                <button
                  onClick={() => { onBackToLanding(); setShowOptionsDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-2 border-t border-white/5 mt-1 pt-2"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  Back to Landing Page
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-12 min-h-[720px]">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 border-white/5 border-r bg-black/25">
            <div className="p-4 sm:p-6">
              <div className="mb-6 [animation:fadeSlideIn_0.5s_ease-in-out_0.25s_both]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-bold text-lg shadow-lg border border-amber-300/30">
                    🛡️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white font-geist">Shielded Operator</p>
                    <p className="text-xs text-amber-400 font-geist">Orchard Halo 2 • Mainnet</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-6">
                <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.3s_both]">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Overview</p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full group flex items-center gap-3 text-sm rounded-lg pt-2 pr-3 pb-2 pl-3 font-geist transition cursor-pointer ${
                          activeTab === 'dashboard'
                            ? 'text-white bg-white/10 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                        </svg>
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('swap')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'swap'
                            ? 'text-amber-400 bg-amber-400/10 font-bold border border-amber-400/20'
                            : 'text-amber-300/80 hover:bg-amber-400/5'
                        }`}
                      >
                        <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                        Shielded Swap (Active)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('accounts')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'accounts'
                            ? 'text-white bg-white/10 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-slate-400 group-hover:text-slate-200"
                        >
                          <line x1="12" x2="12" y1="2" y2="22"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        Vault Balances
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('transactions')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'transactions'
                            ? 'text-white bg-white/10 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-slate-400 group-hover:text-slate-200"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" x2="12" y1="15" y2="3"></line>
                        </svg>
                        Settlement History
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.35s_both]">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Cross-Chain Tools</p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('corridors')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'corridors'
                            ? 'text-white bg-white/10 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Execution Corridors
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('watcher')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'watcher'
                            ? 'text-white bg-white/10 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        Compact Block Watcher
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={onOpenAuditor}
                        className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Zero-Leak Auditor
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.4s_both]">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Shielded Vault</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-white font-geist">17.50 ZEC</p>
                      <p className="text-xs text-slate-400 font-geist">Pure Orchard</p>
                    </div>
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-emerald-300 font-geist">+$12,450</p>
                      <p className="text-xs text-slate-400 font-geist">Settled Vol</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 [animation:fadeSlideIn_0.5s_ease-in-out_0.45s_both]">
                  <button
                    onClick={() => showNotification('Viewing Key Settings: Export audit receipts or compliance credentials.')}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer text-left"
                  >
                    <Key className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                    Viewing Key Credentials
                  </button>

                  <button
                    onClick={onOpenAuditor}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                    Protocol Specifications
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content pane */}
          <section className="col-span-12 md:col-span-9 lg:col-span-9 relative flex flex-col">
            <div className="relative h-full min-h-[720px] flex flex-col">
              {activeTab === 'swap' ? (
                /* Cross-Chain Swap Active Tab */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter font-bold">
                        Shielded Cross-Chain Swap Engine
                      </h2>
                      <p className="text-sm text-slate-400 font-geist">
                        Route pure Zcash Orchard notes into Arbitrum USDC, Solana SOL, or Bitcoin with 0 leaks.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>

                  <SwapCard
                    network={network}
                    destinations={destinations}
                    onQuoteGenerated={onQuoteGenerated}
                  />
                </div>
              ) : activeTab === 'accounts' ? (
                /* Accounts Tab */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  <div>
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter font-bold">
                      Connected Vault Balances
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Shielded Orchard holdings and destination execution accounts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl border border-amber-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-400 font-bold text-sm">Zcash Shielded Orchard</span>
                        <span className="badge-tag badge-gold">Halo 2 Prover</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">17.50000000 ZEC</div>
                      <div className="text-xs text-emerald-400">~$24,850.42 USD • Pure Shielded Invariant</div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl border border-cyan-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-cyan-400 font-bold text-sm">Arbitrum One</span>
                        <span className="badge-tag badge-cyan">NEAR Intents Payout</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">12,450.00 USDC</div>
                      <div className="text-xs text-slate-400">Fast Sub-Minute Settlement</div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl border border-purple-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-purple-400 font-bold text-sm">Solana Native</span>
                        <span className="badge-tag badge-cyan">Raydium Solver</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">42.5000 SOL</div>
                      <div className="text-xs text-slate-400">Direct UTXO-to-Account Relay</div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl border border-orange-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-400 font-bold text-sm">Bitcoin Native</span>
                        <span className="badge-tag badge-gold">UTXO Channel</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">0.35400000 BTC</div>
                      <div className="text-xs text-slate-400">Taproot Settlement Channel</div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setActiveTab('swap')}
                      className="bg-amber-400 text-neutral-950 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-amber-300 transition shadow"
                    >
                      + Initiate Shielded Swap
                    </button>
                    <button
                      onClick={onOpenAuditor}
                      className="bg-white/10 text-white font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-white/15 transition border border-white/10"
                    >
                      Audit Proofs
                    </button>
                  </div>
                </div>
              ) : activeTab === 'corridors' ? (
                /* Corridors Tab */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  <div>
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter font-bold">
                      Active Execution Corridors
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Routing shielded ZEC directly to decentralized liquidity via NEAR Intents.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {destinations.map((dest, idx) => (
                      <div key={idx} className="border-gradient before:rounded-xl bg-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{dest.icon}</span>
                          <div>
                            <div className="text-white font-semibold text-sm">{dest.chainName} ({dest.symbol})</div>
                            <div className="text-xs text-slate-400 font-mono">{dest.assetId}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="badge-tag badge-emerald text-[10px]">Active &amp; Quoting</span>
                          <button
                            onClick={() => setActiveTab('swap')}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Swap Now →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'watcher' ? (
                /* Watcher Daemon Tab */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  <div>
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter font-bold">
                      Compact Block Watcher Daemon
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Continuous background listener indexing Orchard Merkle commitments.
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-inner space-y-2">
                    <div className="text-slate-400">// Z-HyperIntent Solver Daemon CLI: npm run solver</div>
                    <div>[Watcher] Connected to Zcash compact block stream at block #2,891,402</div>
                    <div>[Watcher] Scanning Orchard action commitments for vault Unified Address...</div>
                    <div className="text-amber-400">[Watcher] In-band memo decoder ready (ChaCha20-Poly1305, 512B constant pad)</div>
                    <div>[NEAR Intents] 1Click execution quotes synced with 15 market makers</div>
                    <div className="text-cyan-400">[Heartbeat] Daemon healthy. 0 dropped packets. Zero-leak invariant verified.</div>
                  </div>
                </div>
              ) : (
                /* Primary Dashboard Tab (Exact Alex Chen View from User Code with Authentic Domain Text) */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  {/* Header */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.5s_both]">
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter font-bold">
                      Welcome back, Shielded Operator
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Real-time status of your Orchard notes and cross-chain execution pipeline.
                    </p>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 [animation:fadeSlideIn_0.5s_ease-in-out_0.55s_both]">
                    <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Total Shielded Balance
                        </p>
                        <Shield className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">
                        $24,850.42
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-400 font-geist">17.50000000 ZEC</span>
                        <span className="text-slate-500 font-geist">(Orchard Pool)</span>
                      </div>
                    </div>

                    <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Cross-Chain Settled
                        </p>
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">
                        $12,450.00
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-cyan-400 font-geist">6 Corridors</span>
                        <span className="text-slate-500 font-geist">via NEAR Intents</span>
                      </div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Zero-Leak Privacy Score
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">100%</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 rounded-full"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.6s_both]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white font-geist">
                        Recent Shielded Cross-Chain Transactions
                      </h3>
                      <button 
                        onClick={() => setActiveTab('transactions')}
                        className="text-sm text-slate-400 hover:text-white transition font-geist cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="border-gradient before:rounded-lg flex bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm items-center justify-between hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              1.00 ZEC ➔ 1,420.00 USDC (Arbitrum One)
                            </p>
                            <p className="text-xs text-slate-400 font-geist">Settled in 64s via NEAR Intents • 0 Transparent Hops</p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-emerald-400 font-geist">
                          +$1,420.00 USDC
                        </p>
                      </div>

                      <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              0.50 ZEC ➔ 5.91 SOL (Solana Native)
                            </p>
                            <p className="text-xs text-slate-400 font-geist">
                              Settled in 42s via Raydium Solver • 512B Uniform Memo
                            </p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-purple-400 font-geist">+5.91 SOL</p>
                      </div>

                      <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              Shielded Inbound: Orchard Note
                            </p>
                            <p className="text-xs text-slate-400 font-geist">Received via Zashi Wallet • Halo 2 Proof Confirmed</p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-amber-400 font-geist">+2.5000 ZEC</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.65s_both]">
                    <h3 className="text-lg font-semibold text-white mb-4 font-geist">
                      Protocol Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={() => setActiveTab('swap')}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
                      >
                        <ArrowLeftRight className="w-6 h-6 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition" />
                        <p className="text-xs text-slate-300 font-geist">Shielded Swap</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('corridors')}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
                      >
                        <Layers className="w-6 h-6 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition" />
                        <p className="text-xs text-slate-300 font-geist">Corridors</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('swap')}
                        className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition cursor-pointer text-center group"
                      >
                        <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition" />
                        <p className="text-xs text-slate-300 font-geist">Deposit Note</p>
                      </button>

                      <button
                        onClick={onOpenAuditor}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
                      >
                        <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition" />
                        <p className="text-xs text-slate-300 font-geist">Audit Proofs</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
