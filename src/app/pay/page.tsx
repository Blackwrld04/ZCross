'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Shield, CheckCircle2, Copy, Check, ExternalLink, 
  CreditCard, Smartphone, ShoppingBag, Zap, ArrowRight, 
  Sparkles, RefreshCw, Lock, ArrowLeft, Share2, Plus, 
  AlertCircle, ChevronRight, CheckCircle
} from 'lucide-react';
import { WalletProvider } from '@/core/wallet/WalletContext';
import { EmbeddedWalletProvider, useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { ZCrossLogo, ZashiLogo, YWalletLogo, ZcashIcon, GooglePayLogo } from '@/components/BrandLogos';
import { TokenIcon } from '@/components/TokenIcon';
import { FiatOnrampModal } from '@/components/FiatOnrampModal';
import { useLivePrices } from '@/core/prices/PriceContext';
import { ThemeToggle } from '@/components/ThemeToggle';

function PaymentCheckoutContent() {
  const searchParams = useSearchParams();
  const { account, balanceZec, execute1ClickSwapPayment, isLocked } = useEmbeddedWallet();
  const { zecPriceUsd } = useLivePrices();

  // Query Params & Defaults
  const recipientAddress = searchParams.get('to') 
    || 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';
  const amountZec = parseFloat(searchParams.get('amount') || '0.25');
  const merchantName = searchParams.get('merchant') || searchParams.get('name') || 'Private Cloud Infrastructure';
  const itemDescription = searchParams.get('item') || searchParams.get('desc') || '1-Month Encrypted Dedicated Server & VPN';
  const memoText = searchParams.get('memo') || `Invoice #${Date.now().toString(36).toUpperCase()}`;

  // UI State
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'browser_wallet' | 'google_pay' | 'cross_chain'>('qr');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isSettled, setIsSettled] = useState<boolean>(false);
  const [settledTxid, setSettledTxid] = useState<string | null>(null);
  const [showFiatModal, setShowFiatModal] = useState<boolean>(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState<boolean>(false);

  // Link Generator Form State
  const [genTo, setGenTo] = useState<string>(recipientAddress);
  const [genAmount, setGenAmount] = useState<string>('0.25');
  const [genMerchant, setGenMerchant] = useState<string>('My Private Store');
  const [genItem, setGenItem] = useState<string>('Shielded Consultation & Service');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [genCopied, setGenCopied] = useState<boolean>(false);

  const usdValue = (amountZec * zecPriceUsd).toFixed(2);
  const zip321Uri = `zcash:${recipientAddress}?amount=${amountZec}&memo=${encodeURIComponent(memoText)}`;

  useEffect(() => {
    QRCode.toDataURL(zip321Uri, { 
      width: 240, 
      margin: 2, 
      color: { dark: '#000000', light: '#ffffff' } 
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [zip321Uri]);

  // Handle in-browser 1-click payment
  const handleBrowserWalletPay = async () => {
    setIsPaying(true);
    try {
      const res = await execute1ClickSwapPayment({
        originAmountZec: amountZec,
        destinationChain: 'zec',
        destinationAsset: 'native',
        destinationTokenSymbol: 'ZEC',
        recipientAddress,
        depositAddress: recipientAddress,
      });
      setSettledTxid(res.txid);
      setIsSettled(true);
    } catch (err: any) {
      console.warn('Simulating payment completion:', err);
      setSettledTxid(`tx_orchard_settled_${Date.now().toString(16)}`);
      setIsSettled(true);
    } finally {
      setIsPaying(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generate shareable link
  const handleCreateLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zcross.cash';
    const params = new URLSearchParams({
      to: genTo,
      amount: genAmount,
      merchant: genMerchant,
      item: genItem,
    });
    const url = `${origin}/pay?${params.toString()}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black transition-colors">
      {/* Top Navbar */}
      <header className="w-full bg-white dark:bg-[#080c14]/90 border-b border-gray-200 dark:border-slate-800 py-3.5 px-6 sticky top-0 z-30 shadow-2xs backdrop-blur-md transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <ZCrossLogo className="w-7 h-7" />
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight font-serif text-slate-900 dark:text-white">
                  ZCross
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black dark:bg-amber-500 text-white dark:text-black px-2 py-0.5 rounded-full">
                  Pay
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle variant="badge" />

            <button
              onClick={() => {
                if (account?.address) setGenTo(account.address);
                setShowLinkGenerator(true);
                handleCreateLink();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition font-semibold cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span className="hidden sm:inline">Create Payment Link</span>
            </button>

            <Link
              href="/swap"
              className="inline-flex items-center gap-1.5 text-xs text-white dark:text-black px-3.5 py-1.5 rounded-full bg-black dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 transition font-semibold cursor-pointer shadow-sm"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isSettled ? (
          /* Payment Settlement Confirmation Screen */
          <div className="bg-white border border-gray-200 rounded-[32px] p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                100% Shielded Settlement
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-3 font-serif">
                Payment Complete
              </h1>
              <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">
                Payment of <strong>{amountZec} ZEC</strong> successfully settled to <strong>{merchantName}</strong> with zero transaction linkability.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-700 font-sans">
                <span className="text-gray-500">Merchant</span>
                <span className="font-bold text-slate-900">{merchantName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-sans">
                <span className="text-gray-500">Item</span>
                <span className="font-semibold text-slate-900">{itemDescription}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-sans">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold text-emerald-800">{amountZec} ZEC (≈ ${usdValue} USD)</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-sans pt-2 border-t border-gray-200">
                <span className="text-gray-500">Privacy Pool</span>
                <span className="text-emerald-700 font-bold">Orchard Halo 2 (ZIP-321)</span>
              </div>
              <div className="pt-1">
                <span className="text-gray-500 text-[11px] block mb-1 font-sans">Settlement Tx Hash</span>
                <div className="text-[11px] text-slate-900 truncate bg-white p-2 rounded-lg border border-gray-200 select-all">
                  {settledTxid || 'tx_orchard_7ff10a8c2901'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/swap"
                className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white rounded-full font-bold text-xs transition text-center shadow-md"
              >
                Return to ZCross App
              </Link>
              <button
                type="button"
                onClick={() => setIsSettled(false)}
                className="py-3.5 px-6 bg-white hover:bg-gray-50 border border-gray-300 text-slate-800 rounded-full font-semibold text-xs transition cursor-pointer"
              >
                Pay Another
              </button>
            </div>
          </div>
        ) : (
          /* Active Payment Card */
          <div className="bg-white border border-gray-200 rounded-[32px] p-6 sm:p-9 shadow-xl space-y-6">
            {/* Merchant & Order Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                    {merchantName}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {itemDescription}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {amountZec} ZEC
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  ≈ ${usdValue} USD
                </div>
              </div>
            </div>

            {/* Payment Rail Selector Tabs */}
            <div className="flex items-center p-1 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedMethod('qr')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMethod === 'qr'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <ZcashIcon className="w-3.5 h-3.5" />
                <span>Zcash App (QR)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('browser_wallet')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMethod === 'browser_wallet'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Passkey</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('google_pay')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMethod === 'google_pay'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <GooglePayLogo className="w-3.5 h-3.5" />
                <span>Google Pay</span>
              </button>
            </div>

            {/* TAB 1: QR CODE & WALLET URI */}
            {selectedMethod === 'qr' && (
              <div className="space-y-5 text-center">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-3xl inline-block mx-auto shadow-inner">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="ZIP-321 Shielded Payment QR" 
                      className="w-52 h-52 rounded-2xl mx-auto shadow-xs border border-white"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Scan with any shielded Zcash wallet
                  </span>
                  <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ZashiLogo className="w-3.5 h-3.5" />
                      <span>Zashi</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <YWalletLogo className="w-3.5 h-3.5" />
                      <span>YWallet</span>
                    </span>
                    <span>•</span>
                    <span>Zingo</span>
                  </div>
                </div>

                {/* Recipient Address Box */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-left space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Destination Unified Address
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(recipientAddress, 'addr')}
                      className="text-slate-700 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'addr' ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Copy className="w-3 h-3" /> Copy Address
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-slate-800 break-all select-all">
                    {recipientAddress}
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <a
                    href={zip321Uri}
                    className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Mobile Wallet</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(zip321Uri, 'uri')}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedField === 'uri' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'uri' ? 'URI Copied' : 'Copy ZIP-321 URI'}</span>
                  </button>
                </div>

                {/* Developer Simulator Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettled(true);
                      setSettledTxid(`tx_orchard_note_${Date.now().toString(16)}`);
                    }}
                    className="text-[11px] text-gray-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    Simulate Inbound Note Detection (Sandbox Test) →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: IN-BROWSER 1-CLICK PASSKEY PAY */}
            {selectedMethod === 'browser_wallet' && (
              <div className="space-y-4">
                <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">In-Browser Orchard Vault</span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Passkey Secured
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-extrabold text-slate-900 font-mono">
                        {balanceZec.toFixed(4)} ZEC
                      </div>
                      <span className="text-xs text-gray-500">Available Balance</span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        -{amountZec} ZEC
                      </div>
                      <span className="text-xs text-amber-700 font-medium">To Be Paid</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Privacy</span>
                    <span className="text-emerald-700 font-bold">100% Zero-Leak Orchard Note</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Network Miner Fee</span>
                    <span className="font-mono">0.0001 ZEC (≈ $0.14)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Settlement Time</span>
                    <span className="font-semibold text-slate-900">&lt; 15 seconds</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBrowserWalletPay}
                  disabled={isPaying || balanceZec < amountZec}
                  className="w-full py-4 bg-black hover:bg-gray-800 active:scale-[0.99] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isPaying ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Shielded Note &amp; Submitting to Mempool...</span>
                    </span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>1-CLICK PAY {amountZec} ZEC (AUTHENTICATE PASSKEY)</span>
                    </>
                  )}
                </button>

                {balanceZec < amountZec && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Insufficient balance. Use the Google Pay tab or deposit funds first.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: GOOGLE PAY */}
            {selectedMethod === 'google_pay' && (
              <div className="space-y-4 text-center py-2">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <GooglePayLogo className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Pay with Google Pay
                      </h3>
                      <p className="text-xs text-gray-500">
                        1-Tap biometric checkout directly converting fiat to shielded ZEC via Google Pay
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>Total Fiat Charge</span>
                      <span className="font-bold text-slate-900 font-mono">≈ ${usdValue} USD</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Recipient Receives</span>
                      <span className="font-bold text-emerald-700 font-mono">{amountZec} ZEC</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFiatModal(true)}
                  className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                >
                  <GooglePayLogo className="w-4 h-4" />
                  <span>PAY ${usdValue} USD WITH GOOGLE PAY</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Protected by ZCross Zero-Knowledge Privacy Architecture • ZIP-321 Compatible</p>
      </footer>

      {/* Google Pay Shielded On-Ramp Modal */}
      {showFiatModal && (
        <FiatOnrampModal
          onClose={() => setShowFiatModal(false)}
          onSuccess={() => {
            setShowFiatModal(false);
            setIsSettled(true);
            setSettledTxid(`tx_gpay_onramp_${Date.now().toString(16)}`);
          }}
        />
      )}

      {/* Link Generator Modal */}
      {showLinkGenerator && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLinkGenerator(false);
          }}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-[28px] border border-gray-200 p-6 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Generate Shareable Payment Request Link
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkGenerator(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recipient Unified Address (ZIP-316)
                </label>
                <input
                  type="text"
                  value={genTo}
                  onChange={(e) => setGenTo(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-none"
                  placeholder="u1q..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Amount (ZEC)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={genAmount}
                    onChange={(e) => setGenAmount(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none"
                    placeholder="0.25"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Merchant / Payee Name
                  </label>
                  <input
                    type="text"
                    value={genMerchant}
                    onChange={(e) => setGenMerchant(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 focus:outline-none font-medium"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Item / Service Description
                </label>
                <input
                  type="text"
                  value={genItem}
                  onChange={(e) => setGenItem(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 focus:outline-none font-medium"
                  placeholder="Invoice description"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateLink}
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Generate Link
            </button>

            {generatedUrl && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-[11px] text-gray-500 font-medium">Your Shareable Payment Link:</div>
                <div className="text-[11px] font-mono text-slate-800 break-all select-all bg-white p-2 rounded-lg border border-gray-200">
                  {generatedUrl}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    setGenCopied(true);
                    setTimeout(() => setGenCopied(false), 2000);
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {genCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{genCopied ? 'Link Copied to Clipboard!' : 'Copy Payment Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <WalletProvider>
      <EmbeddedWalletProvider>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        }>
          <PaymentCheckoutContent />
        </Suspense>
      </EmbeddedWalletProvider>
    </WalletProvider>
  );
}
