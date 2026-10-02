'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, Sparkles } from 'lucide-react';
import { useEmbeddedWallet } from '@/core/zcash/EmbeddedWalletContext';
import { ShieldedWalletModal } from './ShieldedWalletModal';

export const ShieldedWalletBadge: React.FC = () => {
  const { account, balanceZec } = useEmbeddedWallet();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('wallet_modal=1')) {
      setShowModal(true);
    }
  }, []);

  const shortenedAddress = account 
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : 'Orchard Vault';

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-800 transition cursor-pointer shadow-2xs group shrink-0"
        title="View In-Browser Shielded Orchard Zcash Account"
      >
        <div className="w-4 h-4 rounded-full bg-black/10 dark:bg-amber-400/20 flex items-center justify-center text-black dark:text-amber-400 shrink-0">
          <Shield className="w-2.5 h-2.5 fill-black dark:fill-amber-400 text-black dark:text-amber-400" />
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
            {balanceZec.toFixed(balanceZec >= 100 ? 1 : 2)} <span className="hidden sm:inline">ZEC</span>
          </span>
          <span className="text-gray-400 dark:text-gray-500 hidden md:inline">•</span>
          <span className="text-gray-600 dark:text-gray-400 hidden md:inline">{shortenedAddress}</span>
        </div>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition shrink-0" />
      </button>

      {showModal && (
        <ShieldedWalletModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
