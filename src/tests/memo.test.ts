import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeIntentMemo, deserializeIntentMemo, MEMO_MAX_BYTES } from '../core/crypto/memo';

test('Memo Serializer: exactly 512 bytes uniform padding to eliminate length side-channels', () => {
  const payload = {
    swapId: 'test-swap-123',
    destinationChain: 'arb',
    destinationToken: 'USDC',
    recipientAddress: '0x71c8364426bb8f3f0fba8c91b860475e88e3ef8a',
    slippageBps: 100,
    nonce: 'a1b2c3d4',
    timestamp: 1727610000000,
  };

  const { buffer, hex, base64 } = serializeIntentMemo(payload);

  assert.equal(buffer.length, MEMO_MAX_BYTES, 'Padded memo must be exactly 512 bytes');
  assert.equal(Buffer.from(hex, 'hex').length, MEMO_MAX_BYTES);
  assert.equal(Buffer.from(base64, 'base64').length, MEMO_MAX_BYTES);
});

test('Memo Round-Trip: deserializes accurately from 512-byte padded buffer', () => {
  const original = {
    swapId: 'swap-999-orchard',
    destinationChain: 'sol',
    destinationToken: 'SOL',
    recipientAddress: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    slippageBps: 50,
    refundAddress: 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0',
    nonce: 'ffeeddcc',
    timestamp: 1727615000000,
  };

  const { buffer } = serializeIntentMemo(original);
  const deserialized = deserializeIntentMemo(buffer);

  assert.equal(deserialized.swapId, original.swapId.slice(0, 16));
  assert.equal(deserialized.destinationChain, original.destinationChain);
  assert.equal(deserialized.destinationToken, original.destinationToken);
  assert.equal(deserialized.recipientAddress, original.recipientAddress);
  assert.equal(deserialized.slippageBps, 50);
  assert.equal(deserialized.refundAddress, original.refundAddress);
  assert.equal(deserialized.protocol, 'z-intent');
  assert.equal(deserialized.version, 1);
});
