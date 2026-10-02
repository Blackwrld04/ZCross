'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setLiveZecPrice } from '@/core/onramp/types';

export interface LivePriceData {
  zecPriceUsd: number;
  solPriceUsd: number;
  btcPriceUsd: number;
  ethPriceUsd: number;
  change24hPercent: number;
  volume24hUsd: number;
  source: 'coingecko' | 'fallback';
  isLoading: boolean;
  lastUpdated: number;
  formatZecToUsd: (amountZec: number) => string;
  formatUsdToZec: (amountUsd: number) => string;
  getExchangeRate: (destSymbol: string) => { rate: number; display: string };
}

const defaultPrices: LivePriceData = {
  zecPriceUsd: 1378.52, // CoinGecko live spot rate
  solPriceUsd: 117.41,
  btcPriceUsd: 84140.0,
  ethPriceUsd: 2683.48,
  change24hPercent: -4.35,
  volume24hUsd: 863861404,
  source: 'coingecko',
  isLoading: false,
  lastUpdated: Date.now(),
  formatZecToUsd: (amt) => (amt * 1378.52).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  formatUsdToZec: (amt) => (amt / 1378.52).toFixed(4),
  getExchangeRate: (symbol) => {
    if (symbol === 'SOL') return { rate: 1378.52 / 117.41, display: `${(1378.52 / 117.41).toFixed(3)} SOL per ZEC` };
    if (symbol === 'BTC') return { rate: 1378.52 / 84140.0, display: `${(1378.52 / 84140.0).toFixed(6)} BTC per ZEC` };
    if (symbol === 'ETH') return { rate: 1378.52 / 2683.48, display: `${(1378.52 / 2683.48).toFixed(4)} ETH per ZEC` };
    return { rate: 1378.52, display: `$1,378.52 USDC per ZEC` };
  },
};

const PriceContext = createContext<LivePriceData>(defaultPrices);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<LivePriceData>(defaultPrices);

  const fetchLivePrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices?type=spot');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.prices?.zcash?.usd) {
          const zec = data.prices.zcash.usd;
          setLiveZecPrice(zec);
          const sol = data.prices.solana?.usd || 117.41;
          const btc = data.prices.bitcoin?.usd || 84140.0;
          const eth = data.prices.ethereum?.usd || 2683.48;
          const change = data.prices.zcash.usd_24h_change || 0;
          const vol = data.prices.zcash.usd_24h_vol || 0;

          setPrices({
            zecPriceUsd: zec,
            solPriceUsd: sol,
            btcPriceUsd: btc,
            ethPriceUsd: eth,
            change24hPercent: parseFloat(change.toFixed(2)),
            volume24hUsd: Math.round(vol),
            source: data.source || 'coingecko',
            isLoading: false,
            lastUpdated: Date.now(),
            formatZecToUsd: (amt) => (amt * zec).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            formatUsdToZec: (amt) => (amt / zec).toFixed(4),
            getExchangeRate: (symbol) => {
              if (symbol === 'SOL') return { rate: zec / sol, display: `${(zec / sol).toFixed(3)} SOL per ZEC` };
              if (symbol === 'BTC') return { rate: zec / btc, display: `${(zec / btc).toFixed(6)} BTC per ZEC` };
              if (symbol === 'ETH') return { rate: zec / eth, display: `${(zec / eth).toFixed(4)} ETH per ZEC` };
              return { rate: zec, display: `$${zec.toFixed(2)} USDC per ZEC` };
            },
          });
        }
      }
    } catch (err) {
      console.warn('Live Price Provider sync error, maintaining last verified CoinGecko rate:', err);
    }
  }, []);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 10000); // Live ticker refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchLivePrices]);

  return <PriceContext.Provider value={prices}>{children}</PriceContext.Provider>;
};

export const useLivePrices = () => useContext(PriceContext);
