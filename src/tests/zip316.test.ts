import test from 'node:test';
import assert from 'node:assert/strict';
import { validateZcashAddress } from '../core/crypto/zip316';

test('ZIP 316 Validator: recognizes Unified Addresses as pure shielded', () => {
  const ua = 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';
  const result = validateZcashAddress(ua, 'mainnet');

  assert.equal(result.isValid, true);
  assert.equal(result.isShielded, true);
  assert.equal(result.type, 'unified');
});

test('ZIP 316 Validator: flags transparent addresses as disqualifying for zero-leak flows', () => {
  const tAddr = 't1VpYecBW4UudbG3VoYHnmxXMStEJBDEBxj';
  const result = validateZcashAddress(tAddr, 'mainnet');

  assert.equal(result.isShielded, false);
  assert.equal(result.type, 'transparent');
  assert.ok(result.error?.includes('CRITICAL WARNING'));
});
