'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { WalletDashboard } from '@/components/WalletDashboard';
import { DepositModal } from '@/components/DepositModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { PrivacyAuditor } from '@/components/PrivacyAuditor';
import { DestinationToken } from '@/components/SwapCard';
import { AuditReceiptData } from '@/core/crypto/receipt';

export default function Home() {
  const [view, setView] = useState<'landing' | 'wallet'>('landing');
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [destinations, setDestinations] = useState<DestinationToken[]>([
    {
      chain: 'arb',
      chainName: 'Arbitrum One',
      symbol: 'USDC',
      assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
      decimals: 6,
      icon: '💵',
    },
    {
      chain: 'sol',
      chainName: 'Solana',
      symbol: 'SOL',
      assetId: '1cs_v1:sol:native:sol',
      decimals: 9,
      icon: '🟣',
    },
    {
      chain: 'btc',
      chainName: 'Bitcoin Native',
      symbol: 'BTC',
      assetId: '1cs_v1:btc:native:coin',
      decimals: 8,
      icon: '₿',
    },
    {
      chain: 'eth',
      chainName: 'Ethereum Mainnet',
      symbol: 'USDC',
      assetId: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
      decimals: 6,
      icon: '💎',
    },
    {
      chain: 'base',
      chainName: 'Base',
      symbol: 'USDC',
      assetId: 'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near',
      decimals: 6,
      icon: '🔵',
    },
  ]);

  const [activeQuote, setActiveQuote] = useState<any | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<AuditReceiptData | null>(null);
  const [showAuditor, setShowAuditor] = useState<boolean>(false);

  // Fetch live token metadata from API
  useEffect(() => {
    fetch('/api/tokens')
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations && data.destinations.length > 0) {
          setDestinations(data.destinations);
        }
      })
      .catch((err) => console.warn('Using local token list fallback:', err.message));
  }, []);

  const handleFetchReceipt = async () => {
    if (!activeQuote?.swapId) return;
    try {
      const res = await fetch(`/api/swap/${activeQuote.swapId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.receipt) {
          setActiveReceipt(data.receipt);
        }
      }
    } catch (err) {
      console.error('Receipt fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen relative font-geist">
      {/* Render Selected View */}
      {view === 'landing' ? (
        <LandingPage
          onOpenWallet={() => setView('wallet')}
          onOpenAuditor={() => setShowAuditor(true)}
        />
      ) : (
        <WalletDashboard
          network={network}
          destinations={destinations}
          onQuoteGenerated={(quote) => setActiveQuote(quote)}
          onOpenAuditor={() => setShowAuditor(true)}
          onBackToLanding={() => setView('landing')}
        />
      )}

      {/* Active Modals */}
      {activeQuote && (
        <DepositModal
          quoteData={activeQuote}
          onClose={() => setActiveQuote(null)}
          onViewReceipt={handleFetchReceipt}
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {showAuditor && (
        <PrivacyAuditor onClose={() => setShowAuditor(false)} />
      )}
    </div>
  );
}
