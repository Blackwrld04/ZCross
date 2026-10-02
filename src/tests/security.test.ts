import test from 'node:test';
import assert from 'node:assert';
import { evaluateRateLimit } from '../core/security/rate-limit';
import { 
  getIdempotencyKey, 
  saveIdempotentResponse, 
  getCachedIdempotentResponse 
} from '../core/security/idempotency';
import { secretsManager } from '../core/security/secrets';
import { NextRequest } from 'next/server';

test('Security: Rate limiter enforces sliding-window limits and rejects burst floods', () => {
  const testIp = `192.168.1.${Math.floor(Math.random() * 1000)}`;
  const options = {
    limit: 5,
    windowMs: 10_000,
    prefix: 'test_limit',
  };

  // First 5 requests must succeed
  for (let i = 1; i <= 5; i++) {
    const res = evaluateRateLimit(testIp, options);
    assert.strictEqual(res.allowed, true, `Request ${i} should be allowed`);
    assert.strictEqual(res.remaining, 5 - i);
    assert.strictEqual(res.limit, 5);
  }

  // 6th request must be rejected (HTTP 429 condition)
  const blockedRes = evaluateRateLimit(testIp, options);
  assert.strictEqual(blockedRes.allowed, false, '6th request must be rate limited');
  assert.strictEqual(blockedRes.remaining, 0);
  assert.ok(blockedRes.resetMs > 0, 'Reset timestamp must be positive');
});

test('Security: Idempotency module caches responses and prevents duplicate submissions', () => {
  const idempotencyKey = 'req_idempotent_test_99887766';
  const samplePayload = {
    swapId: 'swap_test_123',
    status: 'CREATED',
    originAmount: '2.5',
  };

  // Initially, no response is cached
  assert.strictEqual(getCachedIdempotentResponse(idempotencyKey), null);

  // Store response
  saveIdempotentResponse(idempotencyKey, 200, samplePayload);

  // Retrieve cached response
  const cached = getCachedIdempotentResponse(idempotencyKey);
  assert.ok(cached !== null, 'Cached response must exist');
  assert.strictEqual(cached?.statusCode, 200);
  assert.deepStrictEqual(cached?.body, samplePayload);
});

test('Security: Idempotency key validator accepts valid tokens and rejects malformed/injection keys', () => {
  // Valid key
  const validReq = new NextRequest('http://localhost:3000/api/quote', {
    headers: { 'idempotency-key': 'valid_key_12345678' }
  });
  assert.strictEqual(getIdempotencyKey(validReq), 'valid_key_12345678');

  // Key too short (< 8 chars)
  const shortReq = new NextRequest('http://localhost:3000/api/quote', {
    headers: { 'idempotency-key': 'short' }
  });
  assert.strictEqual(getIdempotencyKey(shortReq), null);

  // Key with invalid characters / potential injection attempt
  const malformedReq = new NextRequest('http://localhost:3000/api/quote', {
    headers: { 'idempotency-key': 'bad; DROP TABLE swaps; --' }
  });
  assert.strictEqual(getIdempotencyKey(malformedReq), null);
});

test('Security: Secrets manager masks sensitive keys and validates token structure', () => {
  const jwtSample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozGz4n1e9S8s';
  const masked = secretsManager.maskSecret(jwtSample);

  // Must not expose full token in plaintext
  assert.ok(!masked.includes('eyJzdWIiOiIxMjM0NTY3ODkwIn0'));
  assert.ok(masked.startsWith('eyJh...'));
  assert.ok(masked.endsWith('e9S8s') || masked.endsWith('...e9S8s') || masked.length <= 15);

  // Masking empty or undefined
  assert.strictEqual(secretsManager.maskSecret(undefined), '[NOT CONFIGURED]');
  assert.strictEqual(secretsManager.maskSecret(''), '[NOT CONFIGURED]');

  // Structure validation
  assert.strictEqual(secretsManager.validateSecretFormat('NEAR_INTENTS_JWT', jwtSample), true);
  assert.strictEqual(secretsManager.validateSecretFormat('NEAR_INTENTS_JWT', 'invalid'), false);
});
