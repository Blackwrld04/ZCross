import test from 'node:test';
import assert from 'node:assert';
import { refundEngine } from '../core/solver/refunds';
import { swapStore } from '../core/solver/store';
import { zcashNodeClient } from '../core/zcash/client';
import crypto from 'crypto';

test('Production: Refund engine marks expired swap with shielded refund address as REFUNDED', async () => {
  const expiredSwapId = crypto.randomUUID();
  const validShieldedRefund = 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';
  
  // Create a swap with an already-passed deadline (10 minutes ago)
  const pastDeadline = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  
  const swap = swapStore.createSwap({
    id: expiredSwapId,
    intent_hash: `hash_${crypto.randomBytes(16).toString('hex')}`,
    status: 'CREATED',
    origin_asset: 'ZEC',
    origin_amount: '3.5',
    deposit_ua: 'u1vault...',
    dest_chain: 'arb',
    dest_token: 'USDC',
    dest_recipient: '0x71c8364426bb8f3f0fba8c91b860475e88e3ef8a',
    dest_amount_est: '4970.00',
    dest_amount_min: '4920.00',
    refund_ua: validShieldedRefund,
    deadline: pastDeadline,
    memo_base64: 'memo_base64',
    zip321_uri: 'zcash:u1...',
  });

  const outcome = await refundEngine.processSingleSwapRefund(swap);
  assert.strictEqual(outcome.action, 'REFUNDED');
  assert.ok(outcome.refundTxHash?.startsWith('tx_orchard_refund_'));
  assert.strictEqual(outcome.amountZec, '3.5');

  // Verify in database
  const updatedInDb = swapStore.getSwap(expiredSwapId);
  assert.strictEqual(updatedInDb?.status, 'REFUNDED');
  assert.strictEqual(updatedInDb?.zcash_tx_hash, outcome.refundTxHash);
});

test('Production: Refund engine marks expired swap without refund address as EXPIRED', async () => {
  const expiredSwapId = crypto.randomUUID();
  const pastDeadline = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  
  const swap = swapStore.createSwap({
    id: expiredSwapId,
    intent_hash: `hash_${crypto.randomBytes(16).toString('hex')}`,
    status: 'CREATED',
    origin_asset: 'ZEC',
    origin_amount: '1.0',
    deposit_ua: 'u1vault...',
    dest_chain: 'sol',
    dest_token: 'SOL',
    dest_recipient: 'SolRecipient1234567890123456789012',
    dest_amount_est: '11.8',
    dest_amount_min: '11.6',
    deadline: pastDeadline,
    memo_base64: 'memo_base64',
    zip321_uri: 'zcash:u1...',
  });

  const outcome = await refundEngine.processSingleSwapRefund(swap);
  assert.strictEqual(outcome.action, 'EXPIRED');

  // Verify in database
  const updatedInDb = swapStore.getSwap(expiredSwapId);
  assert.strictEqual(updatedInDb?.status, 'EXPIRED');
});

test('Production: Zcash node client returns blockchain height and node health', async () => {
  const height = await zcashNodeClient.getLatestBlockHeight();
  assert.ok(typeof height === 'number');
  assert.ok(height > 2600000);

  const status = await zcashNodeClient.getNodeStatus();
  assert.strictEqual(status.connected, true);
  assert.strictEqual(status.activePool, 'Orchard (Halo 2)');
  assert.strictEqual(status.network, 'mainnet');

  const noteVerification = await zcashNodeClient.verifyOrchardNoteCommitment('cm_test_123');
  assert.strictEqual(noteVerification.verified, true);
  assert.strictEqual(noteVerification.confirmations, 1);
});
