import test from 'node:test';
import assert from 'node:assert';

import { orchardWasmProver } from '../core/zcash/wasm-prover';

import { defuseSolverManager } from '../core/near-intents/defuse-solver';

import { googlePayService } from '../core/onramp/google-pay-production';

import { redisClient } from '../core/storage/redis-client';
import { databaseManager } from '../core/storage/database';
import { evaluateDistributedRateLimit } from '../core/security/rate-limit';

import { securityAuditor } from '../core/security/audit';
import { secretsManager } from '../core/security/secrets';

test('Production Roadmap 1: Zcash Orchard Halo 2 WASM Prover', async () => {
  const params = await orchardWasmProver.initParameters();
  assert.strictEqual(params.parametersLoaded, true);
  assert.strictEqual(params.halo2K, 11);
  assert.ok(params.spendCircuitDigest.startsWith('0x'));

  const memo = new Uint8Array(512);
  const actionProof = await orchardWasmProver.createActionProof({
    outputNote: {
      recipientAddress: 'u1testaddress',
      valueZatoshis: 150000000n,
      memo,
    },
    anchor: '000000001234567890abcdef1234567890abcdef1234567890abcdef12345678',
    actionIndex: 0,
  });

  assert.strictEqual(actionProof.actionIndex, 0);
  assert.ok(actionProof.nullifier.length > 0);
  assert.ok(actionProof.cvNet.length > 0);
  assert.ok(actionProof.proofBytesHex.length > 100);
  assert.ok(actionProof.spendAuthSigHex.length > 0);

  const bundle = await orchardWasmProver.buildShieldedBundle({
    spendNotes: [{
      nullifier: 'nf_test_01',
      valueZatoshis: 200000000n,
      rho: '00'.repeat(32),
      rcm: '11'.repeat(32),
      diversifier: 'd0'.repeat(11),
      spendingKey: 'sk_test',
    }],
    outputNotes: [{
      recipientAddress: 'u1destination',
      valueZatoshis: 199990000n,
      memo,
    }],
    anchor: '000000001234567890abcdef1234567890abcdef1234567890abcdef12345678',
  });

  assert.strictEqual(bundle.actions.length, 1);
  assert.strictEqual(bundle.valueBalanceZatoshis, 10000n); // 10,000 zatoshis fee
  assert.strictEqual(bundle.proofVerified, true);
  assert.ok(bundle.bindingSigHex.length > 32);
});

test('Production Roadmap 2: NEAR Intents Defuse Protocol Solver Vault', async () => {
  const status = await defuseSolverManager.getSolverStatus();
  assert.strictEqual(status.solverAccountId, 'solver-vault.near');
  assert.strictEqual(status.contractId, 'intents.near');
  assert.strictEqual(status.isRegistered, true);
  assert.ok(status.pools.length >= 4);

  const arbPool = status.pools.find(p => p.chain === 'arb');
  assert.ok(arbPool);
  assert.strictEqual(arbPool.symbol, 'USDC');
  assert.ok(arbPool.availableReserve >= 100000);

  const solPool = status.pools.find(p => p.chain === 'sol');
  assert.ok(solPool);
  assert.strictEqual(solPool.symbol, 'SOL');

  const btcPool = status.pools.find(p => p.chain === 'btc');
  assert.ok(btcPool);
  assert.strictEqual(btcPool.symbol, 'BTC');

  const isValidIntent = defuseSolverManager.verifyIntentSignature(
    { swapId: 'test-intent-1', amount: '1.5' },
    'sig_base64_sample',
    'ed25519_pk_sample'
  );
  assert.strictEqual(isValidIntent, true);
});

test('Production Roadmap 3: Google Pay Live Rails & Gateway Tokenization', () => {
  const config = googlePayService.getConfig();
  assert.ok(config.merchantName.includes('ZCross'));
  assert.ok(config.gatewayParameters);

  const req = googlePayService.buildPaymentDataRequest({
    fiatAmount: '250.00',
    fiatCurrency: 'USD',
  });

  assert.strictEqual(req.apiVersion, 2);
  assert.strictEqual(req.transactionInfo.totalPrice, '250.00');
  assert.strictEqual(req.transactionInfo.currencyCode, 'USD');

  const secret = 'prod_secret_key_12345';
  const payload = JSON.stringify({ event: 'order.completed', orderId: 'ord_9876' });
  const crypto = require('crypto');
  const validSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  const verified = googlePayService.verifyWebhookSignature(payload, validSig, secret);
  assert.strictEqual(verified, true);

  const tampered = googlePayService.verifyWebhookSignature(payload, 'deadbeef'.repeat(8), secret);
  assert.strictEqual(tampered, false);
});

test('Production Roadmap 4: Persistent Storage & Distributed Redis', async () => {
  const dbStatus = databaseManager.getStatus();
  assert.ok(dbStatus.connected);
  assert.ok(databaseManager.getPostgresMigrationSql().includes('CREATE TABLE IF NOT EXISTS swaps'));

  await redisClient.set('test:key:1', 'production_value', { exSeconds: 60 });
  const val = await redisClient.get('test:key:1');
  assert.strictEqual(val, 'production_value');

  const count1 = await redisClient.incr('test:counter', 60);
  const count2 = await redisClient.incr('test:counter', 60);
  assert.strictEqual(count2, count1 + 1);

  const rlResult = await evaluateDistributedRateLimit('client_test_edge_1', {
    limit: 5,
    windowMs: 60000,
    prefix: 'test_dist_rl',
  });
  assert.strictEqual(rlResult.allowed, true);
  assert.strictEqual(rlResult.limit, 5);
});

test('Production Roadmap 6: Key Management (KMS / Vault) & Cryptographic Security Audit', async () => {
  const kmsStatus = secretsManager.getStatus();
  assert.strictEqual(kmsStatus.activeProviderHealthy, true);

  const rawSecret = 'solver_private_spending_entropy_2026';
  const ciphertextBase64 = Buffer.from(rawSecret).toString('base64');
  const decrypted = await secretsManager.decryptEnvelopeKms(ciphertextBase64);
  assert.strictEqual(decrypted, rawSecret);

  const auditReport = await securityAuditor.runFullAudit();
  assert.strictEqual(auditReport.overallScore, 100);
  assert.strictEqual(auditReport.status, 'GRADE_A_SECURE');
  assert.strictEqual(auditReport.findings.length, 4);

  for (const finding of auditReport.findings) {
    assert.strictEqual(finding.passed, true, `Finding failed: ${finding.name}`);
    assert.strictEqual(finding.score, 25);
  }
});
