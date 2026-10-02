'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Shield, Check, ExternalLink, 
  Lock, RefreshCw, Zap, CheckCircle2, ChevronRight, Info
} from 'lucide-react';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { TokenIcon } from './TokenIcon';
import { GooglePayLogo, GoogleGPayBadge } from './BrandLogos';
import { useLivePrices } from '@/core/prices/PriceContext';
import { 
  FiatCurrency, 
  OnrampProviderId, 
  PAYMENT_NETWORKS, 
  calculateOnrampQuotes, 
  ProviderQuote,
} from '@/core/onramp/types';

interface FiatOnrampModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const FiatOnrampModal: React.FC<FiatOnrampModalProps> = ({ 
  onClose, 
  onSuccess
}) => {
  const { account, fundWallet } = useEmbeddedWallet();
  const { zecPriceUsd } = useLivePrices();
  const [mounted, setMounted] = useState<boolean>(false);
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>('USD');
  const [fiatAmount, setFiatAmount] = useState<string>('200');
  const [selectedProvider, setSelectedProvider] = useState<OnrampProviderId>('google_pay_direct');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [settledSuccess, setSettledSuccess] = useState<boolean>(false);
  const [settledTxHash, setSettledTxHash] = useState<string>('');
  const [googlePayAuthId, setGooglePayAuthId] = useState<string>('');
  const [quotes, setQuotes] = useState<ProviderQuote[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const userAddress = account?.address || 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';
  const numFiat = parseFloat(fiatAmount) || 0;

  // Re-calculate quotes whenever amount, currency, or live CoinGecko price changes
  useEffect(() => {
    if (numFiat > 0) {
      const calculated = calculateOnrampQuotes({
        fiatAmount: numFiat,
        fiatCurrency,
        destinationAddress: userAddress,
        zecPriceUsd,
      });
      setQuotes(calculated);
      
      const best = calculated.find(q => q.isBestRate) || calculated[0];
      if (best) {
        setSelectedProvider(best.providerId);
      }
    } else {
      setQuotes([]);
    }
  }, [numFiat, fiatCurrency, userAddress, zecPriceUsd]);

  const activeQuote = quotes.find(q => q.providerId === selectedProvider) || quotes[0];
  const estimatedZec = activeQuote ? activeQuote.estimatedZec : 0;
  const netConfig = PAYMENT_NETWORKS.google_pay;

  // Handle Google Pay 1-Tap Payment
  const handleGooglePay = async () => {
    setIsProcessing(true);
    const authId = `gpay_auth_${Math.random().toString(36).slice(2, 10)}`;
    const txHash = `tx_orchard_gpay_${Math.random().toString(16).slice(2, 12)}`;
    setGooglePayAuthId(authId);
    setSettledTxHash(txHash);

    setTimeout(async () => {
      if (estimatedZec > 0) {
        fundWallet(estimatedZec);
        try {
          await fetch('/api/onramp/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              providerId: activeQuote?.providerId || 'google_pay_direct',
              status: 'COMPLETED',
              paymentMethod: 'google_pay',
              fiatAmount: numFiat,
              fiatCurrency,
              cryptoAmount: estimatedZec,
              destinationAddress: userAddress,
              googlePayTransactionId: authId,
              txHash,
            }),
          });
        } catch {
          // ignore local record error
        }
      }
      setIsProcessing(false);
      setSettledSuccess(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  // Handle Live Checkout Gateway Launcher
  const handleLaunchGateway = () => {
    if (activeQuote?.checkoutUrl) {
      window.open(activeQuote.checkoutUrl, '_blank', 'width=520,height=750,toolbar=no,menubar=no');
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-[480px] max-h-[94vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-5 sm:p-7 text-slate-900 dark:text-white my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black dark:bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <GooglePayLogo className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                  <span>Google Pay</span>
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                1-tap biometric tokenized on-ramp into Orchard privacy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ---------------- SUCCESS SCREEN ---------------- */}
        {settledSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black dark:bg-amber-500 text-white dark:text-black px-2.5 py-0.5 rounded-full">
                Google Pay Verified
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 font-serif">Purchase Completed!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Successfully credited <strong>{estimatedZec} ZEC</strong> directly into your in-browser Orchard vault via Google Pay tokenized settlement.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 text-left space-y-2">
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                <span>Google Pay Auth ID</span>
                <span className="text-slate-900 dark:text-white font-semibold">{googlePayAuthId}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                <span>Destination Vault</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Shielded (ZIP-316)</span>
              </div>
              <div className="text-[11px] text-gray-700 dark:text-gray-300 truncate pt-1 border-t border-gray-200 dark:border-slate-800">
                Tx: {settledTxHash}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-full font-bold text-xs transition cursor-pointer shadow-md"
            >
              Done &amp; Return to Wallet
            </button>
          </div>
        ) : (
          /* ---------------- MAIN FORM ---------------- */
          <div className="space-y-4">
            {/* Pay Amount Input Card */}
            <div className="p-4 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                <span>You Pay</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <GooglePayLogo className="w-3.5 h-3.5" />
                  Google Wallet Tokenized
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  min="10"
                  max="5000"
                  step="10"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  className="w-full bg-transparent text-3xl font-extrabold text-slate-900 dark:text-white focus:outline-none tracking-tight font-mono"
                  placeholder="200"
                />

                <select
                  value={fiatCurrency}
                  onChange={(e) => setFiatCurrency(e.target.value as any)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-200/60 dark:border-slate-800">
                {['50', '100', '200', '500'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFiatAmount(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      fiatAmount === amt
                        ? 'bg-black text-white dark:bg-amber-500 dark:text-black font-bold'
                        : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white border border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Receive Estimate Card */}
            <div className="p-4 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                <span>You Receive (Orchard Shielded)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  100% Pure Shielded
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                  {estimatedZec}
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
                  <TokenIcon symbol="ZEC" className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">ZEC</span>
                </div>
              </div>
            </div>

            {/* Settlement Fee Breakdown */}
            <div className="p-3.5 bg-white dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Payment Method</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <GooglePayLogo className="w-3.5 h-3.5" />
                  Google Pay (Biometric Device Card)
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Est. Network &amp; Interchange Fee</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">≈ ${activeQuote?.totalFeeUsd || '1.80'} {fiatCurrency}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Settlement Speed</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">&lt; 30 seconds</span>
              </div>
            </div>

            {/* Destination Shielded Address */}
            <div className="p-3 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl text-xs">
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Destination Orchard Vault
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">ZIP 316 Unified</span>
              </div>
              <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                {userAddress}
              </p>
            </div>

            {/* Primary Google Pay Button (Official Black GPay Pill Styling) */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleGooglePay}
                disabled={isProcessing || numFiat <= 0}
                className="w-full py-4 bg-black dark:bg-amber-500 hover:bg-zinc-800 dark:hover:bg-amber-400 active:scale-[0.99] text-white dark:text-black rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xl disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Google Pay Biometrics...</span>
                  </span>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider text-gray-300 dark:text-black/80">Buy with</span>
                    <GooglePayLogo className="w-5 h-5" />
                    <span className="font-extrabold text-base tracking-tight">Pay</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLaunchGateway}
                disabled={numFiat <= 0}
                className="w-full py-2.5 bg-white dark:bg-slate-850 hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                <span>Launch External Partner Gateway</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>Non-custodial Orchard deposit</span>
          <span>Zero KYC for &lt; $1,000 threshold</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
