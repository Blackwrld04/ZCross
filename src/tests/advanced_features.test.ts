import test from 'node:test';
import assert from 'node:assert';
import { zcashNodeClient } from '../core/zcash/node-client';
import { EmbeddedOrchardWalletService } from '../core/zcash/embedded-wallet';
import { AlertService } from '../core/notifications/alert-service';
import { solverEngine } from '../core/solver/engine';

test('Advanced System 1: Live Zcash Node Client & Nullifier Unspent Checks', async () => {
  // Test block height
  const height = await zcashNodeClient.getLatestBlockHeight();
  assert.ok(typeof height === 'number');
  assert.ok(height > 2600000);

  // Test node status & connectivity
  const status = await zcashNodeClient.getNodeStatus();
  assert.strictEqual(status.connected, true);
  assert.strictEqual(status.activePool, 'Orchard (Halo 2)');
  assert.ok(status.latestBlockHeight > 2600000);

  // Test compact block scanning
  const compactBlocks = await zcashNodeClient.scanCompactBlocks(height - 5, height);
  assert.ok(Array.isArray(compactBlocks));
  assert.ok(compactBlocks.length >= 1);
  assert.strictEqual(compactBlocks[compactBlocks.length - 1].height, height);

  // Test nullifier verification (initially unspent)
  const nullifier = '0x_test_nullifier_halo2_orchard_99a8b7';
  const unspentCheck = await zcashNodeClient.verifyNullifierUnspent(nullifier);
  assert.strictEqual(unspentCheck.nullifier, nullifier);
  assert.strictEqual(unspentCheck.isSpent, false);

  // Record nullifier as spent and verify double-spend protection flags it
  zcashNodeClient.recordSpentNullifier(nullifier);
  const spentCheck = await zcashNodeClient.verifyNullifierUnspent(nullifier);
  assert.strictEqual(spentCheck.isSpent, true);
});

test('Advanced System 2: Watch-Only Full Viewing Key (FVK) Mode', async () => {
  const fvk = 'uview1q8h4gq6w2v...test_fvk_zcash_orchard';
  const account = await EmbeddedOrchardWalletService.importWatchOnlyFvk(fvk, 'mainnet');

  assert.ok(account.address.startsWith('u1q'));
  assert.strictEqual(account.fvk, fvk);
  assert.strictEqual(account.isWatchOnly, true);
  assert.strictEqual(account.watchOnlyType, 'fvk');
  assert.ok(account.shieldedBalanceZec > 0);

  // Stored public account must reflect watch-only status
  const stored = EmbeddedOrchardWalletService.getStoredPublicAccount();
  assert.strictEqual(stored?.isWatchOnly, true);

  // Attempting 1-click in-browser spending from a watch-only account must be strictly blocked
  await assert.rejects(
    async () => {
      await EmbeddedOrchardWalletService.executeShieldedSwapPayment({
        originAmountZec: 0.5,
        destinationChain: 'arb',
        destinationAsset: 'nep141:arb-0xaf88.omft.near',
        destinationTokenSymbol: 'USDC',
        recipientAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        depositAddress: account.address,
      });
    },
    /Watch-Only Account: Spending keys are not held in this browser/
  );
});

test('Advanced System 3: Real-Time Browser Push & Telegram Alert Service', async () => {
  // Test Telegram recipient configuration
  AlertService.setTelegramRecipient('@test_shielded_trader');
  const recipient = AlertService.getTelegramRecipient();
  assert.strictEqual(recipient, '@test_shielded_trader');

  // Clear Telegram recipient
  AlertService.setTelegramRecipient('');
  assert.strictEqual(AlertService.getTelegramRecipient(), '');

  // Set recipient again for dispatch test
  AlertService.setTelegramRecipient('test_trader');
  assert.strictEqual(AlertService.getTelegramRecipient(), 'test_trader');

  // Verify notification support detection
  const isSupported = AlertService.isNotificationSupported();
  assert.strictEqual(typeof isSupported, 'boolean');

  // Test alert payload formatting
  const alertResult = await AlertService.notifySettlement({
    swapId: 'swap_alert_test_123',
    originAmountZec: '1.25',
    destAmountEst: '1723.15',
    destChain: 'arb',
    destToken: 'USDC',
    recipientAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    destTxHash: '0xabc123...',
  });

  assert.strictEqual(typeof alertResult.browserNotified, 'boolean');
});

test('Advanced System 4: Solver Jitter & Anti-Timing Chaff Shielding Engine', async () => {
  const result = await solverEngine.createIntent({
    originAmountZec: '2.5',
    destinationChain: 'sol',
    destinationAsset: 'nep141:sol.omft.near',
    destinationTokenSymbol: 'SOL',
    recipientAddress: '7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs',
    chaffEnabled: true,
    jitterDelaySeconds: 65,
  });

  assert.strictEqual(result.swap.origin_amount, '2.5');
  assert.strictEqual(result.swap.chaff_enabled, true);
  assert.strictEqual(result.swap.jitter_delay_seconds, 65);
  assert.strictEqual(result.swap.decoy_splits_count, 2);

  // Process shielded deposit and verify anti-timing chaff event logging
  const confirmed = await solverEngine.processShieldedDeposit(result.swap.id);
  assert.strictEqual(confirmed.status, 'CONFIRMED_SHIELDED');

  const events = solverEngine.getSwapEvents(result.swap.id);
  const chaffEvent = events.find((e) => e.event_type === 'CHAFF_SHIELDING_ENGAGED');
  assert.ok(chaffEvent, 'Chaff shielding engagement event must be recorded in the audit log');
  assert.match(chaffEvent.message, /65s settlement jitter window/);
});
