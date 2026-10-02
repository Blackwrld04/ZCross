/**
 * NEAR Intents 1Click API Client
 * Connects directly to https://1click.chaindefuser.com/
 * Spec reference: https://docs.near-intents.org/
 */

import { 
  NearIntentsToken, 
  QuoteRequestPayload, 
  QuoteResponsePayload,
  SignedDataPayload,
  UserAuthResponse,
  UserBalancesResponse
} from './types';

const BASE_URL = 'https://1click.chaindefuser.com';

import { secretsManager } from '../security/secrets';

let tokensCache: NearIntentsToken[] | null = null;
let tokensCacheExpiry = 0;

export class NearIntentsClient {
  /**
   * Helper to construct authenticated headers
   */
  private getHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
    const apiKey = secretsManager.getSecret('NEAR_INTENTS_API_KEY') || secretsManager.getSecret('NEAR_INTENTS_JWT');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...additionalHeaders,
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    return headers;
  }

  /**
   * Fetches all live supported assets from 1Click OpenAPI endpoint (/v0/tokens)
   */
  async getTokens(ondoTokens?: boolean): Promise<NearIntentsToken[]> {
    const now = Date.now();
    if (tokensCache && tokensCacheExpiry > now) {
      return tokensCache;
    }

    try {
      const url = new URL(`${BASE_URL}/v0/tokens`);
      if (ondoTokens) {
        url.searchParams.set('ondoTokens', 'true');
      }

      const res = await fetch(url.toString(), {
        headers: this.getHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`1Click tokens API returned HTTP ${res.status}`);
      }

      const data: NearIntentsToken[] = await res.json();
      tokensCache = data;
      tokensCacheExpiry = now + 60_000;
      return data;
    } catch (err: any) {
      console.error('[NEAR Intents Client] Failed to fetch live tokens:', err.message);
      if (tokensCache) return tokensCache;
      return this.getFallbackPopularTokens();
    }
  }

  /**
   * Requests a live guaranteed swap quote from NEAR Intents solvers (/v0/quote)
   */
  async requestQuote(payload: QuoteRequestPayload): Promise<QuoteResponsePayload> {
    // Ensure deadline is always set (required by 1Click API)
    const normalizedPayload: QuoteRequestPayload = {
      ...payload,
      deadline: payload.deadline || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    const res = await fetch(`${BASE_URL}/v0/quote`, {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(normalizedPayload),
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
   * Exchange signed MultiPayload for a User-Session token (Confidential Intents)
   * Reference: POST /v0/auth/authenticate
   */
  async authenticateUser(signedData: SignedDataPayload): Promise<UserAuthResponse> {
    const res = await fetch(`${BASE_URL}/v0/auth/authenticate`, {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ signedData }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Authentication failed');
    }

    return data as UserAuthResponse;
  }

  /**
   * Refresh a User-Session access token
   * Reference: POST /v0/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    const res = await fetch(`${BASE_URL}/v0/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Token refresh failed');
    }

    return data;
  }

  /**
   * Get private/confidential balances for an authenticated user
   * Reference: GET /v0/account/balances
   */
  async getUserBalances(accessToken: string): Promise<UserBalancesResponse> {
    const res = await fetch(`${BASE_URL}/v0/account/balances`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Failed to fetch user balances');
    }

    return data as UserBalancesResponse;
  }

  /**
   * Curated popular destination tokens verified against live /v0/tokens
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
        icon: 'usdc',
      },
      {
        chain: 'sol',
        chainName: 'Solana',
        symbol: 'SOL',
        assetId: 'nep141:sol.omft.near',
        decimals: 9,
        icon: 'sol',
      },
      {
        chain: 'btc',
        chainName: 'Bitcoin Native',
        symbol: 'BTC',
        assetId: 'nep141:btc.omft.near',
        decimals: 8,
        icon: 'btc',
      },
      {
        chain: 'eth',
        chainName: 'Ethereum Mainnet',
        symbol: 'USDC',
        assetId: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
        decimals: 6,
        icon: 'usdc',
      },
      {
        chain: 'base',
        chainName: 'Base',
        symbol: 'USDC',
        assetId: 'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near',
        decimals: 6,
        icon: 'usdc',
      }
    ];
  }

  /**
   * Safe fallback populated with verified asset IDs from live API
   */
  private getFallbackPopularTokens(): NearIntentsToken[] {
    return [
      {
        assetId: '1cs_v1:near:nep141:zec.omft.near',
        decimals: 8,
        blockchain: 'near',
        symbol: 'ZEC',
        price: 1415.41,
        priceUpdatedAt: new Date().toISOString(),
        contractAddress: 'zec.omft.near',
        coingeckoId: 'zcash',
      },
      {
        assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
        decimals: 6,
        blockchain: 'arb',
        symbol: 'USDC',
        price: 1.0,
        priceUpdatedAt: new Date().toISOString(),
        contractAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        coingeckoId: 'usd-coin',
      },
      {
        assetId: 'nep141:sol.omft.near',
        decimals: 9,
        blockchain: 'sol',
        symbol: 'SOL',
        price: 119.5,
        priceUpdatedAt: new Date().toISOString(),
        coingeckoId: 'solana',
      },
      {
        assetId: 'nep141:btc.omft.near',
        decimals: 8,
        blockchain: 'btc',
        symbol: 'BTC',
        price: 83731.0,
        priceUpdatedAt: new Date().toISOString(),
        coingeckoId: 'bitcoin',
      }
    ];
  }
}

export const nearIntentsClient = new NearIntentsClient();
