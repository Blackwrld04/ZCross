import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  deriveOrchardKeys, 
  encryptWithPassword, 
  decryptWithPassword,
  EmbeddedOrchardWalletService
} from '../core/zcash/embedded-wallet';
import { generateMnemonic } from '../core/zcash/bip39';

describe('Option 1: In-Browser Embedded Zcash Orchard Wallet Engine', () => {
  test('BIP-39 Mnemonic Generator generates valid 12-word seed', () => {
    const mnemonic = generateMnemonic();
    const words = mnemonic.trim().split(/\s+/);
    assert.strictEqual(words.length, 12, 'Mnemonic must contain exactly 12 words');
  });

  test('Deterministic Orchard key & ZIP-316 Unified Address derivation', async () => {
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const keys = await deriveOrchardKeys(testMnemonic, 'mainnet');
    
    assert.ok(keys.address.startsWith('u1'), 'Address must start with u1 (ZIP 316 pure Orchard HRP)');
    assert.ok(keys.fvk.startsWith('uview1'), 'FVK must start with uview1');
    assert.ok(keys.ivk.startsWith('uivk1'), 'IVK must start with uivk1');
    assert.strictEqual(typeof keys.spendingKeyHex, 'string');
    assert.strictEqual(keys.spendingKeyHex.length, 64, 'Spending key hex must be 32 bytes (64 hex characters)');
  });

  test('Client-side AES-256-GCM + PBKDF2 encryption and decryption', async () => {
    const secretMnemonic = generateMnemonic();
    const password = 'SuperSecretUserPassword123!';

    const encrypted = await encryptWithPassword(secretMnemonic, password);
    assert.ok(encrypted.ciphertextHex.length > 0);
    assert.ok(encrypted.ivHex.length === 24); // 12 bytes IV
    assert.ok(encrypted.saltHex.length === 32); // 16 bytes salt

    const decrypted = await decryptWithPassword(
      encrypted.ciphertextHex,
      encrypted.ivHex,
      encrypted.saltHex,
      password
    );

    assert.strictEqual(decrypted, secretMnemonic, 'Decrypted text must match original mnemonic');
  });

  test('Wallet Service initialization and 1-click payment execution', async () => {
    // Create new wallet
    const { mnemonic, account } = await EmbeddedOrchardWalletService.createNewWallet('session-pwd', 'mainnet');
    assert.ok(account.address.startsWith('u1'));
    assert.strictEqual(account.shieldedBalanceZec, 5.0);

    // Fund wallet
    const newBal = EmbeddedOrchardWalletService.fundBalance(2.5);
    assert.strictEqual(newBal, 7.5);

    // Execute 1-click swap payment
    const payment = await EmbeddedOrchardWalletService.executeShieldedSwapPayment({
      originAmountZec: 1.0,
      destinationChain: 'sol',
      destinationAsset: 'nep141:sol.omft.near',
      destinationTokenSymbol: 'SOL',
      recipientAddress: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
      depositAddress: 'u1q4k70w5x8r8m2qpv7y9j2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z0x1c2v3b4n5m6q7w8e9r0t1y2u3i4o5p6a7s8d9f0g1h2j3k4l5z6x7c8v9b0n1m2',
      swapId: 'test-swap-1234',
    });

    assert.ok(payment.txid.startsWith('tx_orchard_'));
    assert.ok(payment.newBalanceZec < 7.5);
    assert.ok(payment.auditReceiptHash.startsWith('rcpt_'));

    const history = EmbeddedOrchardWalletService.getHistory();
    assert.ok(history.length >= 1);
    assert.strictEqual(history[0].type, 'SWAP_OUT');
  });
});
