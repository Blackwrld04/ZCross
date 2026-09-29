import test from 'node:test';
import assert from 'node:assert/strict';
import { solverEngine } from '../core/solver/engine';
import { swapStore } from '../core/solver/store';

test('Solver Engine Full Lifecycle: Create -> Deposit -> Settle -> Audit Receipt', async () => {
  // 1. Create intent
  const { swap, memoBase64, zip321Uri } = await solverEngine.createIntent({
    originAmountZec: '1.0',
    destinationChain: 'arb',
    destinationAsset: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
    destinationTokenSymbol: 'USDC',
    recipientAddress: '0x71c8364426bb8f3f0fba8c91b860475e88e3ef8a',
    slippageBps: 100,
    network: 'mainnet',
  });

  assert.equal(swap.status, 'CREATED');
  assert.ok(swap.id);
  assert.ok(memoBase64);
  assert.ok(zip321Uri.startsWith('zcash:u1'));
  assert.ok(parseFloat(swap.dest_amount_est) > 0);

  // 2. Process shielded deposit simulation
  const deposited = await solverEngine.processShieldedDeposit(swap.id);
  assert.equal(deposited.status, 'CONFIRMED_SHIELDED');
  assert.ok(deposited.zcash_tx_hash);

  // 3. Fulfill settlement
  const { swap: settled, receipt } = await solverEngine.fulfillSwap(swap.id);
  assert.equal(settled.status, 'SETTLED');
  assert.ok(settled.dest_tx_hash?.startsWith('0x'));

  // 4. Verify Zero-Leak Cryptographic Audit Receipt
  assert.equal(receipt.swapId, swap.id);
  assert.equal(receipt.origin.pool, 'Orchard (Halo 2)');
  assert.equal(receipt.privacyVerification.zeroTransparentHops, true);
  assert.equal(receipt.privacyVerification.memoEncryption, 'ChaCha20-Poly1305 (512-byte padded)');
  assert.equal(receipt.privacyVerification.unlinkableSenderGraph, true);
  assert.ok(receipt.intentHash);
  assert.ok(receipt.destination.transactionHash);

  // 5. Verify database events log
  const events = swapStore.getEvents(swap.id);
  assert.ok(events.length >= 4);
});
