'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowDownUp, CheckCircle2, AlertTriangle, 
  ChevronDown, Settings2, Zap, Shield, ShieldCheck, Sparkles,
  Clock, Info, ChevronUp, Lock, BookOpen, Globe, BarChart3
} from 'lucide-react';
import { validateZcashAddress } from '@/core/crypto/zip316';
import { useWallet } from '@/core/wallet/WalletContext';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { TokenIcon } from './TokenIcon';
import { WalletButton } from './WalletButton';
import { AddressBookModal } from './AddressBookModal';
import { resolveWeb3Domain } from '@/core/wallet/address-book';
import { MarketPriceChart } from './MarketPriceChart';
import { useLivePrices } from '@/core/prices/PriceContext';

export interface DestinationToken {
  chain: string;
  chainName: string;
  symbol: string;
  assetId: string;
  decimals: number;
  icon?: string;
}

interface SwapCardProps {
  network: 'mainnet' | 'testnet';
  destinations: DestinationToken[];
  onQuoteGenerated: (quoteData: any) => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  network,
  destinations,
  onQuoteGenerated,
}) => {
  // Direction: 'outbound' = Shielded ZEC -> External Chain; 'inbound' = External Chain -> Shielded ZEC Orchard
  const [direction, setDirection] = useState<'outbound' | 'inbound'>('outbound');
  const [originAmount, setOriginAmount] = useState<string>('1.0');
  const [selectedDest, setSelectedDest] = useState<DestinationToken>(
    destinations[0] || {
      chain: 'arb',
      chainName: 'Arbitrum One',
      symbol: 'USDC',
      assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
      decimals: 6,
    }
  );
  const { getActiveAddressForChain } = useWallet();
  const { account, balanceZec, fundWallet, execute1ClickSwapPayment } = useEmbeddedWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [refundAddress, setRefundAddress] = useState<string>('');
  const [showRefundInput, setShowRefundInput] = useState<boolean>(false);
  const [showTokenSelector, setShowTokenSelector] = useState<boolean>(false);
  const [showFeeInspector, setShowFeeInspector] = useState<boolean>(true);
  const [showAddressBook, setShowAddressBook] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [slippageBps, setSlippageBps] = useState<number>(100); // 1.0%
  const [loading, setLoading] = useState<boolean>(false);
  const [oneClickExecuting, setOneClickExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced Privacy & Anti-Timing Chaff State
  const [chaffEnabled, setChaffEnabled] = useState<boolean>(true);
  const [jitterDelaySeconds, setJitterDelaySeconds] = useState<number>(45);
  const [showPrivacySettings, setShowPrivacySettings] = useState<boolean>(false);
  
  // Dynamic Live Rates from CoinGecko Provider
  const { zecPriceUsd, solPriceUsd, btcPriceUsd, ethPriceUsd } = useLivePrices();

  // Real-time Web3 domain resolution (.eth, .sol, .zec)
  const resolvedDomain = resolveWeb3Domain(recipient);
  const effectiveRecipient = resolvedDomain ? resolvedDomain.resolvedAddress : recipient.trim();

  // Sync recipient with active wallet when destination chain or direction changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setShowChart(true);
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('dir') === 'inbound') {
        setDirection('inbound');
        setOriginAmount(zecPriceUsd > 0 ? zecPriceUsd.toFixed(1) : '1378.5');
      }
      if (params.get('recipient')) {
        setRecipient(params.get('recipient')!);
      }
      if (params.get('address_book') === '1') {
        setShowAddressBook(true);
      }
    }
  }, []);

  useEffect(() => {
    if (direction === 'outbound') {
      const active = getActiveAddressForChain(selectedDest.chain);
      if (active) {
        setRecipient(active);
      } else {
        if (selectedDest.chain === 'sol' && recipient.startsWith('0x')) {
          setRecipient('');
        } else if (['arb', 'eth', 'base'].includes(selectedDest.chain) && recipient.length > 0 && !recipient.startsWith('0x') && !recipient.includes('.')) {
          setRecipient('');
        }
      }
    } else {
      // Inbound direction: default to in-browser Orchard Unified Address
      if (account?.address && (!recipient || recipient.startsWith('0x') || recipient.length < 50)) {
        setRecipient(account.address);
      }
    }
  }, [direction, selectedDest.chain, getActiveAddressForChain, account?.address]);

  const originAmountNum = parseFloat(originAmount) || 0;

  let calculatedOutput = '0.00';
  let unitRate = `${zecPriceUsd.toFixed(2)} USDC`;
  let estimatedUsd = 0;

  if (direction === 'outbound') {
    estimatedUsd = originAmountNum * zecPriceUsd;
    if (selectedDest.symbol === 'USDC') {
      calculatedOutput = (originAmountNum * zecPriceUsd).toFixed(2);
      unitRate = `${zecPriceUsd.toFixed(2)} USDC`;
    } else if (selectedDest.symbol === 'SOL') {
      calculatedOutput = (estimatedUsd / solPriceUsd).toFixed(4);
      unitRate = (zecPriceUsd / solPriceUsd).toFixed(3) + ' SOL';
    } else if (selectedDest.symbol === 'BTC') {
      calculatedOutput = (estimatedUsd / btcPriceUsd).toFixed(6);
      unitRate = (zecPriceUsd / btcPriceUsd).toFixed(6) + ' BTC';
    } else if (selectedDest.symbol === 'ETH') {
      calculatedOutput = (estimatedUsd / ethPriceUsd).toFixed(4);
      unitRate = (zecPriceUsd / ethPriceUsd).toFixed(4) + ' ETH';
    }
  } else {
    // Inbound: User pays External token, receives Shielded ZEC
    if (selectedDest.symbol === 'USDC') {
      estimatedUsd = originAmountNum;
      calculatedOutput = (originAmountNum / zecPriceUsd).toFixed(4);
      unitRate = `${(1 / zecPriceUsd).toFixed(6)} ZEC per USDC`;
    } else if (selectedDest.symbol === 'SOL') {
      estimatedUsd = originAmountNum * solPriceUsd;
      calculatedOutput = (estimatedUsd / zecPriceUsd).toFixed(4);
      unitRate = (solPriceUsd / zecPriceUsd).toFixed(4) + ' ZEC per SOL';
    } else if (selectedDest.symbol === 'BTC') {
      estimatedUsd = originAmountNum * btcPriceUsd;
      calculatedOutput = (estimatedUsd / zecPriceUsd).toFixed(4);
      unitRate = (btcPriceUsd / zecPriceUsd).toFixed(3) + ' ZEC per BTC';
    } else if (selectedDest.symbol === 'ETH') {
      estimatedUsd = originAmountNum * ethPriceUsd;
      calculatedOutput = (estimatedUsd / zecPriceUsd).toFixed(4);
      unitRate = (ethPriceUsd / zecPriceUsd).toFixed(4) + ' ZEC per ETH';
    }
  }

  const outputDecimals = direction === 'inbound' 
    ? 4 
    : selectedDest.symbol === 'BTC' ? 6 : selectedDest.symbol === 'SOL' ? 4 : 2;

  const minOutput = (parseFloat(calculatedOutput) * (1 - slippageBps / 10000)).toFixed(outputDecimals);

  // Toggle Direction handler
  const toggleDirection = () => {
    setError(null);
    if (direction === 'outbound') {
      setDirection('inbound');
      if (selectedDest.symbol === 'USDC') setOriginAmount(zecPriceUsd.toFixed(1));
      else if (selectedDest.symbol === 'SOL') setOriginAmount('10.0');
      else if (selectedDest.symbol === 'BTC') setOriginAmount('0.05');
      if (account?.address) {
        setRecipient(account.address);
      } else {
        setRecipient('');
      }
    } else {
      setDirection('outbound');
      setOriginAmount('1.0');
      const active = getActiveAddressForChain(selectedDest.chain);
      setRecipient(active || '');
    }
  };

  // Address validation helper
  const isRecipientValid = () => {
    if (!effectiveRecipient) return false;
    const clean = effectiveRecipient;

    if (direction === 'inbound') {
      // Inbound recipient must be a valid Zcash Orchard Shielded Unified Address (u1...)
      const check = validateZcashAddress(clean, network);
      return check.isValid && check.isShielded;
    }

    if (selectedDest.chain === 'arb' || selectedDest.chain === 'eth' || selectedDest.chain === 'base') {
      return /^0x[a-fA-F0-9]{40}$/.test(clean);
    }
    if (selectedDest.chain === 'sol') {
      return clean.length >= 32 && clean.length <= 44;
    }
    if (selectedDest.chain === 'btc') {
      return clean.length >= 26 && clean.length <= 62;
    }
    return clean.length >= 26;
  };

  const getRecipientPlaceholder = () => {
    if (direction === 'inbound') {
      return 'Paste u1... Shielded Address or satoshi.zec';
    }
    if (selectedDest.chain === 'arb' || selectedDest.chain === 'eth' || selectedDest.chain === 'base') {
      return 'vitalik.eth or 0x... EVM address';
    }
    if (selectedDest.chain === 'sol') {
      return 'toly.sol or base58 Solana address...';
    }
    if (selectedDest.chain === 'btc') {
      return 'Paste Bitcoin native address (bc1... or 1...)';
    }
    return 'Enter destination address or Web3 domain...';
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (originAmountNum <= 0) {
      setError(`Please specify a ${direction === 'outbound' ? 'ZEC' : selectedDest.symbol} amount greater than 0.`);
      return;
    }

    if (!isRecipientValid()) {
      setError(
        direction === 'inbound'
          ? 'Please provide a valid Shielded Orchard Unified Address (u1...). Transparent addresses are rejected.'
          : `Please provide a valid ${selectedDest.chainName} recipient address.`
      );
      return;
    }

    if (refundAddress) {
      const refundCheck = validateZcashAddress(refundAddress, network);
      if (!refundCheck.isValid || !refundCheck.isShielded) {
        setError(refundCheck.error || 'Refund address must be a shielded Unified Address (u1...)');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originAmountZec: direction === 'outbound' ? originAmount : calculatedOutput,
          destinationChain: selectedDest.chain,
          destinationAsset: selectedDest.assetId,
          destinationTokenSymbol: selectedDest.symbol,
          recipientAddress: ['sol', 'btc'].includes(selectedDest.chain) ? effectiveRecipient : effectiveRecipient.toLowerCase(),
          refundShieldedAddress: refundAddress ? refundAddress.trim() : undefined,
          slippageBps,
          network,
          chaffEnabled,
          jitterDelaySeconds: chaffEnabled ? jitterDelaySeconds : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate cross-chain intent');
      }

      onQuoteGenerated(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with quote engine');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute1ClickSwap = async () => {
    setError(null);

    if (originAmountNum <= 0) {
      setError(`Please specify a ${direction === 'outbound' ? 'ZEC' : selectedDest.symbol} amount greater than 0.`);
      return;
    }

    if (!isRecipientValid()) {
      setError(
        direction === 'inbound'
          ? 'Please provide a valid Shielded Orchard Unified Address (u1...). Transparent addresses are rejected.'
          : `Please provide a valid ${selectedDest.chainName} recipient address.`
      );
      return;
    }

    if (direction === 'outbound' && balanceZec < originAmountNum + 0.0001) {
      setError(
        `Insufficient shielded ZEC balance (${balanceZec.toFixed(4)} ZEC available). Click [+Faucet] above to top up or lower the amount.`
      );
      return;
    }

    setOneClickExecuting(true);

    try {
      const quoteRes = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originAmountZec: direction === 'outbound' ? originAmount : calculatedOutput,
          destinationChain: selectedDest.chain,
          destinationAsset: selectedDest.assetId,
          destinationTokenSymbol: selectedDest.symbol,
          recipientAddress: ['sol', 'btc'].includes(selectedDest.chain) ? effectiveRecipient : effectiveRecipient.toLowerCase(),
          refundShieldedAddress: refundAddress ? refundAddress.trim() : (account?.address || undefined),
          slippageBps,
          network,
          chaffEnabled,
          jitterDelaySeconds: chaffEnabled ? jitterDelaySeconds : 0,
        }),
      });

      const quoteData = await quoteRes.json();
      if (!quoteRes.ok) {
        throw new Error(quoteData.error || 'Failed to generate cross-chain intent');
      }

      if (direction === 'outbound') {
        // Outbound: Sign and broadcast 1-Click Shielded Note Payment using client-side Orchard engine
        const paymentResult = await execute1ClickSwapPayment({
          originAmountZec: originAmountNum,
          destinationChain: selectedDest.chain,
          destinationAsset: selectedDest.assetId,
          destinationTokenSymbol: selectedDest.symbol,
          recipientAddress: ['sol', 'btc'].includes(selectedDest.chain) ? effectiveRecipient : effectiveRecipient.toLowerCase(),
          refundShieldedAddress: refundAddress ? refundAddress.trim() : (account?.address || undefined),
          depositAddress: quoteData.depositUnifiedAddress,
          swapId: quoteData.swapId,
        });

        await fetch('/api/swap/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            swapId: quoteData.swapId, 
            action: 'full_flow',
            zcashTxHash: paymentResult.txid,
          }),
        });
      } else {
        // Inbound: Cross-chain deposit into Shielded Zcash Orchard
        await fetch('/api/swap/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            swapId: quoteData.swapId, 
            action: 'full_flow',
            zcashTxHash: `inbound_${selectedDest.chain}_tx_${Date.now().toString(16)}`,
          }),
        });

        // If the recipient was the user's in-browser Orchard vault, credit the balance
        const targetClean = effectiveRecipient;
        const myUa = (account?.address || '').trim();
        if (myUa && targetClean.startsWith(myUa.slice(0, 20))) {
          fundWallet(parseFloat(calculatedOutput));
        }
      }

      quoteData.status = 'SETTLED';
      onQuoteGenerated(quoteData);
    } catch (err: any) {
      console.error('1-Click Swap error:', err);
      setError(err.message || 'Execution error during 1-click swap payment.');
    } finally {
      setOneClickExecuting(false);
    }
  };

  return (
    <div className={`w-full mx-auto transition-all duration-300 ${showChart ? 'max-w-7xl' : 'max-w-xl'}`}>
      <div className={`grid grid-cols-1 ${showChart ? 'lg:grid-cols-12 gap-8 items-start' : 'gap-0'}`}>
        {/* Left / Pro-Trader Chart Section */}
        {showChart && (
          <div className="lg:col-span-7 space-y-4">
            <MarketPriceChart
              selectedDest={selectedDest}
              direction={direction}
              isCompact={!showChart}
              onToggleCompact={() => setShowChart(false)}
            />
          </div>
        )}

        {/* Right / Swap Form Section */}
        <div className={`${showChart ? 'lg:col-span-5' : 'w-full'}`}>
          <div className="bg-white dark:bg-slate-900/95 border border-gray-200/90 dark:border-slate-800 rounded-2xl sm:rounded-[28px] shadow-xl dark:shadow-2xl dark:shadow-black/50 p-3.5 sm:p-6 md:p-8 text-slate-900 dark:text-white transition-colors duration-200">
            {/* Header with Live Corridor Beacon, Chart Toggle & Slippage */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                    {direction === 'outbound' ? 'Shielded Swap' : 'Cross-Chain Shield'}
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {direction === 'outbound'
                    ? 'Atomic cross-chain settlement from Zcash Orchard'
                    : `Shield funds directly from ${selectedDest.chainName} into Orchard`}
                </p>
              </div>

              {/* Action Buttons: Chart Toggle & Slippage Presets */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setShowChart(!showChart)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border shadow-2xs ${
                    showChart
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700'
                  }`}
                  title={showChart ? 'Hide Price Chart' : 'Show Interactive Price Chart'}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{showChart ? 'Chart' : 'Chart'}</span>
                </button>

                {/* Slippage Presets */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 p-0.5 sm:p-1 rounded-full text-xs">
                  {[50, 100, 200].map((bps) => (
                    <button
                      key={bps}
                      type="button"
                      onClick={() => setSlippageBps(bps)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition cursor-pointer font-mono text-[10px] sm:text-[11px] ${
                        slippageBps === bps
                          ? 'bg-black dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                          : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {bps / 100}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleGenerateQuote} className="space-y-3.5">
              {/* TOP CARD: You Pay */}
              <div className="bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200/90 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-5 hover:border-gray-300 dark:hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2 gap-1 flex-wrap">
                  <span className="font-semibold text-gray-700 dark:text-slate-300">You Pay</span>
                  {direction === 'outbound' ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[11px] flex-wrap justify-end">
                      <span className="text-gray-500 dark:text-slate-400 hidden xs:inline">Shielded:</span>
                      <span className="font-bold text-slate-900 dark:text-amber-400">{balanceZec.toFixed(3)} ZEC</span>
                      <button
                        type="button"
                        onClick={() => setOriginAmount(balanceZec > 0.0001 ? (balanceZec - 0.0001).toFixed(4) : '0')}
                        className="px-1.5 sm:px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-black dark:text-white font-bold text-[10px] border border-gray-200 dark:border-slate-700 transition cursor-pointer"
                        title="Use maximum shielded balance"
                      >
                        MAX
                      </button>
                      {balanceZec < 0.5 && (
                        <button
                          type="button"
                          onClick={() => fundWallet(2.5)}
                          className="px-1.5 sm:px-2 py-0.5 rounded bg-black dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-black font-bold text-[10px] transition cursor-pointer"
                          title="Quick Faucet +2.5 ZEC"
                        >
                          +Faucet
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 dark:text-slate-300">
                      <span>Source: {selectedDest.chainName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <input
                    type="number"
                    step="any"
                    min="0.000001"
                    value={originAmount}
                    onChange={(e) => setOriginAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white placeholder-gray-300 dark:placeholder-slate-600 focus:outline-none tracking-tight min-w-0"
                    required
                  />

                  {direction === 'outbound' ? (
                    <div className="flex items-center gap-2 sm:gap-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center border border-gray-200 dark:border-slate-600">
                        <TokenIcon symbol="ZEC" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none">ZEC</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-medium">Shielded</div>
                      </div>
                    </div>
                  ) : (
                    /* Inbound: Token Selector on Pay Card */
                    <button
                      type="button"
                      onClick={() => setShowTokenSelector(!showTokenSelector)}
                      className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs shrink-0 transition cursor-pointer"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center border border-gray-200 dark:border-slate-600">
                        <TokenIcon symbol={selectedDest.symbol} chain={selectedDest.chain} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none flex items-center gap-1">
                          {selectedDest.symbol}
                          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-slate-400" />
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-medium">{selectedDest.chainName}</div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="flex flex-col xs:flex-row xs:items-center justify-between mt-2.5 pt-2.5 border-t border-gray-200/60 dark:border-slate-800/80 text-xs gap-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium text-[11px] sm:text-xs">
                    ≈ ${estimatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>

                  {/* Quick Amount Presets */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    {(direction === 'outbound' 
                      ? ['0.5', '1.0', '2.5', '5.0']
                      : selectedDest.symbol === 'USDC' 
                        ? ['100', '500', Math.round(zecPriceUsd).toString(), '2500']
                        : selectedDest.symbol === 'SOL'
                          ? ['1.0', '5.0', '10.0', '25.0']
                          : ['0.01', '0.05', '0.1', '0.25']
                    ).map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setOriginAmount(amt)}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-medium text-[11px] sm:text-xs transition cursor-pointer ${
                          originAmount === amt
                            ? 'bg-black dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTIVE SWAP DIRECTION FLIP BUTTON (⇄) */}
              <div className="relative flex justify-center -my-2 z-10">
                <button
                  type="button"
                  onClick={toggleDirection}
                  className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-amber-400 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer group"
                  title={`Switch direction: ${direction === 'outbound' ? 'Shielded ZEC → Cross-Chain' : 'Cross-Chain → Shielded ZEC'}`}
                >
                  <ArrowDownUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${direction === 'inbound' ? 'rotate-180 text-amber-500' : 'group-hover:rotate-180'}`} />
                </button>
              </div>

              {/* BOTTOM CARD: You Receive */}
              <div className="bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200/90 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-5 hover:border-gray-300 dark:hover:border-slate-700 transition relative">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-gray-700 dark:text-slate-300">You Receive</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {direction === 'outbound' ? 'Destination' : 'Zcash Orchard'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="w-full text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight truncate min-w-0">
                    {calculatedOutput}
                  </div>

                  {direction === 'outbound' ? (
                    /* Outbound: Token Selector on Receive Card */
                    <button
                      type="button"
                      onClick={() => setShowTokenSelector(!showTokenSelector)}
                      className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs shrink-0 transition cursor-pointer"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center border border-gray-200 dark:border-slate-600">
                        <TokenIcon symbol={selectedDest.symbol} chain={selectedDest.chain} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none flex items-center gap-1">
                          {selectedDest.symbol}
                          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 dark:text-slate-400" />
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-medium">{selectedDest.chainName}</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs shrink-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center border border-amber-200 dark:border-amber-800/80">
                        <TokenIcon symbol="ZEC" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none">ZEC</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Shielded</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Selector Dropdown */}
                {showTokenSelector && (
                  <div className="absolute right-4 top-20 z-30 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 px-3 py-2 border-b border-gray-100 dark:border-slate-800 mb-1">
                      Select Settlement Asset
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {destinations.map((d) => (
                        <button
                          key={`${d.chain}-${d.symbol}`}
                          type="button"
                          onClick={() => {
                            setSelectedDest(d);
                            setShowTokenSelector(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                            selectedDest.chain === d.chain && selectedDest.symbol === d.symbol
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                              <TokenIcon symbol={d.symbol} chain={d.chain} className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold leading-none text-slate-900 dark:text-white">{d.symbol}</div>
                              <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{d.chainName}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono uppercase text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 border border-transparent dark:border-slate-700">
                            {d.chain}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rate Strip: Clean responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2.5 pt-2.5 border-t border-gray-200/60 dark:border-slate-800/80 text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 gap-1 sm:gap-2">
                  <span className="truncate">
                    Rate: <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{direction === 'outbound' ? `1 ZEC ≈ ${unitRate}` : unitRate}</span>
                  </span>
                  <span className="truncate">
                    Min. Received: <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{minOutput} {direction === 'outbound' ? selectedDest.symbol : 'ZEC'}</span>
                  </span>
                </div>
              </div>

              {/* DESTINATION RECIPIENT ADDRESS */}
              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {direction === 'outbound' ? (
                      <>Destination Recipient Address ({selectedDest.chainName})</>
                    ) : (
                      <>Destination Shielded Unified Address (ZIP 316)</>
                    )}
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
                    {isRecipientValid() && (
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs mr-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Valid
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAddressBook(true)}
                      className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border border-gray-200 dark:border-slate-700 shadow-2xs"
                      title="Open Address Book"
                    >
                      <BookOpen className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                      <span>Contacts</span>
                    </button>
                    {direction === 'outbound' ? (
                      <WalletButton
                        chain={selectedDest.chain}
                        onAddressSelected={(addr) => setRecipient(addr)}
                      />
                    ) : (
                      account?.address && (
                        <button
                          type="button"
                          onClick={() => setRecipient(account.address)}
                          className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Use In-App Vault</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={getRecipientPlaceholder()}
                  className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gray-50/80 dark:bg-slate-950/70 border text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition ${
                    isRecipientValid()
                      ? 'border-emerald-500/50 dark:border-emerald-500/60 focus:border-emerald-600'
                      : 'border-gray-200 dark:border-slate-800 focus:border-gray-400 dark:focus:border-slate-600'
                  }`}
                  required
                />

                {/* Web3 Domain Live Resolution Feedback */}
                {resolvedDomain && (
                  <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-mono animate-in fade-in">
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="font-bold">{resolvedDomain.source} ({resolvedDomain.domain}):</span>
                      <span className="truncate">{resolvedDomain.resolvedAddress}</span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* TRANSPARENT ROUTE & FEE INSPECTOR */}
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 overflow-hidden text-xs transition">
                <button
                  type="button"
                  onClick={() => setShowFeeInspector(!showFeeInspector)}
                  className="w-full px-3.5 sm:px-4 py-2.5 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span>Route &amp; Settlement Guarantees</span>
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Est. &lt; 42s
                    </span>
                    {showFeeInspector ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />}
                  </div>
                </button>

                {showFeeInspector && (
                  <div className="px-3.5 sm:px-4 pb-3 pt-1 border-t border-gray-200/60 dark:border-slate-800 space-y-1.5 text-gray-600 dark:text-slate-400">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[11px] gap-0.5 sm:gap-2">
                      <span className="text-gray-500 dark:text-slate-400">Fulfillment Route:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold sm:text-right">
                        {direction === 'outbound' 
                          ? `Zcash Orchard → NEAR Intents → ${selectedDest.chainName}` 
                          : `${selectedDest.chainName} → NEAR Intents → Zcash Orchard`}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[11px] gap-0.5 sm:gap-2">
                      <span className="text-gray-500 dark:text-slate-400">Solver Atomic Execution Fee:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-200 sm:text-right">0.15% (Included in rate)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[11px] gap-0.5 sm:gap-2">
                      <span className="text-gray-500 dark:text-slate-400">Network Gas / Mining Fee:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-200 sm:text-right">0.0001 ZEC ($0.14)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[11px] gap-0.5 sm:gap-2">
                      <span className="text-gray-500 dark:text-slate-400">Protocol Fee:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold sm:text-right">0.00% (Zero Protocol Fee)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[11px] pt-1 border-t border-gray-200/40 dark:border-slate-800 gap-0.5 sm:gap-2">
                      <span className="flex items-center gap-1 text-slate-900 dark:text-slate-200 font-semibold">
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Privacy Guarantee:</span>
                      </span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold sm:text-right">512B Uniform Padded Memo (Zero-Leak)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* FALLBACK REFUND UA */}
              <div className="pt-1 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRefundInput(!showRefundInput)}
                    className="text-[11px] text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition py-1 cursor-pointer"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>{showRefundInput ? 'Hide Refund' : 'Fallback Refund UA'}</span>
                  </button>
                </div>

                {showRefundInput && (
                  <div className="mt-2 space-y-1">
                    <input
                      type="text"
                      value={refundAddress}
                      onChange={(e) => setRefundAddress(e.target.value)}
                      placeholder="u1... (Shielded Unified Address for fallback return)"
                      className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-gray-50/80 dark:bg-slate-950/70 border border-gray-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-black dark:focus:border-amber-400 focus:bg-white dark:focus:bg-slate-900"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Must be a shielded Unified Address (u1...). Transparent addresses are strictly rejected.
                    </p>
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300 font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action CTA Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExecute1ClickSwap}
                  disabled={loading || oneClickExecuting}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-full bg-black dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 dark:shadow-amber-500/20 hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {oneClickExecuting ? (
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>
                        {direction === 'outbound'
                          ? 'Signing & Settling In-Browser Shielded Note...'
                          : 'Executing Atomic Cross-Chain Shielding...'}
                      </span>
                    </span>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 fill-white dark:fill-black text-white dark:text-black shrink-0" />
                      <span className="tracking-wide">
                        {direction === 'outbound'
                          ? 'INSTANT SHIELDED SWAP (1-CLICK IN-APP)'
                          : 'SHIELD INTO ZCASH ORCHARD (1-CLICK)'}
                      </span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading || oneClickExecuting}
                    className="text-xs text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white font-semibold transition cursor-pointer py-1 max-w-full px-2 truncate sm:whitespace-normal"
                  >
                    {direction === 'outbound'
                      ? 'or pay with external phone app (Zashi / YWallet QR scan) →'
                      : 'or view inbound ZIP 321 payment request details →'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Address Book Modal */}
      {showAddressBook && (
        <AddressBookModal
          chainFilter={direction === 'outbound' ? selectedDest.chain : 'zec'}
          onSelectAddress={(addr) => {
            setRecipient(addr);
          }}
          onClose={() => setShowAddressBook(false)}
        />
      )}
    </div>
  );
};
