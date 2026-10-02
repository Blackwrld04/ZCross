'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { 
  EmbeddedOrchardAccount, 
  EmbeddedOrchardWalletService, 
  ShieldedTransactionRecord 
} from './embedded-wallet';
import { 
  registerPasskey, 
  authenticateWithPasskey, 
  hasRegisteredPasskey, 
  clearPasskey 
} from '../security/webauthn';

export interface EmbeddedWalletState {
  account: EmbeddedOrchardAccount | null;
  balanceZec: number;
  hasStoredWallet: boolean;
  history: ShieldedTransactionRecord[];
  isLocked: boolean;
  isWatchOnly: boolean;
  unlockedMnemonic: string | null;
  hasPasskey: boolean;
  autoLockMinutes: number;
  createNewWallet: (password: string, network?: 'mainnet' | 'testnet') => Promise<{ mnemonic: string; account: EmbeddedOrchardAccount }>;
  importWallet: (mnemonic: string, password: string, network?: 'mainnet' | 'testnet') => Promise<EmbeddedOrchardAccount>;
  importWatchOnlyFvk: (fvkOrAddress: string, network?: 'mainnet' | 'testnet') => Promise<EmbeddedOrchardAccount>;
  unlockWallet: (password: string) => Promise<string>;
  unlockWithPasskey: () => Promise<boolean>;
  enablePasskey: () => Promise<{ success: boolean; error?: string }>;
  disablePasskey: () => void;
  setAutoLockMinutes: (minutes: number) => void;
  lockWallet: () => void;
  fundWallet: (amountZec?: number) => void;
  withdrawWallet: (amountZec: number, payoutAccount?: string) => void;
  emergencyFastPurge: () => void;
  execute1ClickSwapPayment: (params: {
    originAmountZec: number;
    destinationChain: string;
    destinationAsset: string;
    destinationTokenSymbol: string;
    recipientAddress: string;
    refundShieldedAddress?: string;
    depositAddress: string;
    swapId?: string;
  }) => Promise<{ txid: string; newBalanceZec: number; auditReceiptHash: string }>;
  refreshWallet: () => void;
  resetWallet: () => void;
}

const EmbeddedWalletContext = createContext<EmbeddedWalletState | undefined>(undefined);

const STORAGE_KEY_AUTOLOCK = 'zcross_autolock_minutes';

export const EmbeddedWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<EmbeddedOrchardAccount | null>(null);
  const [balanceZec, setBalanceZec] = useState<number>(5.0);
  const [hasStoredWallet, setHasStoredWallet] = useState<boolean>(false);
  const [history, setHistory] = useState<ShieldedTransactionRecord[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [unlockedMnemonic, setUnlockedMnemonic] = useState<string | null>(null);
  const [hasPasskey, setHasPasskey] = useState<boolean>(false);
  const [autoLockMinutes, setAutoLockMinutesState] = useState<number>(15);

  const lastActivityRef = useRef<number>(Date.now());

  // Load autolock preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMins = localStorage.getItem(STORAGE_KEY_AUTOLOCK);
      if (storedMins) {
        setAutoLockMinutesState(Number(storedMins) || 15);
      }
      setHasPasskey(hasRegisteredPasskey());
    }
  }, []);

  const setAutoLockMinutes = (minutes: number) => {
    setAutoLockMinutesState(minutes);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AUTOLOCK, minutes.toString());
    }
  };

  // Sync state from local browser storage on mount
  const refreshWallet = useCallback(() => {
    if (typeof window === 'undefined') return;

    const hasStored = EmbeddedOrchardWalletService.hasStoredWallet();
    setHasStoredWallet(hasStored);
    setHasPasskey(hasRegisteredPasskey());

    if (hasStored) {
      const publicAccount = EmbeddedOrchardWalletService.getStoredPublicAccount();
      setAccount(publicAccount);
      setBalanceZec(EmbeddedOrchardWalletService.getShieldedBalance());
      setHistory(EmbeddedOrchardWalletService.getHistory());
    } else {
      // Auto-initialize standard default embedded Orchard wallet for seamless instant 1-click UX
      EmbeddedOrchardWalletService.createNewWallet('zcross-session', 'mainnet')
        .then(({ account: acc }) => {
          setAccount(acc);
          setBalanceZec(acc.shieldedBalanceZec);
          setHasStoredWallet(true);
          setIsLocked(false);
          setHistory(EmbeddedOrchardWalletService.getHistory());
        })
        .catch(err => console.warn('Embedded wallet auto-init:', err));
    }
  }, []);

  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  // Activity tracker for Auto-Lock Timeout
  useEffect(() => {
    if (autoLockMinutes <= 0 || isLocked) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    const timer = setInterval(() => {
      const elapsedMinutes = (Date.now() - lastActivityRef.current) / (1000 * 60);
      if (elapsedMinutes >= autoLockMinutes && !isLocked) {
        lockWallet();
      }
    }, 10000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      clearInterval(timer);
    };
  }, [autoLockMinutes, isLocked]);

  const createNewWallet = async (password: string, network: 'mainnet' | 'testnet' = 'mainnet') => {
    const res = await EmbeddedOrchardWalletService.createNewWallet(password, network);
    setAccount(res.account);
    setBalanceZec(res.account.shieldedBalanceZec);
    setHasStoredWallet(true);
    setIsLocked(false);
    setUnlockedMnemonic(res.mnemonic);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    return res;
  };

  const importWallet = async (mnemonic: string, password: string, network: 'mainnet' | 'testnet' = 'mainnet') => {
    const acc = await EmbeddedOrchardWalletService.importWallet(mnemonic, password, network);
    setAccount(acc);
    setBalanceZec(acc.shieldedBalanceZec);
    setHasStoredWallet(true);
    setIsLocked(false);
    setUnlockedMnemonic(mnemonic);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    return acc;
  };

  const importWatchOnlyFvk = async (fvkOrAddress: string, network: 'mainnet' | 'testnet' = 'mainnet') => {
    const acc = await EmbeddedOrchardWalletService.importWatchOnlyFvk(fvkOrAddress, network);
    setAccount(acc);
    setBalanceZec(acc.shieldedBalanceZec);
    setHasStoredWallet(true);
    setIsLocked(false);
    setUnlockedMnemonic(null);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    return acc;
  };

  const unlockWallet = async (password: string): Promise<string> => {
    const mnemonic = await EmbeddedOrchardWalletService.unlockAndExportMnemonic(password);
    setIsLocked(false);
    setUnlockedMnemonic(mnemonic);
    lastActivityRef.current = Date.now();
    return mnemonic;
  };

  const lockWallet = () => {
    setIsLocked(true);
    setUnlockedMnemonic(null);
  };

  // Biometric Passkeys (TouchID / FaceID)
  const enablePasskey = async (): Promise<{ success: boolean; error?: string }> => {
    if (!account?.address) {
      return { success: false, error: 'No active Orchard account to link passkey.' };
    }
    const res = await registerPasskey(account.address);
    if (res.success) {
      setHasPasskey(true);
    }
    return res;
  };

  const disablePasskey = () => {
    clearPasskey();
    setHasPasskey(false);
  };

  const unlockWithPasskey = async (): Promise<boolean> => {
    const res = await authenticateWithPasskey();
    if (res.success) {
      setIsLocked(false);
      lastActivityRef.current = Date.now();
      return true;
    }
    return false;
  };

  const fundWallet = (amountZec = 2.5) => {
    const updated = EmbeddedOrchardWalletService.fundBalance(amountZec);
    setBalanceZec(updated);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    lastActivityRef.current = Date.now();
  };

  const withdrawWallet = (amountZec: number, payoutAccount = 'Bank / Card Payout') => {
    const updated = EmbeddedOrchardWalletService.withdrawBalance(amountZec, payoutAccount);
    setBalanceZec(updated);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    lastActivityRef.current = Date.now();
  };

  // Emergency Fast Purge (Instant Wipe)
  const emergencyFastPurge = () => {
    EmbeddedOrchardWalletService.deleteWallet();
    clearPasskey();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('zcross_address_book_v1');
      localStorage.removeItem('zcross_autolock_minutes');
    }
    setAccount(null);
    setBalanceZec(0);
    setHasStoredWallet(false);
    setIsLocked(true);
    setUnlockedMnemonic(null);
    setHasPasskey(false);
    setHistory([]);
  };

  const execute1ClickSwapPayment = async (params: {
    originAmountZec: number;
    destinationChain: string;
    destinationAsset: string;
    destinationTokenSymbol: string;
    recipientAddress: string;
    refundShieldedAddress?: string;
    depositAddress: string;
    swapId?: string;
  }) => {
    const result = await EmbeddedOrchardWalletService.executeShieldedSwapPayment(params);
    setBalanceZec(result.newBalanceZec);
    setHistory(EmbeddedOrchardWalletService.getHistory());
    lastActivityRef.current = Date.now();
    return result;
  };

  const resetWallet = () => {
    EmbeddedOrchardWalletService.deleteWallet();
    setAccount(null);
    setBalanceZec(0);
    setHasStoredWallet(false);
    setIsLocked(true);
    setUnlockedMnemonic(null);
    setHistory([]);
    refreshWallet();
  };

  return (
    <EmbeddedWalletContext.Provider
      value={{
        account,
        balanceZec,
        hasStoredWallet,
        history,
        isLocked,
        isWatchOnly: Boolean(account?.isWatchOnly),
        unlockedMnemonic,
        hasPasskey,
        autoLockMinutes,
        createNewWallet,
        importWallet,
        importWatchOnlyFvk,
        unlockWallet,
        unlockWithPasskey,
        enablePasskey,
        disablePasskey,
        setAutoLockMinutes,
        lockWallet,
        fundWallet,
        withdrawWallet,
        emergencyFastPurge,
        execute1ClickSwapPayment,
        refreshWallet,
        resetWallet,
      }}
    >
      {children}
    </EmbeddedWalletContext.Provider>
  );
};

export const useEmbeddedWallet = (): EmbeddedWalletState => {
  const context = useContext(EmbeddedWalletContext);
  if (!context) {
    throw new Error('useEmbeddedWallet must be used within an EmbeddedWalletProvider');
  }
  return context;
};
