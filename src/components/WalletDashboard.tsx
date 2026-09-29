'use client';

import React, { useState } from 'react';
import { 
  Shield, Zap, CheckCircle2, ArrowLeftRight, ArrowUpRight, 
  Settings, HelpCircle, MoreHorizontal, Plus, ArrowLeft,
  CreditCard, RefreshCw, BarChart2
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'swap' | 'accounts' | 'transactions' | 'cards' | 'transfers' | 'analytics'>('dashboard');
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
          Back to Swapster Overview
        </button>

        <div className="flex items-center gap-3">
          <span className="badge-tag badge-gold">
            Zcash Shielded Orchard
          </span>
          <button
            onClick={onOpenAuditor}
            className="badge-tag badge-emerald cursor-pointer hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            Zero-Leak Invariant Verified
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
              <span className="text-xl font-semibold tracking-tight text-white font-geist">Wallet</span>
              <span className="text-xs text-white/40 font-geist">Desktop</span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pure Shielded Mode
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
                New Transaction
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
              <div className="absolute right-0 top-10 z-30 w-56 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-2 text-sm text-slate-300">
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
                  <img
                    className="h-10 w-10 rounded-lg object-cover border-gradient before:rounded-lg ring-1 ring-white/10"
                    src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/9bf583f7-9a93-46c4-bb0a-4effddb01c86_320w.webp"
                    alt="profile"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white font-geist">Alex Chen</p>
                    <p className="text-xs text-amber-400 font-geist">Premium Shielded Account</p>
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
                        Accounts
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
                        Transactions
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
                  </ul>
                </div>

                <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.35s_both]">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Tools</p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('cards')}
                        className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-geist transition cursor-pointer ${
                          activeTab === 'cards'
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
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                        Cards
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('swap')}
                        className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer"
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
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        Transfers
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={onOpenAuditor}
                        className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer"
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
                          <line x1="18" x2="18" y1="20" y2="10"></line>
                          <line x1="12" x2="12" y1="20" y2="4"></line>
                          <line x1="6" x2="6" y1="20" y2="14"></line>
                        </svg>
                        Analytics
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.4s_both]">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-400 font-geist">Quick Access</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-white font-geist">$12,450</p>
                      <p className="text-xs text-slate-400 font-geist">Balance</p>
                    </div>
                    <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-xl font-semibold text-emerald-300 font-geist">+$420</p>
                      <p className="text-xs text-slate-400 font-geist">This month</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 [animation:fadeSlideIn_0.5s_ease-in-out_0.45s_both]">
                  <button
                    onClick={() => showNotification('Privacy Settings: Orchard Shielding strictly enforced.')}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer text-left"
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
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Settings
                  </button>

                  <button
                    onClick={onOpenAuditor}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 font-geist transition cursor-pointer text-left"
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
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    Help &amp; Support
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
                        Shielded Cross-Chain Swap
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
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter">Your Accounts</h2>
                    <p className="text-sm text-slate-400 font-geist">Connected multi-chain and shielded Orchard vaults.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-400 font-bold text-sm">Zcash Shielded Orchard</span>
                        <span className="badge-tag badge-gold">Halo 2</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">17.50000000 ZEC</div>
                      <div className="text-xs text-slate-400">~$24,850.42 USD • Pure Shielded</div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-cyan-400 font-bold text-sm">Arbitrum One</span>
                        <span className="badge-tag badge-cyan">NEAR Intents</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">12,450.00 USDC</div>
                      <div className="text-xs text-slate-400">Fast Settlement Vault</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('swap')}
                      className="bg-amber-400 text-neutral-950 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-amber-300 transition"
                    >
                      + Bridge / Swap ZEC
                    </button>
                  </div>
                </div>
              ) : activeTab === 'cards' ? (
                /* Virtual Cards Tab */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  <div>
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter">Virtual Cards</h2>
                    <p className="text-sm text-slate-400 font-geist">Instant virtual Visa & Mastercard linked to your shielded holdings.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="w-full h-48 bg-gradient-to-tr from-neutral-800 to-neutral-950 rounded-2xl p-6 border border-white/10 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-amber-400">SHIELDED PLATINUM</span>
                        <span className="text-white font-bold italic">Mastercard</span>
                      </div>
                      <div className="text-lg font-mono tracking-widest text-slate-300">•••• •••• •••• 8888</div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>ALEX CHEN</span>
                        <span>EXP 08/29</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Primary Dashboard Tab (Exact Alex Chen View from User Code) */
                <div className="flex-1 sm:px-8 overflow-y-auto pt-8 pr-4 pb-8 pl-4 space-y-6">
                  {/* Header */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.5s_both]">
                    <h2 className="text-2xl text-white mb-1 font-geist tracking-tighter">
                      Welcome back, Alex
                    </h2>
                    <p className="text-sm text-slate-400 font-geist">
                      Here's what's happening with your accounts today.
                    </p>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 [animation:fadeSlideIn_0.5s_ease-in-out_0.55s_both]">
                    <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Total Balance
                        </p>
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
                          className="w-4 h-4 text-emerald-400"
                        >
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">
                        $24,850.42
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-400 font-geist">+12.5%</span>
                        <span className="text-slate-500 font-geist">vs last month</span>
                      </div>
                    </div>

                    <div className="rounded-xl border-gradient before:rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Spending
                        </p>
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
                          className="w-4 h-4 text-orange-400"
                        >
                          <path d="M3 3v18h18"></path>
                          <path d="m19 9-5 5-4-4-3 3"></path>
                        </svg>
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">
                        $3,249.18
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-orange-400 font-geist">-8.2%</span>
                        <span className="text-slate-500 font-geist">vs last month</span>
                      </div>
                    </div>

                    <div className="border-gradient before:rounded-xl bg-white/5 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-geist">
                          Savings Goal
                        </p>
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
                          className="w-4 h-4 text-blue-400"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                      </div>
                      <p className="text-2xl text-white mb-1 font-geist tracking-tighter">68%</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-orange-300 to-orange-400 h-1.5 rounded-full"
                          style={{ width: '68%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.6s_both]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white font-geist">
                        Recent Transactions
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
                              className="w-5 h-5 text-emerald-400"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" x2="12" y1="3" y2="15"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              Salary Deposit
                            </p>
                            <p className="text-xs text-slate-400 font-geist">Today, 9:24 AM</p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-emerald-400 font-geist">
                          +$4,250.00
                        </p>
                      </div>

                      <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
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
                              className="w-5 h-5 text-orange-400"
                            >
                              <path d="M3 3v18h18"></path>
                              <rect width="4" height="7" x="7" y="10" rx="1"></rect>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              Amazon Purchase
                            </p>
                            <p className="text-xs text-slate-400 font-geist">
                              Yesterday, 3:42 PM
                            </p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-white font-geist">-$84.99</p>
                      </div>

                      <div className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
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
                              className="w-5 h-5 text-blue-400"
                            >
                              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white font-geist">
                              Netflix Subscription
                            </p>
                            <p className="text-xs text-slate-400 font-geist">Dec 28, 2024</p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-white font-geist">-$15.99</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="[animation:fadeSlideIn_0.5s_ease-in-out_0.65s_both]">
                    <h3 className="text-lg font-semibold text-white mb-4 font-geist">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={() => setActiveTab('swap')}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
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
                          className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-amber-400 transition"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <p className="text-xs text-slate-300 font-geist">Send Money</p>
                      </button>

                      <button
                        onClick={() => showNotification('Bill Pay: Utilities, rent, and card payments queued.')}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
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
                          className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-blue-400 transition"
                        >
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                        <p className="text-xs text-slate-300 font-geist">Pay Bills</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('swap')}
                        className="rounded-lg border-gradient before:rounded-lg bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition cursor-pointer text-center group"
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
                          className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-emerald-400 transition"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" x2="12" y1="15" y2="3"></line>
                        </svg>
                        <p className="text-xs text-slate-300 font-geist">Deposit</p>
                      </button>

                      <button
                        onClick={onOpenAuditor}
                        className="border-gradient before:rounded-lg hover:bg-white/10 transition bg-white/5 rounded-lg pt-4 pr-4 pb-4 pl-4 backdrop-blur-sm cursor-pointer text-center group"
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
                          className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-cyan-400 transition"
                        >
                          <line x1="18" x2="18" y1="20" y2="10"></line>
                          <line x1="12" x2="12" y1="20" y2="4"></line>
                          <line x1="6" x2="6" y1="20" y2="14"></line>
                        </svg>
                        <p className="text-xs text-slate-300 font-geist">Analytics</p>
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
