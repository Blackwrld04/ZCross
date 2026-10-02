'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Check, Copy, LogOut, ChevronDown, Sparkles, RefreshCw } from 'lucide-react';
import { useWallet } from '@/core/wallet/WalletContext';
import { ConnectWalletModal } from './ConnectWalletModal';
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
  SolanaIcon,
  ArbitrumIcon,
} from './BrandLogos';

interface WalletButtonProps {
  chain?: string;
  onAddressSelected?: (address: string) => void;
  className?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({ 
  chain = 'arb', 
  onAddressSelected,
  className = ''
}) => {
  const { 
    isConnecting, 
    disconnectAll,
    getActiveAddressForChain,
    activeWalletName 
  } = useWallet();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeAddress = getActiveAddressForChain(chain);
  const isSolTarget = chain.toLowerCase() === 'sol';

  // Handle click outside to close dropdown
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('connect_modal')) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenModal = () => {
    setIsOpen(false);
    setShowModal(true);
  };

  const shortened = activeAddress 
    ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` 
    : '';

  const getWalletIcon = (className = 'w-3.5 h-3.5') => {
    const name = (activeWalletName || '').toLowerCase();
    if (name.includes('solflare')) return <SolflareLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('phantom')) return <PhantomLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('meta') || name.includes('evm')) return <MetaMaskLogo className={`${className} flex-shrink-0`} />;
    if (name.includes('rabby')) return <RabbyLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('zerion')) return <ZerionLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('coinbase')) return <CoinbaseLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('trust')) return <TrustLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('rainbow')) return <RainbowLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('backpack')) return <BackpackLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('okx')) return <OKXLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('ctrl')) return <CtrlLogo className={`${className} rounded-xs flex-shrink-0`} />;
    if (name.includes('keplr')) return <KeplrLogo className={`${className} rounded-xs flex-shrink-0`} />;
    return isSolTarget ? <SolanaIcon className={`${className} flex-shrink-0`} /> : <ArbitrumIcon className={`${className} flex-shrink-0`} />;
  };

  return (
    <>
      {!activeAddress ? (
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={isConnecting}
          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black transition cursor-pointer shadow-xs active:scale-95 shrink-0 ${className}`}
        >
          <Wallet className="w-3.5 h-3.5 text-amber-400 dark:text-black shrink-0" />
          <span>
            {isConnecting 
              ? 'Connecting...' 
              : isSolTarget 
                ? 'Connect Solana' 
                : 'Connect Wallet'}
          </span>
        </button>
      ) : (
        <div ref={dropdownRef} className="relative inline-block text-left shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer shadow-2xs shrink-0 ${className}`}
          >
            {getWalletIcon('w-3.5 h-3.5 sm:w-4 sm:h-4')}
            <span className="font-mono">{shortened}</span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1 flex items-center gap-1.5">
                {getWalletIcon('w-3.5 h-3.5')}
                <span>Connected {activeWalletName || (isSolTarget ? 'Solana' : 'EVM')}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 mb-2 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all">
                {activeAddress}
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeAddress)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                  </span>
                </button>

                {onAddressSelected && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddressSelected(activeAddress);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 font-semibold transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Use for Recipient</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span>Switch / Change Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    disconnectAll();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Portal Modal is accessible in both connected and disconnected states */}
      {showModal && (
        <ConnectWalletModal
          chain={chain}
          onClose={() => setShowModal(false)}
          onSelectAddress={(addr) => {
            if (onAddressSelected) onAddressSelected(addr);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};
