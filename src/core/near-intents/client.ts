/**
 * NEAR Intents 1Click API Client
 * Connects directly to https://1click.chaindefuser.com/
 */

import { NearIntentsToken, QuoteRequestPayload, QuoteResponsePayload } from './types';

const BASE_URL = 'https://1click.chaindefuser.com';

// Cache supported tokens for 60 seconds to optimize latency
let tokensCache: NearIntentsToken[] | null = null;
let tokensCacheExpiry = 0;

export class NearIntentsClient {
  /**
   * Fetches all live supported assets across all 30+ chains
   */
  async getTokens(): Promise<NearIntentsToken[]> {
    const now = Date.now();
    if (tokensCache && tokensCacheExpiry > now) {
      return tokensCache;
    }

    try {
      const res = await fetch(`${BASE_URL}/v0/tokens`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 } // Next.js ISR revalidation
      });

      if (!res.ok) {
        throw new Error(`1Click tokens API returned HTTP ${res.status}`);
      }

      const data: NearIntentsToken[] = await res.json();
      tokensCache = data;
      tokensCacheExpiry = now + 60_000;
      return data;
    } catch (err: any) {
      console.error('[NEAR Intents Client] Failed to fetch tokens:', err.message);
      if (tokensCache) return tokensCache; // Return stale cache if available
      return this.getFallbackPopularTokens();
    }
  }

  /**
   * Requests a live guaranteed swap quote from NEAR Intents solvers
   */
  async requestQuote(payload: QuoteRequestPayload): Promise<QuoteResponsePayload> {
    const res = await fetch(`${BASE_URL}/v0/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Invalid JSON response from 1Click API: ${responseText.slice(0, 100)}`);
    }

    if (!res.ok) {
      const errMsg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(`Quote error from NEAR Intents: ${errMsg}`);
    }

    return data as QuoteResponsePayload;
  }

  /**
   * Curated popular destination tokens for high-volume cross-chain corridors
   */
  async getPopularDestinations(): Promise<{
    chain: string;
    chainName: string;
    symbol: string;
    assetId: string;
    decimals: number;
    icon: string;
  }[]> {
    return [
      {
        chain: 'arb',
        chainName: 'Arbitrum One',
        symbol: 'USDC',
        assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
        decimals: 6,
        icon: '💵',
      },
      {
        chain: 'sol',
        chainName: 'Solana',
        symbol: 'SOL',
        assetId: '1cs_v1:sol:native:sol',
        decimals: 9,
        icon: '🟣',
      },
      {
        chain: 'btc',
        chainName: 'Bitcoin Native',
        symbol: 'BTC',
        assetId: '1cs_v1:btc:native:coin',
        decimals: 8,
        icon: '₿',
      },
      {
        chain: 'eth',
        chainName: 'Ethereum Mainnet',
        symbol: 'USDC',
        assetId: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
        decimals: 6,
        icon: '💎',
      },
      {
        chain: 'base',
        chainName: 'Base',
        symbol: 'USDC',
        assetId: 'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near',
        decimals: 6,
        icon: '🔵',
      }
    ];
  }

  /**
   * Safe fallback in case upstream RPC is unreachable offline
   */
  private getFallbackPopularTokens(): NearIntentsToken[] {
    return [
      {
        assetId: '1cs_v1:near:nep141:zec.omft.near',
        decimals: 8,
        blockchain: 'near',
        symbol: 'ZEC',
        price: 1420.0,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
        decimals: 6,
        blockchain: 'arb',
        symbol: 'USDC',
        price: 1.0,
        priceUpdatedAt: new Date().toISOString(),
      }
    ];
  }
}

export const nearIntentsClient = new NearIntentsClient();
