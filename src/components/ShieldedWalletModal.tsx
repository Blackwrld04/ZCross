'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { 
  X, Shield, Copy, Check, Plus, RefreshCw, KeyRound, 
  ExternalLink, Eye, EyeOff, AlertCircle, ArrowUpRight, ArrowDownLeft,
  Fingerprint, Lock, ShieldAlert, Timer, Sparkles, CreditCard
} from 'lucide-react';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { useLivePrices } from '@/core/prices/PriceContext';
import { ZashiLogo, YWalletLogo, ZcashIcon, GooglePayLogo } from './BrandLogos';
import { FiatOnrampModal } from './FiatOnrampModal';

interface ShieldedWalletModalProps {
  onClose: () => void;
}

export const ShieldedWalletModal: React.FC<ShieldedWalletModalProps> = ({ onClose }) => {
  const { zecPriceUsd } = useLivePrices();
  const { 
    account, 
    balanceZec, 
    fundWallet, 
    refreshWallet, 
    unlockedMnemonic, 
    unlockWallet, 
    unlockWithPasskey,
    enablePasskey,
    disablePasskey,
    hasPasskey,
    autoLockMinutes,
    setAutoLockMinutes,
    emergencyFastPurge,
    history,
    resetWallet,
    isLocked,
    isWatchOnly,
    importWatchOnlyFvk,
    lockWallet
  } = useEmbeddedWallet();

  const [mounted, setMounted] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);
  const [copiedFvk, setCopiedFvk] = useState<boolean>(false);
  const [copiedSeed, setCopiedSeed] = useState<boolean>(false);
  const [showSeed, setShowSeed] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('zcross-session');
  const [seedError, setSeedError] = useState<string | null>(null);
  const [revealedSeed, setRevealedSeed] = useState<string | null>(unlockedMnemonic);
  const [faucetLoading, setFaucetLoading] = useState<boolean>(false);
  const [passkeyLoading, setPasskeyLoading] = useState<boolean>(false);
  const [passkeyMsg, setPasskeyMsg] = useState<string | null>(null);
  const [showFiatModal, setShowFiatModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'account' | 'receive' | 'security' | 'history'>('account');

  // Watch-Only FVK Import State
  const [showImportFvkModal, setShowImportFvkModal] = useState<boolean>(false);
  const [importFvkInput, setImportFvkInput] = useState<string>('');
  const [importFvkError, setImportFvkError] = useState<string | null>(null);
  const [importFvkSuccess, setImportFvkSuccess] = useState<boolean>(false);
  const [importingFvk, setImportingFvk] = useState<boolean>(false);

  // Mount check for Portal
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.location.search.includes('tab=security')) {
      setActiveTab('security');
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate QR Code for Orchard Unified Address
  useEffect(() => {
    if (account?.address) {
      QRCode.toDataURL(account.address, {
        width: 220,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Failed to generate address QR:', err));
    }
  }, [account?.address]);

  // Copy helper
  const handleCopy = (text: string, type: 'addr' | 'fvk' | 'seed') => {
    navigator.clipboard.writeText(text);
    if (type === 'addr') {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } else if (type === 'fvk') {
      setCopiedFvk(true);
      setTimeout(() => setCopiedFvk(false), 2000);
    } else if (type === 'seed') {
      setCopiedSeed(true);
      setTimeout(() => setCopiedSeed(false), 2000);
    }
  };

  const handleFaucet = () => {
    setFaucetLoading(true);
    setTimeout(() => {
      fundWallet(2.5);
      setFaucetLoading(false);
    }, 400);
  };

  const handleRevealSeed = async () => {
    if (showSeed) {
      setShowSeed(false);
      return;
    }
    setSeedError(null);
    try {
      if (revealedSeed) {
        setShowSeed(true);
        return;
      }
      const mnemonic = await unlockWallet(passwordInput);
      setRevealedSeed(mnemonic);
      setShowSeed(true);
    } catch (err: any) {
      setSeedError(err.message || 'Incorrect password to decrypt seed phrase.');
    }
  };

  const handleTogglePasskey = async () => {
    setPasskeyMsg(null);
    if (hasPasskey) {
      disablePasskey();
      setPasskeyMsg('Biometric passkey disabled.');
    } else {
      setPasskeyLoading(true);
      const res = await enablePasskey();
      setPasskeyLoading(false);
      if (res.success) {
        setPasskeyMsg('TouchID / FaceID Passkey enrolled successfully!');
      } else {
        setPasskeyMsg(res.error || 'Failed to register biometric passkey.');
      }
    }
    setTimeout(() => setPasskeyMsg(null), 3500);
  };

  const handleBiometricUnlock = async () => {
    const success = await unlockWithPasskey();
    if (success) {
      setPasskeyMsg('Vault unlocked with biometric passkey!');
      setTimeout(() => setPasskeyMsg(null), 2500);
    } else {
      setPasskeyMsg('Biometric verification failed.');
    }
  };

  const handleEmergencyPurge = () => {
    if (confirm('CRITICAL ACTION: This will permanently wipe all local keys, saved contacts, and session data. Are you sure?')) {
      emergencyFastPurge();
      onClose();
    }
  };

  const handleImportFvkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportFvkError(null);
    const clean = importFvkInput.trim();
    if (!clean) {
      setImportFvkError('Please paste a valid Full Viewing Key (uview1...) or Unified Address (u1...).');
      return;
    }

    setImportingFvk(true);
    try {
      await importWatchOnlyFvk(clean);
      setImportFvkSuccess(true);
      setTimeout(() => {
        setImportFvkSuccess(false);
        setShowImportFvkModal(false);
        setImportFvkInput('');
        setActiveTab('account');
      }, 1000);
    } catch (err: any) {
      setImportFvkError(err.message || 'Failed to import watch-only viewing key.');
    } finally {
      setImportingFvk(false);
    }
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const currentAddress = account?.address || 'Generating Unified Address (u1...)...';
  const currentFvk = account?.fvk || 'Generating Viewing Key...';
  const usdValue = (balanceZec * zecPriceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-[500px] max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white">
              <Shield className="w-5 h-5 fill-black dark:fill-amber-400 text-black dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                  Shielded Zcash Vault
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black text-white dark:bg-amber-500 dark:text-black uppercase tracking-wider">
                  Orchard
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-slate-950/80 border border-transparent dark:border-slate-800 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'account' 
                ? 'bg-black text-white dark:bg-amber-500 dark:text-black shadow-2xs font-bold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receive')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'receive' 
                ? 'bg-black text-white dark:bg-amber-500 dark:text-black shadow-2xs font-bold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Receive / QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'security' 
                ? 'bg-black text-white dark:bg-amber-500 dark:text-black shadow-2xs font-bold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Security &amp; Passkey
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
              activeTab === 'history' 
                ? 'bg-black text-white dark:bg-amber-500 dark:text-black shadow-2xs font-bold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            History ({history.length})
          </button>
        </div>

        {/* TAB 1: ACCOUNT OVERVIEW */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Available Shielded Balance
                </span>
                {isWatchOnly ? (
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Watch-Only Mode
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Instant 1-Click Ready
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {balanceZec.toFixed(4)}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">ZEC</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                ≈ ${usdValue} USD
              </div>

              {isWatchOnly && (
                <div className="mt-3 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-left flex items-start gap-2.5">
                  <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>Watch-Only (Mobile Synced):</strong> Your private spending keys never touch this browser. Balances & incoming notes are monitored live. To execute swaps, sign on your mobile app (Zashi / YWallet) using the generated QR code.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFiatModal(true)}
                  className="w-full py-2.5 px-2 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black active:scale-[0.98] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  title="Buy Shielded ZEC with Google Pay"
                >
                  <GooglePayLogo className="w-3.5 h-3.5" />
                  <span>Buy ZEC</span>
                </button>
                <button
                  type="button"
                  onClick={handleFaucet}
                  disabled={faucetLoading}
                  className="w-full py-2.5 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{faucetLoading ? 'Funding...' : 'Faucet'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('receive')}
                  className="w-full py-2.5 px-2 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 active:scale-[0.98] rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span>Receive</span>
                </button>
              </div>
            </div>

            {/* Address Quick Card */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Unified Shielded Address (ZIP-316)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAddress, 'addr')}
                  className="text-xs font-semibold text-slate-900 dark:text-white hover:text-black dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  {copiedAddr ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedAddr ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 select-all">
                {currentAddress}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: RECEIVE / QR */}
        {activeTab === 'receive' && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Scan with Orchard-compatible shielded mobile wallets to deposit ZEC:
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs">
                  <ZashiLogo className="w-3.5 h-3.5 rounded-xs" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">Zashi</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs">
                  <YWalletLogo className="w-3.5 h-3.5 rounded-xs" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">YWallet</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <div className="p-3 bg-white border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm inline-block">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={qrCodeUrl} 
                    alt="Shielded Unified Address QR" 
                    className="w-48 h-48 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
                    Generating QR...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">Orchard Address</span>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAddress, 'addr')}
                  className="text-xs font-semibold text-slate-900 dark:text-white hover:text-black dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  {copiedAddr ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedAddr ? 'Copied' : 'Copy Address'}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {currentAddress}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: KEYS & SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* WebAuthn Passkeys / Biometrics */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-black dark:bg-amber-500 text-white dark:text-black flex items-center justify-center">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      TouchID / FaceID Passkey
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      FIDO2 WebAuthn biometric unlock
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePasskey}
                  disabled={passkeyLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    hasPasskey 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400' 
                      : 'bg-black text-white dark:bg-amber-500 dark:text-black hover:bg-gray-800 dark:hover:bg-amber-400 shadow-xs'
                  }`}
                >
                  {passkeyLoading ? 'Registering...' : hasPasskey ? 'Enabled (Touch to Remove)' : 'Enable Passkey'}
                </button>
              </div>

              {passkeyMsg && (
                <div className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                  {passkeyMsg}
                </div>
              )}

              {hasPasskey && isLocked && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleBiometricUnlock}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>Unlock Vault with Biometrics</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auto-Lock Inactivity Timeout */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Auto-Lock Inactivity Timer</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Locks vault when inactive</div>
                </div>
              </div>

              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={0}>Never</option>
              </select>
            </div>

            {/* Seed Phrase Backup */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <KeyRound className="w-4 h-4 text-black dark:text-amber-400" />
                  12-Word Recovery Seed Phrase
                </div>
                <button
                  type="button"
                  onClick={handleRevealSeed}
                  className="text-xs font-semibold text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showSeed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showSeed ? 'Hide' : 'Reveal'}
                </button>
              </div>

              {showSeed ? (
                <div className="space-y-2.5">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 select-all leading-relaxed">
                    {revealedSeed || unlockedMnemonic || 'Seed phrase locked. Enter password below.'}
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 dark:text-gray-400">Keep this offline. Never share with anyone.</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(revealedSeed || unlockedMnemonic || '', 'seed')}
                      className="font-bold text-slate-900 dark:text-white hover:text-black dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSeed ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedSeed ? 'Copied' : 'Copy Words'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your seed phrase allows restoring this shielded Orchard wallet in any BIP-39 compatible client. Click Reveal to display.
                </p>
              )}

              {seedError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {seedError}
                </div>
              )}
            </div>

            {/* Viewing Key (FVK) & Watcher Mode */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Viewing Key (FVK)</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Read-only auditing key for Zashi / YWallet watch-only sync</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentFvk, 'fvk')}
                  className="text-xs font-semibold text-slate-900 dark:text-white hover:text-black dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFvk ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedFvk ? 'Copied' : 'Copy FVK'}
                </button>
              </div>
              <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 select-all">
                {currentFvk}
              </p>

              {/* Watch-Only Import CTA */}
              <div className="pt-2 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-600 dark:text-gray-400">Want to connect an external mobile wallet?</span>
                <button
                  type="button"
                  onClick={() => setShowImportFvkModal(true)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Import Watch-Only FVK</span>
                </button>
              </div>
            </div>

            {/* Emergency Fast Purge & Reset */}
            <div className="pt-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleEmergencyPurge}
                className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-bold cursor-pointer"
                title="Wipes all keys, contacts, and session storage immediately"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Emergency Fast Purge (Instant Wipe)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Create new wallet? Make sure you backed up your recovery seed phrase!')) {
                    resetWallet();
                  }
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold cursor-pointer"
              >
                Reset Wallet
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHIELDED LEDGER HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Local Shielded Ledger</span>
              <button
                type="button"
                onClick={refreshWallet}
                className="text-xs text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-950/60 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                <Shield className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">No shielded transactions yet</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Execute a swap or use the faucet to see shielded activity recorded here.
                </p>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {history.map((tx) => (
                  <div 
                    key={tx.txid} 
                    className="p-3 bg-gray-50 dark:bg-slate-950/60 hover:bg-gray-100/80 dark:hover:bg-slate-850 border border-gray-200 dark:border-slate-800 rounded-xl transition text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {tx.type === 'SWAP_OUT' ? (
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center">
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center border border-gray-200 dark:border-slate-700">
                            <ArrowDownLeft className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-slate-900 dark:text-white font-semibold">
                          {tx.type === 'SWAP_OUT' ? 'Cross-Chain Swap' : 'Shielded Deposit / Faucet'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {tx.type === 'SWAP_OUT' ? '-' : '+'}{tx.amountZec.toFixed(4)} ZEC
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                      <span className="truncate max-w-[150px]">{tx.txid.slice(0, 10)}...{tx.txid.slice(-6)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-semibold border border-gray-200 dark:border-slate-700">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>ZCross Protocol v2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      {showFiatModal && (
        <FiatOnrampModal
          onClose={() => setShowFiatModal(false)}
          onSuccess={() => {
            setShowFiatModal(false);
            refreshWallet();
          }}
        />
      )}

      {/* Watch-Only FVK Import Modal */}
      {showImportFvkModal && createPortal(
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImportFvkModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Import Watch-Only Viewing Key</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Monitor external Zashi or YWallet safely</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportFvkModal(false)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportFvkSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Zero Private Key Exposure:</strong> Full Viewing Keys allow live shielded balance checks and incoming note decryption without revealing spending capability.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Viewing Key or Unified Address
                </label>
                <textarea
                  value={importFvkInput}
                  onChange={(e) => setImportFvkInput(e.target.value)}
                  placeholder="Paste uview1... (Full Viewing Key) or u1... (Unified Address)"
                  rows={3}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {importFvkError && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800/60 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{importFvkError}</span>
                </div>
              )}

              {importFvkSuccess && (
                <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Watch-Only Vault successfully imported! Syncing...</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportFvkModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importingFvk || importFvkSuccess}
                  className="flex-1 py-2.5 bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {importingFvk ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Key...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-400 dark:text-black" />
                      <span>Import Watch-Only</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
