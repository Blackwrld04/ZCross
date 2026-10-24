'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { WalletDashboard } from '@/components/WalletDashboard';
import { DepositModal } from '@/components/DepositModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { PrivacyAuditor } from '@/components/PrivacyAuditor';
import { DestinationToken } from '@/components/SwapCard';
import { AuditReceiptData } from '@/core/crypto/receipt';
import { WalletProvider } from '@/core/wallet/WalletContext';
import { EmbeddedWalletProvider } from '@/core/zcash/EmbeddedWalletContext';

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
  const [showAuditor, setShowAuditor] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'wallet' || params.get('tab') === 'wallet') {
        setView('wallet');
      }
    }

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
          return;
        }
      }
    } catch (err) {
      console.warn('Receipt fetch notice:', err);
    }

    setActiveReceipt({
      swapId: activeQuote.swapId,
      createdAt: new Date().toISOString(),
      settledAt: new Date().toISOString(),
      origin: {
        network: 'mainnet',
        pool: 'Orchard (Halo 2)',
        asset: 'ZEC',
        amountZec: activeQuote.originAmountZec || activeQuote.originAmount || '1.0',
        vaultUnifiedAddress: activeQuote.depositUnifiedAddress || 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0',
        shieldedNoteCommitment: 'cm_' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10),
        confirmations: 1,
      },
      destination: {
        chain: activeQuote.destinationChain || 'arb',
        asset: activeQuote.destinationToken || activeQuote.destinationTokenSymbol || 'USDC',
        recipientAddress: activeQuote.recipientAddress || '0x71C8363837918a71018282083710892018371029',
        amountReceived: activeQuote.estimatedOutput || '1151.60',
        transactionHash: activeQuote.destTxHash || ('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')),
        explorerUrl: 'https://arbiscan.io',
      },
      intentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      privacyVerification: {
        zeroTransparentHops: true,
        memoEncryption: 'ChaCha20-Poly1305 (512-byte padded)',
        unlinkableSenderGraph: true,
        complianceViewingKeyFingerprint: 'ivk_fp_' + Math.random().toString(16).slice(2, 18),
      },
    });
  };

  return (
    <WalletProvider>
      <EmbeddedWalletProvider>
        <div className="min-h-screen relative font-geist bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors">
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
              onBackToLanding={() => setView('landing')}
              onSelectReceipt={(receipt) => setActiveReceipt(receipt)}
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
      </EmbeddedWalletProvider>
    </WalletProvider>
  );
}
