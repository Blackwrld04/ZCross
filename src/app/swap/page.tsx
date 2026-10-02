'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WalletDashboard } from '@/components/WalletDashboard';
import { DepositModal } from '@/components/DepositModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { DestinationToken } from '@/components/SwapCard';
import { AuditReceiptData } from '@/core/crypto/receipt';
import { WalletProvider } from '@/core/wallet/WalletContext';
import { EmbeddedWalletProvider } from '@/core/zcash/EmbeddedWalletContext';

export default function SwapPage() {
  const router = useRouter();
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [destinations, setDestinations] = useState<DestinationToken[]>([
    {
      chain: 'arb',
      chainName: 'Arbitrum One',
      symbol: 'USDC',
      assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
      decimals: 6,
      icon: 'usdc',
    },
    {
      chain: 'sol',
      chainName: 'Solana',
      symbol: 'SOL',
      assetId: 'nep141:sol.omft.near',
      decimals: 9,
      icon: 'sol',
    },
    {
      chain: 'btc',
      chainName: 'Bitcoin Native',
      symbol: 'BTC',
      assetId: 'nep141:btc.omft.near',
      decimals: 8,
      icon: 'btc',
    },
    {
      chain: 'eth',
      chainName: 'Ethereum Mainnet',
      symbol: 'USDC',
      assetId: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
      decimals: 6,
      icon: 'usdc',
    },
    {
      chain: 'base',
      chainName: 'Base',
      symbol: 'USDC',
      assetId: 'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near',
      decimals: 6,
      icon: 'usdc',
    },
  ]);

  const [activeQuote, setActiveQuote] = useState<any | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<AuditReceiptData | null>(null);

  useEffect(() => {
    fetch('/api/tokens')
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations && data.destinations.length > 0) {
          setDestinations(data.destinations);
        }
      })
      .catch((err) => console.warn('Using local token list fallback:', err.message));

    if (typeof window !== 'undefined' && window.location.search.includes('demo_deposit=1')) {
      setActiveQuote({
        swapId: 'swap_phase2_demo_7f9c21',
        originAmountZec: '2.5',
        estimatedOutput: '3550.00',
        destinationChain: 'arb',
        destinationToken: 'USDC',
        recipientAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        depositUnifiedAddress: 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6',
        zip321Uri: 'zcash:u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6?amount=2.5&memo=ejE...',
        status: 'MEMO_DETECTED',
      });
    }
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
    <WalletProvider>
      <EmbeddedWalletProvider>
        <div className="min-h-screen relative font-geist bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 transition-colors">
          <WalletDashboard
            network={network}
            destinations={destinations}
            onQuoteGenerated={(quote) => setActiveQuote(quote)}
            onBackToLanding={() => router.push('/')}
            onSelectReceipt={(receipt) => setActiveReceipt(receipt)}
          />

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
        </div>
      </EmbeddedWalletProvider>
    </WalletProvider>
  );
}
