'use client';

/**
 * Multi-Chain Web3 Live Wallet Provider
 * Direct live integration with real browser extensions and mobile wallet apps:
 * - Solana: Solflare (window.solflare), Phantom (window.phantom?.solana), Backpack, Coinbase Solana
 * - EVM: EIP-6963 Multi-Injected Discovery (MetaMask, Rabby, Coinbase, Rainbow) + window.ethereum
 * - Mobile: In-app Webview detection + 1-tap Universal Deeplinks
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface DetectedWallets {
  solflare: boolean;
  phantom: boolean;
  backpack: boolean;
  solanaAny: boolean;
  metamask: boolean;
  coinbase: boolean;
  rabby: boolean;
  zerion: boolean;
  trust: boolean;
  rainbow: boolean;
  okx: boolean;
  ctrl: boolean;
  evmAny: boolean;
  isMobile: boolean;
}

export interface Eip6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

export interface WalletState {
  evmAddress: string | null;
  solanaAddress: string | null;
  activeWalletName: string | null;
  isConnecting: boolean;
  error: string | null;
  detectedWallets: DetectedWallets;
  isEvmAvailable: boolean;
  isSolanaAvailable: boolean;
  eip6963Providers: Eip6963ProviderDetail[];
  connectSolflare: () => Promise<string | null>;
  connectPhantom: () => Promise<string | null>;
  connectSolana: (preferredType?: 'solflare' | 'phantom' | 'any') => Promise<string | null>;
  connectEVM: (preferredProvider?: any) => Promise<string | null>;
  connectCustomAddress: (chain: string, address: string) => boolean;
  disconnectEVM: () => void;
  disconnectSolana: () => void;
  disconnectAll: () => void;
  clearError: () => void;
  refreshWallets: () => void;
  getActiveAddressForChain: (chain: string) => string | null;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
  const [activeWalletName, setActiveWalletName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [eip6963Providers, setEip6963Providers] = useState<Eip6963ProviderDetail[]>([]);

  const [detectedWallets, setDetectedWallets] = useState<DetectedWallets>({
    solflare: false,
    phantom: false,
    backpack: false,
    solanaAny: false,
    metamask: false,
    coinbase: false,
    rabby: false,
    zerion: false,
    trust: false,
    rainbow: false,
    okx: false,
    ctrl: false,
    evmAny: false,
    isMobile: false,
  });

  // Comprehensive wallet detector across window objects and injected prototypes
  const checkDetected = useCallback(() => {
    if (typeof window === 'undefined') return;

    const w = window as any;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 1. Solflare Detection
    // Checks dedicated window.solflare, standard isSolflare flag, or window.solana.isSolflare
    const solflarePresent = Boolean(
      w.solflare?.isSolflare ||
      w.solflare ||
      w.solana?.isSolflare
    );

    // 2. Phantom Detection
    const phantomPresent = Boolean(
      w.phantom?.solana?.isPhantom ||
      w.phantom?.solana ||
      w.solana?.isPhantom
    );

    // 3. Backpack & other Solana
    const backpackPresent = Boolean(w.backpack || w.backpack?.solana);
    const solanaAnyPresent = Boolean(
      solflarePresent ||
      phantomPresent ||
      backpackPresent ||
      w.coinbaseSolana ||
      w.solana
    );

    // 4. EVM Detection
    const eth = w.ethereum;
    const metamaskPresent = Boolean(
      (eth?.isMetaMask && !eth?.isRabby) ||
      (eth?.providers && eth.providers.some((p: any) => p.isMetaMask && !p.isRabby))
    );
    const coinbasePresent = Boolean(
      eth?.isCoinbaseWallet ||
      w.coinbaseWalletExtension ||
      (eth?.providers && eth.providers.some((p: any) => p.isCoinbaseWallet))
    );
    const rabbyPresent = Boolean(
      eth?.isRabby ||
      (eth?.providers && eth.providers.some((p: any) => p.isRabby))
    );
    const zerionPresent = Boolean(
      w.zerionWallet ||
      eth?.isZerion ||
      (eth?.providers && eth.providers.some((p: any) => p.isZerion))
    );
    const trustPresent = Boolean(
      w.trustwallet ||
      eth?.isTrust ||
      (eth?.providers && eth.providers.some((p: any) => p.isTrust))
    );
    const rainbowPresent = Boolean(
      eth?.isRainbow ||
      (eth?.providers && eth.providers.some((p: any) => p.isRainbow))
    );
    const okxPresent = Boolean(
      w.okxwallet ||
      eth?.isOkxWallet ||
      (eth?.providers && eth.providers.some((p: any) => p.isOkxWallet))
    );
    const ctrlPresent = Boolean(
      w.xfi ||
      eth?.isXDEFI ||
      (eth?.providers && eth.providers.some((p: any) => p.isXDEFI))
    );
    const evmAnyPresent = Boolean(
      eth ||
      w.web3 ||
      w.ethereum?.providers?.length > 0 ||
      zerionPresent ||
      trustPresent ||
      okxPresent ||
      ctrlPresent
    );

    setDetectedWallets({
      solflare: solflarePresent,
      phantom: phantomPresent,
      backpack: backpackPresent,
      solanaAny: solanaAnyPresent,
      metamask: metamaskPresent,
      coinbase: coinbasePresent,
      rabby: rabbyPresent,
      zerion: zerionPresent,
      trust: trustPresent,
      rainbow: rainbowPresent,
      okx: okxPresent,
      ctrl: ctrlPresent,
      evmAny: evmAnyPresent,
      isMobile,
    });
  }, []);

  // Monitor wallet availability and listen to async extensions & EIP-6963
  useEffect(() => {
    if (typeof window === 'undefined') return;

    checkDetected();

    // Restore saved sessions
    const savedEvm = localStorage.getItem('zcross_connected_evm');
    if (savedEvm && /^0x[a-fA-F0-9]{40}$/.test(savedEvm)) {
      setEvmAddress(savedEvm);
    }

    const savedSol = localStorage.getItem('zcross_connected_sol');
    if (savedSol && savedSol.length >= 32) {
      setSolanaAddress(savedSol);
    }

    const savedWallet = localStorage.getItem('zcross_connected_wallet_name');
    if (savedWallet) {
      setActiveWalletName(savedWallet);
    }

    // Listen to asynchronous wallet injections (Solflare, Phantom, MetaMask dispatch events)
    window.addEventListener('solflare#initialized', checkDetected);
    window.addEventListener('solana#initialized', checkDetected);
    window.addEventListener('ethereum#initialized', checkDetected);

    // EIP-6963 provider announcements for modern multi-wallet discovery
    const handleEip6963 = (event: any) => {
      if (event?.detail?.info) {
        setEip6963Providers((prev) => {
          if (prev.some((p) => p.info.uuid === event.detail.info.uuid)) return prev;
          return [...prev, event.detail];
        });
        checkDetected();
      }
    };
    window.addEventListener('eip6963:announceProvider', handleEip6963);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Listen for EVM account changes
    const eth = (window as any).ethereum;
    if (eth?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setEvmAddress(accounts[0]);
          localStorage.setItem('zcross_connected_evm', accounts[0]);
        } else {
          setEvmAddress(null);
          localStorage.removeItem('zcross_connected_evm');
        }
      };
      eth.on('accountsChanged', handleAccountsChanged);
    }

    // Polling check for the first 3.5 seconds (catches extensions injecting after initial mount)
    const interval = setInterval(checkDetected, 250);
    const stopTimer = setTimeout(() => clearInterval(interval), 3500);

    return () => {
      window.removeEventListener('solflare#initialized', checkDetected);
      window.removeEventListener('solana#initialized', checkDetected);
      window.removeEventListener('ethereum#initialized', checkDetected);
      window.removeEventListener('eip6963:announceProvider', handleEip6963);
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, [checkDetected]);

  // Connect dedicated Solflare wallet
  const connectSolflare = async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window environment unavailable.');
      }

      const w = window as any;
      let provider = w.solflare;
      if (!provider && w.solana?.isSolflare) {
        provider = w.solana;
      }

      if (!provider) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://solflare.com/ul/v1/browse/${encodeURIComponent(window.location.href)}`;
          setIsConnecting(false);
          return null;
        }
        throw new Error('Solflare wallet extension is not detected in this browser. Please ensure the Solflare extension is installed and enabled, then try again.');
      }

      // Connect to Solflare
      await provider.connect();

      const pubKey = provider.publicKey ? provider.publicKey.toString() : null;
      if (pubKey) {
        setSolanaAddress(pubKey);
        setActiveWalletName('Solflare');
        localStorage.setItem('zcross_connected_sol', pubKey);
        localStorage.setItem('zcross_connected_wallet_name', 'Solflare');

        // Setup Solflare event listeners
        provider.on?.('accountChanged', (newKey: any) => {
          if (newKey) {
            const nextAddr = newKey.toString();
            setSolanaAddress(nextAddr);
            localStorage.setItem('zcross_connected_sol', nextAddr);
          } else {
            setSolanaAddress(null);
            localStorage.removeItem('zcross_connected_sol');
          }
        });

        setIsConnecting(false);
        return pubKey;
      }

      throw new Error('Failed to retrieve authorized public key from Solflare.');
    } catch (err: any) {
      const msg = err.message || 'Failed to connect Solflare wallet';
      console.warn('[Wallet] Solflare error:', msg);
      setError(msg);
      setIsConnecting(false);
      return null;
    }
  };

  // Connect dedicated Phantom wallet
  const connectPhantom = async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window environment unavailable.');
      }

      const w = window as any;
      let provider = w.phantom?.solana;
      if (!provider && w.solana?.isPhantom) {
        provider = w.solana;
      }

      if (!provider) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`;
          setIsConnecting(false);
          return null;
        }
        throw new Error('Phantom wallet extension is not detected in this browser.');
      }

      const resp = await provider.connect();
      const pubKey = resp?.publicKey?.toString() || provider.publicKey?.toString();
      if (pubKey) {
        setSolanaAddress(pubKey);
        setActiveWalletName('Phantom');
        localStorage.setItem('zcross_connected_sol', pubKey);
        localStorage.setItem('zcross_connected_wallet_name', 'Phantom');
        setIsConnecting(false);
        return pubKey;
      }

      throw new Error('Failed to retrieve authorized public key from Phantom.');
    } catch (err: any) {
      const msg = err.message || 'Failed to connect Phantom wallet';
      console.warn('[Wallet] Phantom error:', msg);
      setError(msg);
      setIsConnecting(false);
      return null;
    }
  };

  // Connect any available Solana provider
  const connectSolana = async (preferredType: 'solflare' | 'phantom' | 'any' = 'any'): Promise<string | null> => {
    if (preferredType === 'solflare') {
      return connectSolflare();
    }
    if (preferredType === 'phantom') {
      return connectPhantom();
    }

    // If preferred is any, prefer Solflare if detected, then Phantom, then generic
    const w = window as any;
    if (w.solflare) {
      return connectSolflare();
    }
    if (w.phantom?.solana || w.solana?.isPhantom) {
      return connectPhantom();
    }
    if (w.solana) {
      setIsConnecting(true);
      setError(null);
      try {
        await w.solana.connect();
        const pubKey = w.solana.publicKey?.toString();
        if (pubKey) {
          setSolanaAddress(pubKey);
          setActiveWalletName('Solana Wallet');
          localStorage.setItem('zcross_connected_sol', pubKey);
          localStorage.setItem('zcross_connected_wallet_name', 'Solana Wallet');
          setIsConnecting(false);
          return pubKey;
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect generic Solana wallet');
      }
      setIsConnecting(false);
      return null;
    }

    // Neither detected
    return connectSolflare();
  };

  // Connect EVM wallet (MetaMask / EIP-6963 provider)
  const connectEVM = async (preferredProvider?: any): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Window environment unavailable.');
      }

      const w = window as any;
      let provider = preferredProvider;

      if (typeof preferredProvider === 'string') {
        const id = preferredProvider.toLowerCase();
        const eth = w.ethereum;
        const providers: any[] = eth?.providers || (eth ? [eth] : []);

        if (id === 'rabby') {
          provider = providers.find((p) => p.isRabby) || (eth?.isRabby ? eth : null);
        } else if (id === 'zerion') {
          provider = w.zerionWallet || providers.find((p) => p.isZerion) || (eth?.isZerion ? eth : null);
        } else if (id === 'coinbase') {
          provider = w.coinbaseWalletExtension || providers.find((p) => p.isCoinbaseWallet) || (eth?.isCoinbaseWallet ? eth : null);
        } else if (id === 'trust') {
          provider = w.trustwallet || providers.find((p) => p.isTrust) || (eth?.isTrust ? eth : null);
        } else if (id === 'rainbow') {
          provider = providers.find((p) => p.isRainbow) || (eth?.isRainbow ? eth : null);
        } else if (id === 'okx') {
          provider = w.okxwallet || providers.find((p) => p.isOkxWallet) || (eth?.isOkxWallet ? eth : null);
        } else if (id === 'ctrl') {
          provider = w.xfi?.ethereum || providers.find((p) => p.isXDEFI) || (eth?.isXDEFI ? eth : null);
        } else if (id === 'metamask') {
          provider = providers.find((p) => p.isMetaMask && !p.isRabby) || (eth?.isMetaMask ? eth : null);
        }
        if (!provider) {
          provider = eth;
        }
      } else if (!provider) {
        if (w.ethereum?.providers?.length) {
          provider = w.ethereum.providers.find((p: any) => p.isMetaMask) || w.ethereum.providers[0];
        } else if (w.ethereum) {
          provider = w.ethereum;
        }
      }

      if (!provider) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
          setIsConnecting(false);
          return null;
        }
        throw new Error('No EVM wallet extension (MetaMask, Rabby, Coinbase) detected in this browser.');
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setEvmAddress(address);
        const name = provider.isRabby ? 'Rabby' : provider.isCoinbaseWallet ? 'Coinbase Wallet' : 'MetaMask';
        setActiveWalletName(name);
        localStorage.setItem('zcross_connected_evm', address);
        localStorage.setItem('zcross_connected_wallet_name', name);
        setIsConnecting(false);
        return address;
      }

      throw new Error('No EVM accounts authorized.');
    } catch (err: any) {
      const msg = err.message || 'Failed to connect EVM wallet';
      console.warn('[Wallet] EVM connection error:', msg);
      setError(msg);
      setIsConnecting(false);
      return null;
    }
  };

  // Connect custom validated address directly
  const connectCustomAddress = (chain: string, address: string): boolean => {
    const c = chain.toLowerCase();
    const clean = address.trim();

    if (c === 'arb' || c === 'eth' || c === 'base') {
      if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
        setEvmAddress(clean);
        setActiveWalletName('Custom EVM');
        localStorage.setItem('zcross_connected_evm', clean);
        return true;
      }
    } else if (c === 'sol') {
      if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
        setSolanaAddress(clean);
        setActiveWalletName('Custom Solana');
        localStorage.setItem('zcross_connected_sol', clean);
        return true;
      }
    }
    return false;
  };

  const disconnectEVM = () => {
    setEvmAddress(null);
    localStorage.removeItem('zcross_connected_evm');
  };

  const disconnectSolana = () => {
    setSolanaAddress(null);
    localStorage.removeItem('zcross_connected_sol');
  };

  const disconnectAll = () => {
    disconnectEVM();
    disconnectSolana();
    setActiveWalletName(null);
    localStorage.removeItem('zcross_connected_wallet_name');
  };

  const clearError = () => {
    setError(null);
  };

  const getActiveAddressForChain = (chain: string): string | null => {
    const c = chain.toLowerCase();
    if (c === 'arb' || c === 'eth' || c === 'base') {
      return evmAddress;
    }
    if (c === 'sol') {
      return solanaAddress;
    }
    return null;
  };

  return (
    <WalletContext.Provider
      value={{
        evmAddress,
        solanaAddress,
        activeWalletName,
        isConnecting,
        error,
        detectedWallets,
        isEvmAvailable: detectedWallets.evmAny,
        isSolanaAvailable: detectedWallets.solanaAny,
        eip6963Providers,
        connectSolflare,
        connectPhantom,
        connectSolana,
        connectEVM,
        connectCustomAddress,
        disconnectEVM,
        disconnectSolana,
        disconnectAll,
        clearError,
        refreshWallets: checkDetected,
        getActiveAddressForChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
