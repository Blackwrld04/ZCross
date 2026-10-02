import { NextRequest, NextResponse } from 'next/server';
import { ZEC_BASE_PRICE_USD, setLiveZecPrice } from '@/core/onramp/types';

export const dynamic = 'force-dynamic';

interface CachedPriceData {
  timestamp: number;
  data: any;
}

// In-memory cache to prevent CoinGecko rate limiting (TTL: 25s for spot, 60s for chart)
const priceCache = new Map<string, CachedPriceData>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const symbol = (searchParams.get('symbol') || 'USDC').toUpperCase();
    const timeframe = (searchParams.get('timeframe') || '24H').toUpperCase();
    const now = Date.now();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    };

    // 1. SPOT TICKER QUERY (Used by PriceProvider to feed the entire site)
    if (type === 'spot') {
      const spotCacheKey = 'spot_rates_coingecko';
      const cached = priceCache.get(spotCacheKey);

      if (cached && now - cached.timestamp < 10000) {
        return NextResponse.json({
          ...cached.data,
          cached: true,
        });
      }

      try {
        const spotUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=zcash,solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';
        const res = await fetch(spotUrl, { 
          headers, 
          cache: 'no-store',
          next: { revalidate: 0 },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.zcash?.usd) {
            setLiveZecPrice(data.zcash.usd);
            const payload = {
              success: true,
              source: 'coingecko',
              prices: data,
              updatedAt: new Date().toISOString(),
            };
            priceCache.set(spotCacheKey, { timestamp: now, data: payload });
            return NextResponse.json(payload);
          }
        }
      } catch (err: any) {
        console.warn('CoinGecko spot ticker fetch error:', err.message);
      }

      // Fallback spot data if CoinGecko is unreachable
      const fallbackPayload = {
        success: true,
        source: 'fallback',
        prices: {
          zcash: { usd: 1378.52, usd_24h_change: -4.35, usd_24h_vol: 863861404 },
          solana: { usd: 117.41, usd_24h_change: -1.55, usd_24h_vol: 3395024572 },
          bitcoin: { usd: 84140, usd_24h_change: 0.05, usd_24h_vol: 31336987861 },
          ethereum: { usd: 2683.48, usd_24h_change: 0.05, usd_24h_vol: 13314810098 },
        },
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(fallbackPayload);
    }

    // 2. CHART TIME-SERIES QUERY (Used by MarketPriceChart)
    const cacheKey = `${symbol}_${timeframe}`;
    const cached = priceCache.get(cacheKey);

    if (cached && now - cached.timestamp < 60000) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    let vsCurrency = 'usd';
    if (symbol === 'BTC') vsCurrency = 'btc';
    else if (symbol === 'ETH') vsCurrency = 'eth';

    let days = '1';
    if (timeframe === '7D') days = '7';
    else if (timeframe === '1M') days = '30';
    else if (timeframe === '1Y') days = '365';

    let coingeckoUrl = `https://api.coingecko.com/api/v3/coins/zcash/market_chart?vs_currency=${vsCurrency}&days=${days}`;

    let points: { timestamp: number; label: string; price: number; volume: number }[] = [];
    let high = 0;
    let low = Infinity;
    let volume24h = 0;
    let source = 'coingecko';

    try {
      const res = await fetch(coingeckoUrl, { 
        headers,
        cache: 'no-store',
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        throw new Error(`CoinGecko responded with status ${res.status}`);
      }

      const data = await res.json();
      const rawPrices: [number, number][] = data.prices || [];
      const rawVolumes: [number, number][] = data.total_volumes || [];

      if (rawPrices.length === 0) {
        throw new Error('CoinGecko returned empty price array');
      }

      let solPriceUsd = 117.41;
      if (symbol === 'SOL') {
        try {
          const solRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', { 
            headers,
            cache: 'no-store',
            next: { revalidate: 0 },
          });
          if (solRes.ok) {
            const solData = await solRes.json();
            if (solData.solana?.usd) {
              solPriceUsd = solData.solana.usd;
            }
          }
        } catch {
          // fallback
        }
      }

      let sampleTarget = 24;
      if (timeframe === '1H') sampleTarget = 20;
      else if (timeframe === '24H') sampleTarget = 24;
      else if (timeframe === '7D') sampleTarget = 28;
      else if (timeframe === '1M') sampleTarget = 30;
      else if (timeframe === '1Y') sampleTarget = 52;

      const step = Math.max(1, Math.floor(rawPrices.length / sampleTarget));
      const slicedPrices = rawPrices.filter((_, idx) => idx % step === 0);

      points = slicedPrices.map(([ts, rawPrice], i) => {
        let finalPrice = rawPrice;
        if (symbol === 'SOL') {
          finalPrice = rawPrice / solPriceUsd;
        }

        if (finalPrice > high) high = finalPrice;
        if (finalPrice < low) low = finalPrice;

        const volumeMatch = rawVolumes[i * step] ? rawVolumes[i * step][1] : 0;
        volume24h += volumeMatch;

        const date = new Date(ts);
        let label = '';
        if (timeframe === '1H' || timeframe === '24H') {
          label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === '7D' || timeframe === '1M') {
          label = `${date.getMonth() + 1}/${date.getDate()}`;
        } else {
          label = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
        }

        return {
          timestamp: ts,
          label,
          price: parseFloat(finalPrice.toFixed(symbol === 'BTC' ? 6 : symbol === 'ETH' ? 4 : 2)),
          volume: volumeMatch,
        };
      });

      // Synchronize the latest candle point with live spot ticker to ensure 100% agreement with swap cards
      if (points.length > 0 && ZEC_BASE_PRICE_USD > 0) {
        let latestSpot = ZEC_BASE_PRICE_USD;
        if (symbol === 'SOL') latestSpot = ZEC_BASE_PRICE_USD / solPriceUsd;
        else if (symbol === 'BTC') latestSpot = ZEC_BASE_PRICE_USD / 84140.0;
        else if (symbol === 'ETH') latestSpot = ZEC_BASE_PRICE_USD / 2683.48;

        const syncPrice = parseFloat(latestSpot.toFixed(symbol === 'BTC' ? 6 : symbol === 'ETH' ? 4 : 2));
        points[points.length - 1].price = syncPrice;
        if (syncPrice > high) high = syncPrice;
        if (syncPrice < low) low = syncPrice;
      }

    } catch (apiError: any) {
      console.warn('CoinGecko chart fetch failed, using fallback curve:', apiError.message);
      source = 'fallback';

      let baseRate = ZEC_BASE_PRICE_USD;
      if (symbol === 'SOL') baseRate = ZEC_BASE_PRICE_USD / 117.41;
      else if (symbol === 'BTC') baseRate = ZEC_BASE_PRICE_USD / 84140.0;
      else if (symbol === 'ETH') baseRate = ZEC_BASE_PRICE_USD / 2683.48;

      const numPoints = timeframe === '1H' ? 20 : timeframe === '24H' ? 24 : timeframe === '7D' ? 28 : 30;
      const intervalMs = timeframe === '1H' ? 3 * 60 * 1000 : 3600 * 1000;

      let current = baseRate * 0.98;
      for (let i = 0; i < numPoints; i++) {
        const ts = now - (numPoints - 1 - i) * intervalMs;
        const trend = Math.sin((i / numPoints) * Math.PI * 2) * 0.015;
        const noise = ((ts % 100) / 100 - 0.5) * 0.01;
        current = i === numPoints - 1 ? baseRate : current * (1 + trend + noise);

        if (current > high) high = current;
        if (current < low) low = current;

        const date = new Date(ts);
        const label = timeframe === '1H' || timeframe === '24H' 
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `${date.getMonth() + 1}/${date.getDate()}`;

        points.push({
          timestamp: ts,
          label,
          price: parseFloat(current.toFixed(symbol === 'BTC' ? 6 : symbol === 'ETH' ? 4 : 2)),
          volume: baseRate * 120,
        });
      }
      volume24h = baseRate * 5000;
    }

    if (low === Infinity) low = points[0]?.price || 0;
    const firstPrice = points[0]?.price || 1;
    const lastPrice = points[points.length - 1]?.price || firstPrice;
    const changePercent = parseFloat((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2));

    const responsePayload = {
      success: true,
      source,
      symbol,
      timeframe,
      currentPrice: lastPrice,
      high,
      low,
      volume24h: Math.round(volume24h),
      changePercent,
      points,
      updatedAt: new Date().toISOString(),
    };

    priceCache.set(cacheKey, {
      timestamp: now,
      data: responsePayload,
    });

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch price chart data' },
      { status: 500 }
    );
  }
}
