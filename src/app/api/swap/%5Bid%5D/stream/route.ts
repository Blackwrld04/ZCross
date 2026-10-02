import { NextRequest } from 'next/server';
import { swapStore } from '@/core/solver/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const swapId = params.id;
  if (!swapId || !/^[a-zA-Z0-9_-]{8,64}$/.test(swapId)) {
    return new Response(JSON.stringify({ error: 'Invalid swap ID format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const startTime = Date.now();
  const MAX_STREAM_DURATION_MS = 15 * 60 * 1000; // 15-minute maximum lifetime to prevent socket exhaustion

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const cleanup = () => {
        if (!isClosed) {
          isClosed = true;
          clearInterval(interval);
          try {
            controller.close();
          } catch {
            // Controller might already be closed
          }
        }
      };

      req.signal.addEventListener('abort', cleanup);

      let lastStatus = '';

      const interval = setInterval(() => {
        // Enforce maximum stream duration
        if (Date.now() - startTime > MAX_STREAM_DURATION_MS) {
          cleanup();
          return;
        }

        if (isClosed) {
          clearInterval(interval);
          return;
        }

        const swap = swapStore.getSwap(swapId);
        if (!swap) {
          try {
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: 'Swap not found' })}\n\n`));
          } catch {}
          cleanup();
          return;
        }

        if (swap.status !== lastStatus) {
          lastStatus = swap.status;
          const events = swapStore.getEvents(swapId);
          const payload = JSON.stringify({ swap, events });
          try {
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          } catch {
            cleanup();
            return;
          }
        }

        if (swap.status === 'SETTLED' || swap.status === 'REFUNDED' || swap.status === 'EXPIRED') {
          cleanup();
        }
      }, 1000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
