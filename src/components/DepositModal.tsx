'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Copy, Check, ExternalLink, ShieldCheck, 
  Clock, Eye, EyeOff, Zap, CheckCircle2, Shield,
  Bell, Send, Sparkles, ShieldAlert
} from 'lucide-react';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { AlertService } from '@/core/notifications/alert-service';
import { ZashiLogo, YWalletLogo, ZodlLogo, ZcashIcon } from './BrandLogos';

interface DepositModalProps {
  quoteData: any;
  onClose: () => void;
  onViewReceipt: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  quoteData,
  onClose,
  onViewReceipt,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(quoteData.status || 'CREATED');
  const [showMemoInspector, setShowMemoInspector] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [destTxHash, setDestTxHash] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(899); // 14:59

  // Alerts & Notifications State
  const [browserNotifsEnabled, setBrowserNotifsEnabled] = useState<boolean>(false);
  const [telegramHandle, setTelegramHandle] = useState<string>('');
  const [telegramSaved, setTelegramSaved] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const notifiedRef = React.useRef<boolean>(false);

  const swapId = quoteData.swapId;

  // Rate guarantee countdown timer (15 min)
  useEffect(() => {
    if (status === 'SETTLED') return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

  // Generate QR Code on mount
  useEffect(() => {
    if (quoteData?.zip321Uri) {
      QRCode.toDataURL(quoteData.zip321Uri, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err));
    }
  }, [quoteData]);

  useEffect(() => {
    setBrowserNotifsEnabled(AlertService.isBrowserAlertEnabled());
    setTelegramHandle(AlertService.getTelegramRecipient());
  }, []);

  // Poll swap status every 2 seconds
  useEffect(() => {
    if (!swapId || status === 'SETTLED') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/swap/${swapId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.swap) {
            setStatus(data.swap.status);
            if (data.swap.dest_tx_hash) {
              setDestTxHash(data.swap.dest_tx_hash);
            }
            if (data.swap.status === 'SETTLED' && !notifiedRef.current) {
              notifiedRef.current = true;
              AlertService.notifySettlement({
                swapId,
                originAmountZec: quoteData.originAmountZec || quoteData.originAmount || '0',
                destAmountEst: quoteData.estimatedOutput || quoteData.destAmountEst || '0',
                destChain: quoteData.destinationChain || 'arb',
                destToken: quoteData.destinationToken || quoteData.destinationTokenSymbol || 'USDC',
                recipientAddress: quoteData.recipientAddress || '',
                destTxHash: data.swap.dest_tx_hash,
              });
            }
          }
        }
      } catch (err) {
        console.error('Status poll error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [swapId, status, quoteData]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulate = async (action: 'deposit' | 'settle' | 'full_flow') => {
    setSimulating(true);
    try {
      const res = await fetch('/api/swap/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swapId, action }),
      });
      const data = await res.json();
      if (data.swap) {
        setStatus(data.swap.status);
        if (data.swap.dest_tx_hash) {
          setDestTxHash(data.swap.dest_tx_hash);
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleToggleBrowserAlert = async () => {
    if (browserNotifsEnabled) {
      AlertService.setBrowserAlertEnabled(false);
      setBrowserNotifsEnabled(false);
      setAlertMsg('Browser notifications muted.');
    } else {
      const granted = await AlertService.requestNotificationPermission();
      setBrowserNotifsEnabled(granted);
      if (granted) {
        setAlertMsg('Browser notifications enabled! You will be alerted upon settlement.');
        AlertService.sendBrowserPushNotification('ZCross Notifications Active 🛡️', {
          body: 'You will receive an alert the moment your cross-chain swap settles.',
        });
      } else {
        setAlertMsg('Please allow notifications in browser permissions.');
      }
    }
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    AlertService.setTelegramRecipient(telegramHandle);
    setTelegramSaved(true);
    setAlertMsg(telegramHandle ? `Telegram alerts configured for ${telegramHandle}` : 'Telegram alerts removed.');
    setTimeout(() => {
      setTelegramSaved(false);
      setAlertMsg(null);
    }, 3000);
  };

  const { balanceZec, execute1ClickSwapPayment, account } = useEmbeddedWallet();
  const [payingInApp, setPayingInApp] = useState<boolean>(false);

  const handle1ClickPayInsideModal = async () => {
    setPayingInApp(true);
    try {
      const amt = parseFloat(quoteData.originAmountZec) || 0;
      await execute1ClickSwapPayment({
        originAmountZec: amt,
        destinationChain: quoteData.destinationChain,
        destinationAsset: quoteData.destinationAsset || '',
        destinationTokenSymbol: quoteData.destinationToken,
        recipientAddress: quoteData.recipientAddress,
        refundShieldedAddress: quoteData.refundShieldedAddress || account?.address,
        depositAddress: quoteData.depositUnifiedAddress,
        swapId: quoteData.swapId,
      });

      // Settle
      await handleSimulate('full_flow');
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setPayingInApp(false);
    }
  };

  const isStepDone = (stepIdx: number) => {
    const states = ['CREATED', 'MEMO_DETECTED', 'CONFIRMED_SHIELDED', 'SOLVER_EXECUTING', 'SETTLED'];
    const currentIdx = states.indexOf(status);
    return currentIdx >= stepIdx;
  };

  const isStepActive = (stepIdx: number) => {
    const states = ['CREATED', 'MEMO_DETECTED', 'CONFIRMED_SHIELDED', 'SOLVER_EXECUTING', 'SETTLED'];
    return states.indexOf(status) === stepIdx;
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 mb-2">
              <Shield className="w-3.5 h-3.5 fill-black dark:fill-amber-400 text-black dark:text-amber-400" />
              <span>Shielded Note Payment Request</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Send Exactly {quoteData.originAmountZec} ZEC
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Receiving ≈ {quoteData.estimatedOutput} {quoteData.destinationToken} on {quoteData.destinationChain.toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* In-Browser 1-Click Pay Option (Option 1) */}
        {status !== 'SETTLED' && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white flex-shrink-0">
                <Shield className="w-4 h-4 fill-black dark:fill-amber-400 text-black dark:text-amber-400" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Pay In-Browser (No Phone Needed)</span>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                  Shielded Vault: {balanceZec.toFixed(3)} ZEC
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handle1ClickPayInsideModal}
              disabled={payingInApp || simulating || balanceZec < parseFloat(quoteData.originAmountZec || '0')}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 active:scale-[0.98] text-white dark:text-black font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{payingInApp ? 'Paying...' : '1-Click Pay Now'}</span>
            </button>
          </div>
        )}

        {/* QR Code and Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
          {/* QR Code */}
          <div className="sm:col-span-5 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-xs">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="ZIP 321 QR Code" className="w-full max-w-[200px] h-auto rounded-xl shadow-xs" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-xs font-medium">
                Generating QR...
              </div>
            )}
            <div className="mt-3 flex flex-col items-center gap-1.5 w-full">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
                Scan with Shielded Wallet
              </span>
              <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t border-gray-200/80 dark:border-slate-800 w-full">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs" title="Electric Coin Co Zashi Wallet">
                  <ZashiLogo className="w-3.5 h-3.5 rounded-xs" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Zashi</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs" title="YWallet">
                  <YWalletLogo className="w-3.5 h-3.5 rounded-xs" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">YWallet</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs" title="Zodl Wallet">
                  <ZodlLogo className="w-3.5 h-3.5 rounded-xs" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Zodl</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="sm:col-span-7 space-y-3">
            {/* Amount */}
            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Transfer Amount (Shielded Orchard):</div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {quoteData.originAmountZec} ZEC
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(quoteData.originAmountZec, 'amount')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                >
                  {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'amount' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Solver Vault Address */}
            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Solver Shielded Unified Address (ZIP 316):</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                  {quoteData.depositUnifiedAddress}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(quoteData.depositUnifiedAddress, 'vault')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 transition cursor-pointer shadow-2xs"
                >
                  {copiedField === 'vault' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'vault' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Launch Wallet Link */}
            <a
              href={quoteData.zip321Uri}
              className="w-full py-3 px-4 rounded-full bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Desktop / Mobile Wallet Directly</span>
            </a>

            {/* Memo Inspector Toggle */}
            <button
              type="button"
              onClick={() => setShowMemoInspector(!showMemoInspector)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer pt-1 font-medium"
            >
              {showMemoInspector ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showMemoInspector ? 'Hide' : 'Inspect'} 512-Byte In-Band Encrypted Memo</span>
            </button>
          </div>
        </div>

        {/* Memo Inspector Panel */}
        {showMemoInspector && (
          <div className="mb-6 p-4 rounded-2xl bg-gray-950 text-white text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-cyan-400 font-semibold">
              <span>Decrypted Intent Structure</span>
              <span className="text-[11px] text-gray-400 font-mono">ChaCha20-Poly1305 (512B)</span>
            </div>
            <pre className="p-3 rounded-xl bg-black font-mono text-[11px] text-cyan-200 overflow-x-auto">
{JSON.stringify({
  protocol: "z-intent",
  version: 1,
  swapId: swapId.slice(0, 16),
  destinationChain: quoteData.destinationChain,
  destinationToken: quoteData.destinationToken,
  recipientAddress: quoteData.recipientAddress,
  slippageBps: 100,
  padding: "512B constant zero-pad to eliminate size correlation"
}, null, 2)}
            </pre>
            <p className="text-[11px] text-gray-400">
              Only the Solver's Orchard Incoming Viewing Key (IVK) can decrypt this memo. On-chain observers see zero transaction metadata.
            </p>
          </div>
        )}

        {/* Settlement Pipeline & Live Countdown */}
        <div className="p-5 rounded-2xl bg-gray-50/90 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 mb-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Execution Timeline
              </span>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                SLA &lt; 42s
              </span>
            </div>

            <div className="flex items-center gap-2">
              {status !== 'SETTLED' && (
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-spin" />
                  <span>Rate Locked: {formatCountdown(remainingSeconds)}</span>
                </div>
              )}
              {status === 'SETTLED' ? (
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Settled
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Stream</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black dark:bg-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: status === 'SETTLED' 
                  ? '100%' 
                  : status === 'SOLVER_EXECUTING' 
                    ? '75%' 
                    : status === 'CONFIRMED_SHIELDED' 
                      ? '50%' 
                      : status === 'MEMO_DETECTED' 
                        ? '25%' 
                        : '10%'
              }}
            />
          </div>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className={`flex items-start gap-3 ${isStepDone(0) ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>1. Shielded Note Broadcast</span>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">ZIP-321 In-Band</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  512-byte uniform encrypted memo generated with zero public sender link.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`flex items-start gap-3 ${isStepDone(1) ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                isStepDone(1) ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : isStepActive(0) ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
              }`}>
                {isStepDone(1) ? <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> : '2'}
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>2. Compact Block Verification</span>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">Halo2 Proof</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Orchard compact block ingested and cryptographic commitment verified.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`flex items-start gap-3 ${isStepDone(2) ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                isStepDone(2) ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : isStepActive(1) ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
              }`}>
                {isStepDone(2) ? <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> : '3'}
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>3. NEAR Intents Cross-Chain Solver Match</span>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">Atomic Escrow</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Decentralized solver committed destination liquidity at guaranteed rate.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`flex items-start gap-3 ${isStepDone(4) ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                isStepDone(4) ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : isStepActive(3) ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
              }`}>
                {isStepDone(4) ? <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> : '4'}
              </div>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>4. Destination Chain Settlement</span>
                  {destTxHash && (
                    <a
                      href={getExplorerUrl(quoteData.destinationChain, destTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 underline flex items-center gap-1"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Disbursed {quoteData.estimatedOutput} {quoteData.destinationToken} to {quoteData.recipientAddress.slice(0, 10)}...
                </div>
              </div>
            </div>
          </div>

          {/* Chaff & Settlement Jitter Status */}
          {quoteData.chaffEnabled && (
            <div className="mt-3 p-3 bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 rounded-2xl flex items-center justify-between text-xs text-cyan-900 dark:text-cyan-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="font-bold">Solver Jitter &amp; Chaff Active:</span>
                  <span className="ml-1 text-[11px] text-cyan-800 dark:text-cyan-300">
                    +{quoteData.jitterDelaySeconds || 45}s timing window &amp; 2 decoy Orchard note splits engaged
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/60 font-bold">
                Anti-Correlation
              </span>
            </div>
          )}

          {/* Real-Time Push & Telegram Alerts Card */}
          <div className="mt-3 p-3.5 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-black dark:text-amber-400" />
                <span>Real-Time Settlement Alerts</span>
              </span>
              <button
                type="button"
                onClick={handleToggleBrowserAlert}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  browserNotifsEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                    : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 shadow-2xs'
                }`}
              >
                <Bell className="w-3 h-3" />
                <span>{browserNotifsEnabled ? 'Browser Push: Active' : 'Enable Browser Push'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveTelegram} className="flex items-center gap-2 pt-1 border-t border-gray-200 dark:border-slate-800">
              <div className="relative flex-1">
                <Send className="w-3 h-3 text-gray-400 dark:text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  placeholder="Telegram @handle or Chat ID for ping"
                  className="w-full pl-7 pr-2.5 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs flex-shrink-0"
              >
                {telegramSaved ? 'Saved!' : 'Save'}
              </button>
            </form>

            {alertMsg && (
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                {alertMsg}
              </div>
            )}
          </div>
        </div>

        {/* Settled Result or Simulator Action */}
        {status === 'SETTLED' ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Swap Fully Settled!</span>
              </div>
              {destTxHash && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                  Tx: {destTxHash.slice(0, 24)}...
                </div>
              )}
            </div>

            <button
              onClick={onViewReceipt}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Audit Receipt</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-black dark:text-amber-400" />
                <span>Test Execution Simulation</span>
              </span>
              <span className="text-gray-500 dark:text-gray-400">Instant Local Settlement</span>
            </div>

            <button
              type="button"
              onClick={() => handleSimulate('full_flow')}
              disabled={simulating}
              className="w-full py-3 px-4 rounded-full bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{simulating ? 'Simulating Settlement...' : '1-Click Complete Settlement'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
