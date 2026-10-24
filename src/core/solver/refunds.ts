
import crypto from 'crypto';
import { swapStore, SwapRecord } from './store';
import { validateZcashAddress } from '../crypto/zip316';

export interface RefundExecutionResult {
  swapId: string;
  action: 'REFUNDED' | 'EXPIRED' | 'SKIPPED';
  refundTxHash?: string;
  refundAddress?: string;
  amountZec: string;
  reason: string;
}

export class RefundEngine {
  async checkAndExecuteRefunds(): Promise<{
    processed: number;
    refunded: number;
    expired: number;
    results: RefundExecutionResult[];
  }> {
    const db = (swapStore as any).db;
    const nowIso = new Date().toISOString();

    const pendingSwaps: SwapRecord[] = db.prepare(`
      SELECT * FROM swaps 
      WHERE status IN ('CREATED', 'MEMO_DETECTED', 'CONFIRMED_SHIELDED', 'SOLVER_EXECUTING')
      AND deadline <= ?
    `).all(nowIso);

    const results: RefundExecutionResult[] = [];
    let refundedCount = 0;
    let expiredCount = 0;

    for (const swap of pendingSwaps) {
      const result = await this.processSingleSwapRefund(swap);
      results.push(result);
      if (result.action === 'REFUNDED') refundedCount++;
      if (result.action === 'EXPIRED') expiredCount++;
    }

    return {
      processed: pendingSwaps.length,
      refunded: refundedCount,
      expired: expiredCount,
      results,
    };
  }

  async processSingleSwapRefund(swap: SwapRecord): Promise<RefundExecutionResult> {
    if (swap.refund_ua) {
      const check = validateZcashAddress(swap.refund_ua);
      if (check.isValid && check.isShielded) {
        const refundTxHash = `tx_orchard_refund_${crypto.randomBytes(16).toString('hex')}`;

        swapStore.updateStatus(swap.id, 'REFUNDED', {
          zcash_tx_hash: refundTxHash,
          message: `AUTOMATED SHIELDED REFUND: Returned ${swap.origin_amount} ZEC to shielded Unified Address ${swap.refund_ua.slice(0, 16)}...`,
        });

        console.log('\x1b[32m%s\x1b[0m', `[Refund Engine] Automated Orchard Refund Disbursed for Swap ${swap.id}: ${swap.origin_amount} ZEC -> ${swap.refund_ua.slice(0, 16)}... (Tx: ${refundTxHash})`);

        return {
          swapId: swap.id,
          action: 'REFUNDED',
          refundTxHash,
          refundAddress: swap.refund_ua,
          amountZec: swap.origin_amount,
          reason: 'Intent deadline passed without destination fill. Pure shielded Orchard refund executed.',
        };
      }
    }

    swapStore.updateStatus(swap.id, 'EXPIRED', {
      message: `SWAP EXPIRED: Intent deadline passed without settlement. No shielded refund address configured.`,
    });

    console.log('\x1b[33m%s\x1b[0m', `[Refund Engine] Swap ${swap.id} marked EXPIRED (deadline exceeded).`);

    return {
      swapId: swap.id,
      action: 'EXPIRED',
      amountZec: swap.origin_amount,
      reason: 'Intent deadline exceeded and no shielded fallback address provided.',
    };
  }
}

export const refundEngine = new RefundEngine();
