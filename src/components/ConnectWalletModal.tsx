'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useWallet } from '@/core/wallet/WalletContext';
import {
  SolflareLogo,
  PhantomLogo,
  MetaMaskLogo,
  RabbyLogo,
  ZerionLogo,
  CoinbaseLogo,
  TrustLogo,
  RainbowLogo,
  BackpackLogo,
  OKXLogo,
  CtrlLogo,
  KeplrLogo,
} from './BrandLogos';

interface ConnectWalletModalProps {
  chain?: string;
  onClose: () => void;
  onSelectAddress?: (address: string) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  chain = 'arb',
  onClose,
  onSelectAddress,
}) => {
  const {
    connectSolflare,
    connectPhantom,
    connectEVM,
    connectCustomAddress,
    isConnecting,
    error,
    clearError,
    detectedWallets,
    refreshWallets,
  } = useWallet();

  const [mounted, setMounted] = useState<boolean>(false);
  const [customAddress, setCustomAddress] = useState<string>('');
  const [customError, setCustomError] = useState<string | null>(null);

  // Mount check for React Portal
  useEffect(() => {
    setMounted(true);
    refreshWallets();
    const interval = setInterval(refreshWallets, 500);
    return () => clearInterval(interval);
  }, [refreshWallets]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const handleConnectSolflare = async () => {
    clearError();
    const addr = await connectSolflare();
    if (addr) {
      if (onSelectAddress) onSelectAddress(addr);
      onClose();
    }
  };

  const handleConnectPhantom = async () => {
    clearError();
    const addr = await connectPhantom();
    if (addr) {
      if (onSelectAddress) onSelectAddress(addr);
      onClose();
    }
  };

  const handleConnectEVMWallet = async (walletId?: string) => {
    clearError();
    const addr = await connectEVM(walletId);
    if (addr) {
      if (onSelectAddress) onSelectAddress(addr);
      onClose();
    }
  };

  const handleConnectBackpack = async () => {
    clearError();
    const w = window as any;
    if (w.backpack || w.backpack?.solana) {
      try {
        const bp = w.backpack?.solana || w.backpack;
        const res = await bp.connect();
        const addr = res?.publicKey?.toString() || bp.publicKey?.toString();
        if (addr) {
          connectCustomAddress('sol', addr);
          if (onSelectAddress) onSelectAddress(addr);
          onClose();
          return;
        }
      } catch (e: any) {
        clearError();
      }
    }
    // Fallback to Solana connect
    const addr = await connectSolflare();
    if (addr) {
      if (onSelectAddress) onSelectAddress(addr);
      onClose();
    }
  };

  const handleConnectKeplr = async () => {
    clearError();
    const w = window as any;
    if (w.keplr) {
      try {
        await w.keplr.enable('cosmoshub-4');
        const key = await w.keplr.getKey('cosmoshub-4');
        if (key?.bech32Address) {
          if (onSelectAddress) onSelectAddress(key.bech32Address);
          onClose();
          return;
        }
      } catch (err: any) {
        console.warn('Keplr enable error:', err);
      }
    }
    handleConnectEVMWallet('keplr');
  };

  const handleApplyCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);
    const clean = customAddress.trim();

    if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
      connectCustomAddress('arb', clean);
      if (onSelectAddress) onSelectAddress(clean);
      onClose();
    } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
      connectCustomAddress('sol', clean);
      if (onSelectAddress) onSelectAddress(clean);
      onClose();
    } else if (clean.length >= 26) {
      if (onSelectAddress) onSelectAddress(clean);
      onClose();
    } else {
      setCustomError('Please enter a valid EVM (0x...) or Solana base58 address.');
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 rounded-[28px] shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
            Choose Wallet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Select your Web3 wallet to connect and settle cross-chain funds.
        </p>

        {/* Error Alert */}
        {(error || customError) && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error || customError}</span>
            </div>
          </div>
        )}

        {/* Software Wallets 2-Column Grid */}
        <div className="max-h-[56vh] overflow-y-auto pr-1 space-y-2.5 mb-5 custom-scrollbar">
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Solflare */}
            <button
              type="button"
              onClick={handleConnectSolflare}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.solflare 
                  ? 'border-orange-300 dark:border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/30 hover:border-orange-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Solflare</span>
                {detectedWallets.solflare && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <SolflareLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 2. Phantom */}
            <button
              type="button"
              onClick={handleConnectPhantom}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.phantom 
                  ? 'border-purple-300 dark:border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/30 hover:border-purple-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Phantom</span>
                {detectedWallets.phantom && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <PhantomLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 3. MetaMask */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('metamask')}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.metamask 
                  ? 'border-amber-300 dark:border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/30 hover:border-amber-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">MetaMask</span>
                {detectedWallets.metamask && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <MetaMaskLogo className="w-7 h-7 flex-shrink-0 shadow-xs" />
            </button>

            {/* 4. Rabby Wallet */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('rabby')}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.rabby 
                  ? 'border-indigo-300 dark:border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/30 hover:border-indigo-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Rabby</span>
                {detectedWallets.rabby && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <RabbyLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 5. Zerion */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('zerion')}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.zerion 
                  ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 hover:border-blue-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Zerion</span>
                {detectedWallets.zerion && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <ZerionLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 6. Coinbase Wallet */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('coinbase')}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.coinbase 
                  ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 hover:border-blue-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Coinbase</span>
                {detectedWallets.coinbase && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <CoinbaseLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 7. Trust Wallet */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('trust')}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.trust 
                  ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 hover:border-blue-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Trust Wallet</span>
                {detectedWallets.trust && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <TrustLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 8. Rainbow */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('rainbow')}
              disabled={isConnecting}
              className="w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Rainbow</span>
              <RainbowLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 9. Backpack */}
            <button
              type="button"
              onClick={handleConnectBackpack}
              disabled={isConnecting}
              className={`w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
                detectedWallets.backpack 
                  ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/30 hover:border-red-400' 
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Backpack</span>
                {detectedWallets.backpack && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <BackpackLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 10. OKX Wallet */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('okx')}
              disabled={isConnecting}
              className="w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">OKX Wallet</span>
              <OKXLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 11. Ctrl */}
            <button
              type="button"
              onClick={() => handleConnectEVMWallet('ctrl')}
              disabled={isConnecting}
              className="w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Ctrl</span>
              <CtrlLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>

            {/* 12. Keplr */}
            <button
              type="button"
              onClick={handleConnectKeplr}
              className="w-full bg-gray-50/80 dark:bg-slate-950/60 hover:bg-gray-100/90 dark:hover:bg-slate-850 active:scale-[0.98] border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Keplr</span>
              <KeplrLogo className="w-7 h-7 flex-shrink-0 rounded-lg shadow-xs" />
            </button>
          </div>
        </div>

        {/* Direct Address Input Form */}
        <form onSubmit={handleApplyCustomAddress} className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>Or Enter Destination Address Directly</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">EVM / Solana</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="Paste 0x... or Solana address"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-amber-400 focus:bg-white dark:focus:bg-slate-900 transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs transition cursor-pointer"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Security Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero Private Keys Accessed</span>
          </span>
          <span>Non-Custodial</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
