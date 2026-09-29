import { NextRequest } from 'next/server';
import { swapStore } from '@/core/solver/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const swapId = params.id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      req.signal.addEventListener('abort', () => {
        isClosed = true;
        controller.close();
      });

      let lastStatus = '';

      const interval = setInterval(() => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }

        const swap = swapStore.getSwap(swapId);
        if (!swap) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: 'Swap not found' })}\n\n`));
          clearInterval(interval);
          controller.close();
          return;
        }

        if (swap.status !== lastStatus) {
          lastStatus = swap.status;
          const events = swapStore.getEvents(swapId);
          const payload = JSON.stringify({ swap, events });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        }

        if (swap.status === 'SETTLED' || swap.status === 'REFUNDED' || swap.status === 'EXPIRED') {
          clearInterval(interval);
          controller.close();
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
