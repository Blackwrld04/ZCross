'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowLeftRight, ArrowRight,
  ArrowLeft, RefreshCw, ExternalLink, Layers, Clock, 
  Copy, Check, FileText, Zap, BookOpen, CreditCard,
  Menu, X, ArrowUpRight, ArrowDownLeft, Banknote, Shield
} from 'lucide-react';
import { SwapCard, DestinationToken } from './SwapCard';
import { AuditReceiptData } from '@/core/crypto/receipt';
import { TokenIcon } from './TokenIcon';
import { WalletButton } from './WalletButton';
import { ShieldedWalletBadge } from './ShieldedWalletBadge';
import { AddressBookModal } from './AddressBookModal';
import { FiatOnrampModal } from './FiatOnrampModal';
import { ZCrossLogo, GooglePayLogo } from './BrandLogos';
import { ThemeToggle } from './ThemeToggle';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { useLivePrices } from '@/core/prices/PriceContext';

interface WalletDashboardProps {
  network: 'mainnet' | 'testnet';
  destinations: DestinationToken[];
  onQuoteGenerated: (quoteData: any) => void;
  onBackToLanding: () => void;
  onSelectReceipt?: (receipt: AuditReceiptData) => void;
}

interface HistoricalSwap {
  id: string;
  intent_hash: string;
  status: string;
  origin_asset: string;
  origin_amount: string;
  deposit_ua: string;
  dest_chain: string;
  dest_token: string;
  dest_recipient: string;
  dest_amount_est: string;
  dest_amount_min: string;
  zcash_tx_hash?: string;
  dest_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  network,
  destinations,
  onQuoteGenerated,
  onBackToLanding,
  onSelectReceipt,
}) => {
  const { balanceZec, fundWallet } = useEmbeddedWallet();
  const { zecPriceUsd } = useLivePrices();
  const [activeTab, setActiveTab] = useState<'swap' | 'history' | 'vault'>('swap');
  const [historySubTab, setHistorySubTab] = useState<'swaps' | 'fiat'>('swaps');
  const [swaps, setSwaps] = useState<HistoricalSwap[]>([]);
  const [fiatOrders, setFiatOrders] = useState<any[]>([]);
  const [loadingSwaps, setLoadingSwaps] = useState<boolean>(false);
  const [loadingFiatOrders, setLoadingFiatOrders] = useState<boolean>(false);
  const [clearingOrderId, setClearingOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [showAddressBook, setShowAddressBook] = useState<boolean>(false);
  const [showFiatModal, setShowFiatModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Fetch real swap history
  const fetchSwaps = async () => {
    setLoadingSwaps(true);
    try {
      const res = await fetch('/api/swap?limit=20');
      if (res.ok) {
        const data = await res.json();
        if (data.swaps) {
          setSwaps(data.swaps);
        }
      }
    } catch (err) {
      console.warn('Could not load swaps from API:', err);
    } finally {
      setLoadingSwaps(false);
    }
  };

  // Fetch fiat on-ramp and off-ramp orders
  const fetchFiatOrders = async () => {
    setLoadingFiatOrders(true);
    try {
      const res = await fetch('/api/onramp/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          setFiatOrders(data.orders);
        }
      }
    } catch (err) {
      console.warn('Could not load fiat orders:', err);
    } finally {
      setLoadingFiatOrders(false);
    }
  };

  // Simulate clearance for pending Google Pay settlement order
  const handleClearGooglePayOrder = async (orderId: string, cryptoAmount: number) => {
    setClearingOrderId(orderId);
    try {
      const res = await fetch('/api/onramp/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        if (cryptoAmount > 0) {
          fundWallet(cryptoAmount);
        }
        await fetchFiatOrders();
      }
    } catch (err) {
      console.error('Failed to clear Google Pay order:', err);
    } finally {
      setClearingOrderId(null);
    }
  };

  useEffect(() => {
    fetchSwaps();
    fetchFiatOrders();
    if (typeof window !== 'undefined' && window.location.search.includes('fiat_onramp=1')) {
      setShowFiatModal(true);
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateSettle = async (swapId: string) => {
    setSimulatingId(swapId);
    try {
      const res = await fetch('/api/swap/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swapId, action: 'full_flow' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.receipt && onSelectReceipt) {
          onSelectReceipt(data.receipt);
        }
        await fetchSwaps();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulatingId(null);
    }
  };

  const handleViewReceipt = async (swapId: string) => {
    try {
      const res = await fetch(`/api/swap/${swapId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.receipt && onSelectReceipt) {
          onSelectReceipt(data.receipt);
        }
      }
    } catch (err) {
      console.error('Error fetching receipt:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SETTLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled
          </span>
        );
      case 'SOLVER_EXECUTING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Zap className="w-3 h-3 text-cyan-600 animate-pulse" /> Executing
          </span>
        );
      case 'CONFIRMED_SHIELDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <CheckCircle2 className="w-3 h-3 text-amber-600" /> Confirmed
          </span>
        );
      case 'MEMO_DETECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Memo Decoded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3 text-gray-500" /> Created
          </span>
        );
    }
  };

  const getExplorerUrl = (chain: string, txHash: string) => {
    if (!txHash) return '#';
    if (chain === 'arb') return `https://arbiscan.io/tx/${txHash}`;
    if (chain === 'sol') return `https://solscan.io/tx/${txHash}`;
    if (chain === 'btc') return `https://mempool.space/tx/${txHash}`;
    if (chain === 'base') return `https://basescan.org/tx/${txHash}`;
    if (chain === 'eth') return `https://etherscan.io/tx/${txHash}`;
    return '#';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased selection:bg-black dark:selection:bg-amber-400 dark:selection:text-black font-sans transition-colors duration-200">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white p-2 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 transition font-medium cursor-pointer shrink-0"
              aria-label="Back to landing"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div 
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none"
            >
              <ZCrossLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
              <span className="tracking-tight font-bold text-lg sm:text-2xl text-slate-900 dark:text-white">ZCross</span>
            </div>
          </div>

          {/* Center Tabs Navigation (Desktop) */}
          <nav className="hidden xl:flex items-center bg-gray-100/90 dark:bg-slate-900/90 p-1 rounded-full border border-gray-200/60 dark:border-slate-800 shrink-0 mx-2">
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'swap'
                  ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Shielded Swap</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                fetchSwaps();
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Settlement History</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vault &amp; Corridors</span>
            </button>
          </nav>

          {/* Header Action Badges: Desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFiatModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 transition font-semibold cursor-pointer shadow-2xs"
              title="Fund via Google Pay"
            >
              <GooglePayLogo className="w-3.5 h-3.5" />
              <span>Buy ZEC</span>
            </button>

            <button
              onClick={() => setShowAddressBook(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 transition font-semibold cursor-pointer shadow-2xs"
              title="Open Address Book"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span className="hidden md:inline">Address Book</span>
            </button>

            <ThemeToggle variant="badge" />
            <ShieldedWalletBadge />
            <WalletButton />
          </div>

          {/* Header Action Badges: Mobile */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <ThemeToggle variant="icon" />
            <ShieldedWalletBadge />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-1 duration-150">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowFiatModal(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <GooglePayLogo className="w-4 h-4" />
                <span>Buy ZEC</span>
              </span>
              <span className="text-[10px] uppercase font-bold bg-black dark:bg-amber-500 text-white dark:text-black px-2 py-0.5 rounded-full">GPay</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowAddressBook(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-800 dark:text-slate-300" />
                <span>Address Book &amp; Web3 Domains</span>
              </span>
            </button>

            <ThemeToggle variant="switch" />

            <div className="pt-1">
              <WalletButton className="w-full justify-center" />
            </div>
          </div>
        )}

        {/* Sub-Header Tabs for Small / Medium Screens */}
        <div className="xl:hidden w-full px-3 py-2 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 flex items-center justify-center">
          <nav className="flex items-center bg-gray-200/80 dark:bg-slate-900/90 p-1 rounded-full w-full max-w-sm justify-between shadow-2xs border border-transparent dark:border-slate-800">
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition text-center cursor-pointer ${
                activeTab === 'swap' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold' : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchSwaps();
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition text-center cursor-pointer ${
                activeTab === 'history' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold' : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition text-center cursor-pointer ${
                activeTab === 'vault' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold' : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Corridors
            </button>
          </nav>
        </div>
      </header>

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
        {activeTab === 'swap' && (
          <div className="space-y-6">
            <SwapCard
              network={network}
              destinations={destinations}
              onQuoteGenerated={onQuoteGenerated}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settlement History</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Complete audit trail of all shielded cross-chain intents and multi-rail fiat payments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sub-Tab Navigation: Swaps vs Fiat Rails */}
                <div className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-full border border-gray-200 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => setHistorySubTab('swaps')}
                    className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      historySubTab === 'swaps'
                        ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold'
                        : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>Cross-Chain Swaps</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 dark:bg-black/20 font-mono">
                      {swaps.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setHistorySubTab('fiat');
                      fetchFiatOrders();
                    }}
                    className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer flex items-center gap-1.5 relative ${
                      historySubTab === 'fiat'
                        ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs font-bold'
                        : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>Google Pay Settlements</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 dark:bg-black/20 font-mono">
                      {fiatOrders.length}
                    </span>
                    {fiatOrders.some((o) => o.status === 'PENDING') && (
                      <span 
                        className="w-2 h-2 rounded-full bg-amber-500 animate-pulse absolute -top-0.5 -right-0.5 border border-white dark:border-slate-900" 
                        title="Active pending Google Pay settlement"
                      />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    fetchSwaps();
                    fetchFiatOrders();
                  }}
                  disabled={loadingSwaps || loadingFiatOrders}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-200 hover:text-black dark:hover:text-white text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSwaps || loadingFiatOrders ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {historySubTab === 'swaps' ? (
              swaps.length === 0 ? (
                <div className="text-center py-20 px-4 bg-gray-50/80 dark:bg-slate-900/60 rounded-3xl border border-gray-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-400 mx-auto mb-3 shadow-xs">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Swaps Initiated Yet</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                    Your settlement history will appear here once you create an intent.
                  </p>
                  <button
                    onClick={() => setActiveTab('swap')}
                    className="px-5 py-2.5 rounded-full bg-black dark:bg-amber-500 text-white dark:text-black font-semibold text-xs hover:bg-gray-800 dark:hover:bg-amber-400 transition shadow-sm cursor-pointer"
                  >
                    Create Shielded Swap →
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/90 dark:bg-slate-950/90 border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="px-6 py-4">Intent / Time</th>
                          <th className="px-6 py-4">Route</th>
                          <th className="px-6 py-4">Amounts</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Destination Tx</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {swaps.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{item.id.slice(0, 8)}...</span>
                                <button
                                  onClick={() => copyToClipboard(item.id, item.id)}
                                  className="text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"
                                  title="Copy Swap ID"
                                >
                                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                                  ZEC
                                </span>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                <span className="text-slate-900 font-bold">{item.dest_token}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-mono px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">
                                  {item.dest_chain}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5 font-mono">
                                To: {item.dest_recipient.slice(0, 6)}...{item.dest_recipient.slice(-4)}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="text-slate-900 font-bold">{item.origin_amount} ZEC</div>
                              <div className="text-emerald-700 text-xs font-semibold">
                                ≈ {item.dest_amount_est} {item.dest_token}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>

                            <td className="px-6 py-4">
                              {item.dest_tx_hash ? (
                                <a
                                  href={getExplorerUrl(item.dest_chain, item.dest_tx_hash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-cyan-700 hover:text-cyan-900 underline font-mono text-[11px]"
                                >
                                  <span>{item.dest_tx_hash.slice(0, 8)}...</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">Pending settlement</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {item.status === 'SETTLED' ? (
                                  <button
                                    onClick={() => handleViewReceipt(item.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3 text-emerald-600" />
                                    <span>Receipt</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSimulateSettle(item.id)}
                                    disabled={simulatingId === item.id}
                                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition cursor-pointer shadow-xs disabled:opacity-50"
                                  >
                                    <Zap className="w-3 h-3 text-amber-400" />
                                    <span>{simulatingId === item.id ? 'Settling...' : '1-Click Settle'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ) : (
              /* Google Pay Orders View */
              fiatOrders.length === 0 ? (
                <div className="text-center py-20 px-4 bg-gray-50/80 dark:bg-slate-900/60 rounded-3xl border border-gray-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-400 mx-auto mb-3 shadow-xs">
                    <GooglePayLogo className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Google Pay Settlements Recorded</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                    Use Google Pay to instantly fund your Orchard shielded ZEC vault with biometric 1-tap checkout.
                  </p>
                  <button
                    onClick={() => {
                      setShowFiatModal(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-black dark:bg-amber-500 text-white dark:text-black font-semibold text-xs hover:bg-gray-800 dark:hover:bg-amber-400 transition shadow-sm cursor-pointer inline-flex items-center gap-2"
                  >
                    <GooglePayLogo className="w-4 h-4" />
                    <span>Buy ZEC with Google Pay →</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/90 dark:bg-slate-950/90 border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="px-6 py-4">Order / Time</th>
                          <th className="px-6 py-4">Method &amp; Provider</th>
                          <th className="px-6 py-4">Amounts</th>
                          <th className="px-6 py-4">Settlement Status</th>
                          <th className="px-6 py-4">Shielded Vault</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {fiatOrders.map((order) => {
                          const isPending = order.status === 'PENDING';

                          return (
                            <tr key={order.orderId} className={`transition ${isPending ? 'bg-amber-50/40 dark:bg-amber-950/20' : 'hover:bg-gray-50/70 dark:hover:bg-slate-800/50'}`}>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                                  <span>{order.orderId.slice(0, 14)}...</span>
                                  <button
                                    onClick={() => copyToClipboard(order.orderId, order.orderId)}
                                    className="text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedId === order.orderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase bg-black dark:bg-amber-500 text-white dark:text-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <GooglePayLogo className="w-3 h-3" />
                                    Google Pay
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 capitalize font-medium">
                                  {order.providerId === 'google_pay_direct' ? 'Native Web API' : order.providerId}
                                  {order.googlePayTransactionId && (
                                    <span className="font-mono text-[9px] text-gray-400 ml-1">
                                      ({order.googlePayTransactionId.slice(0, 8)}...)
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="text-slate-900 dark:text-white font-bold font-mono">
                                  ${order.fiatAmount} {order.fiatCurrency}
                                </div>
                                <div className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold font-mono">
                                  ➔ {order.cryptoAmount} ZEC
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                {isPending ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-bold animate-pulse">
                                    <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                    Pending Token Settlement
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Settled (Shielded)
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-4 font-mono text-[11px] text-gray-600 dark:text-slate-400 truncate max-w-[180px]">
                                {order.destinationAddress 
                                  ? `${order.destinationAddress.slice(0, 10)}...${order.destinationAddress.slice(-6)}`
                                  : 'Shielded Orchard'}
                              </td>

                              <td className="px-6 py-4 text-right">
                                {isPending ? (
                                  <button
                                    onClick={() => handleClearGooglePayOrder(order.orderId, order.cryptoAmount)}
                                    disabled={clearingOrderId === order.orderId}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                                  >
                                    <Zap className="w-3 h-3" />
                                    <span>{clearingOrderId === order.orderId ? 'Settling...' : 'Confirm Settle'}</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                    <Shield className="w-3 h-3" />
                                    100% Shielded
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Shielded Vault &amp; Liquidity Corridors</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Current pool holdings and decentralized solver connectivity.
              </p>
            </div>

            {/* Featured Vault Card */}
            <div className="bg-slate-950 dark:bg-slate-900/90 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden border border-gray-800 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
                    <TokenIcon symbol="ZEC" className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Shielded Zcash Vault
                  </span>
                </div>
              </div>

              <div className="text-3xl sm:text-6xl font-bold tracking-tight mb-2">
                {balanceZec > 0 ? `${balanceZec.toFixed(4)} ZEC` : '17.50000000 ZEC'}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 font-light">
                ≈ ${((balanceZec > 0 ? balanceZec : 17.5) * zecPriceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD • Connected Orchard Vault
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveTab('swap')}
                  className="px-6 py-3 rounded-full bg-white dark:bg-amber-500 text-black font-semibold text-xs hover:bg-gray-100 dark:hover:bg-amber-400 transition shadow-sm cursor-pointer"
                >
                  Initiate Shielded Swap →
                </button>
              </div>
            </div>

            {/* Active Cross-Chain Corridors */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Cross-Chain Liquidity Corridors</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((dest) => (
                  <div
                    key={`${dest.chain}-${dest.symbol}`}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                            <TokenIcon symbol={dest.symbol} chain={dest.chain} className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{dest.symbol}</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">{dest.chainName}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      </div>

                      <div className="text-xs text-gray-400 dark:text-slate-500 font-mono truncate mb-4">
                        {dest.assetId}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
                      <span className="text-gray-500 dark:text-slate-400 font-medium">Latency: ~45s</span>
                      <button
                        onClick={() => setActiveTab('swap')}
                        className="text-slate-900 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold cursor-pointer"
                      >
                        Swap →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Address Book Modal */}
      {showAddressBook && (
        <AddressBookModal
          onSelectAddress={(addr) => {
            // When opened from header, close modal
            setShowAddressBook(false);
          }}
          onClose={() => setShowAddressBook(false)}
        />
      )}

      {/* Google Pay Shielded On-Ramp Modal */}
      {showFiatModal && (
        <FiatOnrampModal
          onSuccess={() => fetchFiatOrders()}
          onClose={() => {
            setShowFiatModal(false);
            fetchFiatOrders();
          }}
        />
      )}
    </div>
  );
};
