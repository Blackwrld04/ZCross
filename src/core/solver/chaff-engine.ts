/**
 * Chaff Engine & Anti-Timing Jitter Protection
 * Defends cross-chain swaps against correlation attacks and timing analysis.
 */
import crypto from 'node:crypto';

export interface ChaffDecoyNote {
  decoyAmountZec: number;
  decoyRecipient: string;
  decoyCommitment: string;
  memoDummy: string;
}

/**
 * Calculates randomized execution jitter delay in seconds
 */
export function calculateJitterDelay(enabled: boolean, minSeconds = 15, maxSeconds = 120): number {
  if (!enabled) return 0;
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

/**
 * Generates dummy/chaff decoy note splits to mask real transaction amounts in Orchard pool
 */
export function generateChaffDecoySplits(
  originAmountZec: number,
  shieldedRecipient: string,
  decoyCount = 2
): ChaffDecoyNote[] {
  const decoys: ChaffDecoyNote[] = [];
  const baseDecoy = Number((originAmountZec * 0.05).toFixed(4));
  
  for (let i = 0; i < decoyCount; i++) {
    const randomSalt = crypto.randomBytes(8).toString('hex');
    decoys.push({
      decoyAmountZec: Math.max(0.0001, Number((baseDecoy + (i * 0.001)).toFixed(4))),
      decoyRecipient: shieldedRecipient,
      decoyCommitment: `cm_decoy_${randomSalt}`,
      memoDummy: `chaff_padding_${crypto.randomBytes(32).toString('hex')}`
    });
  }
  return decoys;
}
