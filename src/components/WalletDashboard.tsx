'use client';

import React, { useState } from 'react';
import { 
  Shield, Zap, Lock, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, 
  Settings, HelpCircle, CheckCircle2, Copy, ExternalLink, Plus, MoreHorizontal 
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'swap' | 'accounts' | 'transactions'>('swap');
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          ← Back to Overview
        </button>

        <div className="flex items-center gap-3">
          <span className="badge-tag badge-gold">
            Zcash Hackathon Cross-Chain Track
          </span>
          <button
            onClick={onOpenAuditor}
            className="badge-tag badge-emerald cursor-pointer hover:brightness-110"
          >
            Zero-Leak Invariant Verified
          </button>
        </div>
      </div>

      {/* Main Desktop Window Frame */}
      <div className="border-gradient before:rounded-[28px] xl:bg-neutral-900/80 bg-neutral-900/60 rounded-[28px] mr-auto ml-auto shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl border border-white/10 overflow-hidden">
        {/* Desktop chrome */}
        <div className="flex sm:px-6 border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between bg-black/30">
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <span className="h-3.5 w-3.5 rounded-full bg-red-500/90"></span>
              <span className="h-3.5 w-3.5 rounded-full bg-amber-400/90"></span>
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/90"></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3">
              <span className="text-xl font-semibold tracking-tight text-white font-geist">Swapster Wallet</span>
              <span className="text-xs text-white/40 font-geist">Shielded Orchard v1.0</span>
            </div>
          </div>

          {/* Top actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('swap')}
                className={`inline-flex gap-2 border-gradient before:rounded-lg text-sm rounded-lg pt-1.5 pr-3 pb-1.5 pl-3 items-center font-geist transition ${
                  activeTab === 'swap' 
                    ? 'bg-amber-400 text-neutral-950 font-bold' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Plus className="w-4 h-4" />
                Cross-Chain Swap
              </button>
            </div>
            <button className="inline-flex border-gradient before:rounded-lg hover:bg-white/10 bg-white/5 rounded-lg p-2 items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-12 min-h-[720px]">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 border-white/5 border-r bg-black/20">
            <div className="p-4 sm:p-6">
              {/* Profile Card */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-lg shadow-lg">
                    🛡️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white font-geist">Shielded Account</p>
                    <p className="text-xs text-amber-400 font-geist">Orchard Halo 2 • {network.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-6">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Overview</p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full group flex items-center gap-3 text-sm rounded-lg pt-2 pr-3 pb-2 pl-3 font-geist transition ${
                          activeTab === 'dashboard' ? 'text-white bg-white/10 font-medium' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
                        className={`w-full group flex items-center gap-3 text-sm rounded-lg pt-2 pr-3 pb-2 pl-3 font-geist transition ${
                          activeTab === 'swap' ? 'text-amber-400 bg-amber-400/10 font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                        Shielded Swap (Active)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('transactions')}
                        className={`w-full group flex items-center gap-3 text-sm rounded-lg pt-2 pr-3 pb-2 pl-3 font-geist transition ${
                          activeTab === 'transactions' ? 'text-white bg-white/10 font-medium' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" x2="12" y1="15" y2="3"></line>
                        </svg>
                        Transactions
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Cross-Chain Tools</p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('swap')}
                        className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist"
                      >
                        <Zap className="w-4 h-4 text-cyan-400" />
                        NEAR 1Click Bridge
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={onOpenAuditor}
                        className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        Zero-Leak Auditor
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Quick Access stats */}
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Shielded Vault</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-white font-geist">14.85 ZEC</p>
                      <p className="text-xs text-slate-400 font-geist">Orchard Balance</p>
                    </div>
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-emerald-300 font-geist">~$21,087</p>
                      <p className="text-xs text-slate-400 font-geist">USD Value</p>
                    </div>
                  </div>
                </div>

                {/* Settings & Help */}
                <div className="space-y-1 pt-4 border-t border-white/5">
                  <a
                    href="https://zips.z.cash/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    ZIP 316 / 321 Specs ↗
                  </a>
                  <a
                    href="https://docs.near-intents.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    NEAR Intents Docs ↗
                  </a>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content pane */}
          <section className="col-span-12 md:col-span-9 relative flex flex-col p-6 sm:p-8">
            {activeTab === 'swap' ? (
              /* Swap Tab: Embeds our Shielded Cross-Chain SwapCard */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl text-white font-geist font-bold tracking-tight">
                      Shielded Cross-Chain Swap
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Route funds from Zcash Orchard into Arbitrum, Solana, and Bitcoin without unshielding.
                    </p>
                  </div>

                  <span className="badge-tag badge-gold">
                    Dual-Mode Active
                  </span>
                </div>

                <SwapCard
                  network={network}
                  destinations={destinations}
                  onQuoteGenerated={onQuoteGenerated}
                />
              </div>
            ) : (
              /* Overview Dashboard Tab */
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter">
                    Welcome to your Shielded Portfolio
                  </h2>
                  <p className="text-sm text-slate-400 font-geist">
                    Monitor your shielded ZEC holdings and cross-chain execution pipeline.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">Total Shielded Balance</p>
                      <Shield className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl text-white mb-1 font-geist tracking-tighter">$21,087.00</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-emerald-400 font-geist">14.85000000 ZEC</span>
                      <span className="text-slate-500 font-geist">(Orchard Pool)</span>
                    </div>
                  </div>

                  <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">Cross-Chain Settled</p>
                      <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-2xl text-white mb-1 font-geist tracking-tighter">$8,520.40</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-cyan-400 font-geist">6 Corridors</span>
                      <span className="text-slate-500 font-geist">via NEAR Intents</span>
                    </div>
                  </div>

                  <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">Zero-Leak Privacy Score</p>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl text-white mb-1 font-geist tracking-tighter">100%</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                      <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 font-geist">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button 
                      onClick={() => setActiveTab('swap')}
                      className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg p-4 backdrop-blur-sm text-center"
                    >
                      <ArrowLeftRight className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-geist">Swap ZEC</p>
                    </button>

                    <button 
                      onClick={() => setActiveTab('swap')}
                      className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg p-4 backdrop-blur-sm text-center"
                    >
                      <ArrowUpRight className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-geist">Bridge Out</p>
                    </button>

                    <button 
                      onClick={onOpenAuditor}
                      className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg p-4 backdrop-blur-sm text-center"
                    >
                      <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-geist">Audit Proofs</p>
                    </button>

                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg p-4 backdrop-blur-sm text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-300 mx-auto mb-2">
                        <line x1="18" x2="18" y1="20" y2="10"></line>
                        <line x1="12" x2="12" y1="20" y2="4"></line>
                        <line x1="6" x2="6" y1="20" y2="14"></line>
                      </svg>
                      <p className="text-xs text-slate-300 font-geist">History</p>
                    </button>
                  </div>
                </div>

                {/* Recent Intent Swaps */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white font-geist">Recent Shielded Cross-Chain Transactions</h3>
                    <button 
                      onClick={() => setActiveTab('swap')} 
                      className="text-sm text-amber-400 hover:underline font-geist"
                    >
                      + New Swap
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="border-gradient before:rounded-lg flex bg-white/5 rounded-lg p-4 backdrop-blur-sm items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
                          🛡️
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white font-geist">1.0 ZEC ➔ 1,420.00 USDC (Arbitrum)</p>
                          <p className="text-xs text-slate-400 font-geist">Settled via NEAR Intents • 0 Transparent Hops</p>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-emerald-400 font-geist">+$1,420.00 USDC</p>
                    </div>

                    <div className="border-gradient before:rounded-lg flex bg-white/5 rounded-lg p-4 backdrop-blur-sm items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
                          🟣
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white font-geist">0.5 ZEC ➔ 5.91 SOL (Solana)</p>
                          <p className="text-xs text-slate-400 font-geist">Settled via Solver Relay • Memo Padded 512B</p>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-cyan-400 font-geist">+5.91 SOL</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
