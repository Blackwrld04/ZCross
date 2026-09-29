import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeZip321Uri, parseZip321Uri } from '../core/crypto/zip321';

test('ZIP 321 Encoder: formats standard URI with amount and memo', () => {
  const address = 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';
  const uri = encodeZip321Uri({
    recipientAddress: address,
    amountZec: '1.5',
    memoBase64: 'eyJ2IjoxfQ==',
    message: 'Cross-chain swap',
  });

  assert.ok(uri.startsWith(`zcash:${address}?amount=1.5`));
  assert.ok(uri.includes('memo='));
  assert.ok(uri.includes('message=Cross-chain%20swap'));
});

test('ZIP 321 Round-Trip: parses URI accurately', () => {
  const address = 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';
  const uri = encodeZip321Uri({
    recipientAddress: address,
    amountZec: 2.75,
    memoBase64: 'VGhpcyBpcyBhIHRlc3QgbWVtbw==',
  });

  const parsed = parseZip321Uri(uri);
  assert.equal(parsed.recipientAddress, address);
  assert.equal(parsed.amountZec, 2.75);
  assert.ok(parsed.memoBase64);
});
