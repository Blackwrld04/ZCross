import { NextResponse } from 'next/server';
import { swapStore } from '@/core/solver/store';
import { zcashNodeClient } from '@/core/zcash/client';
import { nearIntentsClient } from '@/core/near-intents/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  // 1. Check Database
  let dbStatus = 'healthy';
  let totalSwaps = 0;
  let activeSwaps = 0;
  try {
    const db = (swapStore as any).db;
    const countRow = db.prepare('SELECT COUNT(*) as count FROM swaps').get();
    totalSwaps = countRow?.count || 0;

    const activeRow = db.prepare("SELECT COUNT(*) as count FROM swaps WHERE status NOT IN ('SETTLED', 'REFUNDED', 'EXPIRED')").get();
    activeSwaps = activeRow?.count || 0;
  } catch (err: any) {
    dbStatus = `unhealthy: ${err.message}`;
  }

  // 2. Check Zcash Consensus Client
  const zcashStatus = await zcashNodeClient.getNodeStatus();

  // 3. Check NEAR Intents Service
  let nearIntentsStatus = 'operational';
  let nearLatencyMs = 0;
  try {
    const startPing = Date.now();
    await nearIntentsClient.getPopularDestinations();
    nearLatencyMs = Date.now() - startPing;
  } catch (err: any) {
    nearIntentsStatus = `degraded: ${err.message}`;
  }

  // 4. Memory and System Metrics
  const mem = process.memoryUsage();

  const isAllHealthy = dbStatus === 'healthy' && zcashStatus.connected;

  return NextResponse.json(
    {
      status: isAllHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      version: '1.0.0',
      database: {
        status: dbStatus,
        engine: 'better-sqlite3 (WAL mode)',
        totalSwaps,
        activeSwaps,
      },
      zcash: zcashStatus,
      liquidityNetwork: {
        status: nearIntentsStatus,
        provider: 'NEAR Intents (1Click Defuse Protocol)',
        latencyMs: nearLatencyMs,
      },
      security: {
        rateLimiterActive: true,
        idempotencyProtection: true,
        zeroTransparentHopsEnforced: true,
        memoPaddingBytes: 512,
      },
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        rssMb: Math.round(mem.rss / 1024 / 1024),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      },
    },
    {
      status: isAllHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
