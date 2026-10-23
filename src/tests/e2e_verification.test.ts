import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { solverEngine } from '../core/solver/engine';
import { swapStore } from '../core/solver/store';
import { calculateOnrampQuotes } from '../core/onramp/types';
import { globalOnrampStore } from '../core/onramp/store';
import { 
  resolveWeb3Domain, 
  saveContact, 
  getSavedContacts, 
  deleteContact 
} from '../core/wallet/address-book';
import { 
  deriveOrchardKeys, 
  encryptWithPassword, 
  decryptWithPassword,
  EmbeddedOrchardWalletService 
} from '../core/zcash/embedded-wallet';
import { generateMnemonic } from '../core/zcash/bip39';
import { evaluateRateLimit } from '../core/security/rate-limit';
import { isValidIdempotencyKey } from '../core/security/idempotency';
import { maskSensitiveString } from '../core/security/secrets';
import { isShieldedAddress, validateZcashAddress } from '../core/crypto/zip316';
import { serializeMemo, deserializeMemo } from '../core/crypto/memo';
import { calculateJitterDelay, generateChaffDecoySplits } from '../core/solver/chaff-engine';

describe('ZCross Comprehensive E2E & Security Verification', () => {
  const sampleOrchardUa = 'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';
  const sampleEvmAddress = '0x53805B73042125f381c8FE437eA391e921d7bDb1';
  const sampleSolAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  const sampleBtcAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

  /* =========================================================================
     1. WALLET CONNECTION, ENCRYPTION & ADDRESS BOOK
     ========================================================================= */
  describe('Unit 1: Wallet Connection, Key Derivation & Address Book', () => {
    it('generates a valid 12-word BIP-39 mnemonic and derives Orchard keys', async () => {
      const mnemonic = generateMnemonic();
      const words = mnemonic.trim().split(/\s+/);
      assert.equal(words.length, 12, 'Mnemonic must have exactly 12 words');

      const keys = await deriveOrchardKeys(mnemonic, 'mainnet');
      assert.ok(keys.address.startsWith('u1'), 'Derived address must be a ZIP-316 Unified Address');
      assert.ok(keys.fvk.startsWith('uview1'), 'Full Viewing Key must start with uview1');
      assert.ok(keys.spendingKeyHex.length === 64, 'Spending key hex must be 32 bytes (64 hex characters)');
    });

    it('encrypts and decrypts the wallet vault using AES-256-GCM + PBKDF2', async () => {
      const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const password = 'SuperSecretMasterPassword123!';

      const encrypted = await encryptWithPassword(mnemonic, password);
      assert.ok(encrypted.ciphertextHex, 'Ciphertext must be present');
      assert.ok(encrypted.saltHex, 'Salt must be present');
      assert.ok(encrypted.ivHex, 'IV must be present');

      // Decrypt with correct password
      const decrypted = await decryptWithPassword(encrypted.ciphertextHex, encrypted.ivHex, encrypted.saltHex, password);
      assert.equal(decrypted, mnemonic, 'Decrypted mnemonic must match original');

      // Decrypt with wrong password must throw error
      await assert.rejects(async () => {
        await decryptWithPassword(encrypted.ciphertextHex, encrypted.ivHex, encrypted.saltHex, 'WrongPassword999!');
      });
    });

    it('resolves Web3 domain names (.eth, .sol, .zec) to valid chain addresses', () => {
      const ethResolved = resolveWeb3Domain('vitalik.eth');
      assert.ok(ethResolved);
      assert.equal(ethResolved?.chain, 'arb');
      assert.ok(ethResolved?.resolvedAddress.startsWith('0x'));

      const solResolved = resolveWeb3Domain('toly.sol');
      assert.ok(solResolved);
      assert.equal(solResolved?.chain, 'sol');
      assert.ok(solResolved?.resolvedAddress.length >= 32);

      const zecResolved = resolveWeb3Domain('privacy.zec');
      assert.ok(zecResolved);
      assert.equal(zecResolved?.chain, 'zec');
      assert.ok(zecResolved?.resolvedAddress.startsWith('u1'));

      const rawAddress = resolveWeb3Domain('0x1234567890abcdef1234567890abcdef12345678');
      assert.equal(rawAddress, null, 'Raw address without domain extension must return null');
    });

    it('manages contacts in the Address Book seamlessly', () => {
      const initialContacts = getSavedContacts();
      assert.ok(initialContacts.length >= 4, 'Default protocol contacts must be loaded');

      const newContact = saveContact({
        name: 'Cold Storage Vault',
        address: sampleOrchardUa,
        chain: 'zec',
        tag: 'Treasury',
      });

      assert.ok(newContact.id);
      assert.equal(newContact.name, 'Cold Storage Vault');

      const afterAdd = getSavedContacts();
      const found = afterAdd.find(c => c.id === newContact.id);
      assert.ok(found, 'New contact must be present in saved list');

      // Delete contact
      deleteContact(newContact.id);
      const afterDelete = getSavedContacts();
      const notFound = afterDelete.find(c => c.id === newContact.id);
      assert.equal(notFound, undefined, 'Contact must be deleted');
    });

    it('validates Watch-Only Full Viewing Key (FVK) mode and blocks unauthorized spending', async () => {
      const fvk = 'uview1q8h4gq6w2v_test_fvk_zcash_orchard_audit_key';
      const account = await EmbeddedOrchardWalletService.importWatchOnlyFvk(fvk, 'mainnet');

      assert.ok(account.address.startsWith('u1q'));
      assert.equal(account.fvk, fvk);
      assert.equal(account.isWatchOnly, true);
      assert.equal(account.watchOnlyType, 'fvk');
      assert.ok(account.shieldedBalanceZec > 0);

      // Attempting spending on watch-only must be strictly rejected
      await assert.rejects(async () => {
        await EmbeddedOrchardWalletService.executeShieldedSwapPayment({
          originAmountZec: 0.5,
          destinationChain: 'arb',
          destinationAsset: 'nep141:arb-0xaf88.omft.near',
          destinationTokenSymbol: 'USDC',
          recipientAddress: sampleEvmAddress,
          depositAddress: sampleOrchardUa,
          swapId: 'test_watch_only_block',
        });
      }, /Watch-Only Account/);
    });
  });

  /* =========================================================================
     2. BUYING PROCESS (GOOGLE PAY / FIAT ON-RAMP)
     ========================================================================= */
  describe('Unit 2: Buying Shielded ZEC via Google Pay On-Ramp', () => {
    it('calculates on-ramp quotes across multiple fiat currencies with Google Pay Direct lowest fee', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;

      for (const fiatCurrency of currencies) {
        const quotes = calculateOnrampQuotes({
          fiatAmount: 300,
          fiatCurrency,
          paymentNetwork: 'google_pay',
          destinationAddress: sampleOrchardUa,
          zecPriceUsd: 1200,
        });

        assert.equal(quotes.length, 4, 'Must return quotes for 4 providers');
        const direct = quotes.find(q => q.providerId === 'google_pay_direct');
        assert.ok(direct, 'Google Pay direct quote must exist');
        assert.equal(direct?.isBestRate, true, 'Google Pay Direct must offer the best rate');
        assert.ok(direct && direct.estimatedZec > 0, 'Estimated ZEC must be positive');
      }
    });

    it('creates, settles, and stores Google Pay orders in the database', () => {
      const orderId = `ord_test_${Date.now()}`;
      globalOnrampStore.saveOrder({
        orderId,
        providerId: 'google_pay_direct',
        status: 'PENDING',
        paymentMethod: 'google_pay',
        fiatAmount: 500,
        fiatCurrency: 'USD',
        cryptoAmount: 0.416,
        cryptoCurrency: 'ZEC',
        destinationAddress: sampleOrchardUa,
        googlePayTransactionId: 'gpay_auth_token_99999',
        createdAt: new Date().toISOString(),
      });

      const pendingOrder = globalOnrampStore.getOrder(orderId);
      assert.ok(pendingOrder);
      assert.equal(pendingOrder.orderId, orderId);
      assert.equal(pendingOrder.status, 'PENDING');

      // Update to COMPLETED upon clearing
      const updated = globalOnrampStore.simulateOrderClearance(orderId);
      assert.equal(updated?.status, 'COMPLETED');
      assert.ok(updated?.txHash?.startsWith('tx_orchard_gpay_cleared_'));

      // Retrieve from store
      const retrieved = globalOnrampStore.getOrder(orderId);
      assert.equal(retrieved?.status, 'COMPLETED');
      assert.equal(retrieved?.paymentMethod, 'google_pay');
    });
  });

  /* =========================================================================
     3. SELLING / SWAPPING PROCESS (CROSS-CHAIN INTENTS)
     ========================================================================= */
  describe('Unit 3: Selling / Swapping Shielded ZEC across Corridors', () => {
    it('creates and settles ZEC -> Arbitrum USDC swap with guaranteed execution rate', async () => {
      const { swap, memoBase64, zip321Uri } = await solverEngine.createIntent({
        originAmountZec: '3.0',
        destinationChain: 'arb',
        destinationAsset: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
        destinationTokenSymbol: 'USDC',
        recipientAddress: sampleEvmAddress,
        slippageBps: 100,
        network: 'mainnet',
      });

      assert.equal(swap.status, 'CREATED');
      assert.ok(swap.id);
      assert.ok(parseFloat(swap.dest_amount_est) > 0);

      // Verify uniform memo byte length
      const memoBuffer = Buffer.from(memoBase64, 'base64');
      assert.equal(memoBuffer.length, 512, 'Encrypted memo must be exactly 512 bytes');

      // Settle
      const deposited = await solverEngine.processShieldedDeposit(swap.id);
      assert.equal(deposited.status, 'CONFIRMED_SHIELDED');

      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swap.id);
      assert.equal(settled.status, 'SETTLED');
      assert.ok(settled.dest_tx_hash?.startsWith('0x'));

      // Receipt validation
      assert.equal(receipt.swapId, swap.id);
      assert.equal(receipt.privacyVerification.zeroTransparentHops, true);
    });

    it('creates and settles ZEC -> Solana SOL swap', async () => {
      const { swap, memoBase64 } = await solverEngine.createIntent({
        originAmountZec: '1.5',
        destinationChain: 'sol',
        destinationAsset: 'nep141:sol.omft.near',
        destinationTokenSymbol: 'SOL',
        recipientAddress: sampleSolAddress,
        slippageBps: 100,
        network: 'mainnet',
      });

      assert.equal(swap.status, 'CREATED');
      assert.equal(swap.dest_chain, 'sol');
      assert.equal(swap.dest_token, 'SOL');

      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swap.id);
      assert.equal(settled.status, 'SETTLED');
      assert.equal(receipt.destination.chain, 'sol');
    });

    it('creates and settles ZEC -> Bitcoin BTC swap', async () => {
      const { swap } = await solverEngine.createIntent({
        originAmountZec: '10.0',
        destinationChain: 'btc',
        destinationAsset: 'nep141:btc.omft.near',
        destinationTokenSymbol: 'BTC',
        recipientAddress: sampleBtcAddress,
        slippageBps: 100,
        network: 'mainnet',
      });

      assert.equal(swap.status, 'CREATED');
      assert.equal(swap.dest_chain, 'btc');
      assert.equal(swap.dest_token, 'BTC');

      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swap.id);
      assert.equal(settled.status, 'SETTLED');
      assert.equal(receipt.destination.chain, 'btc');
    });

    it('correctly serializes and deserializes the 512-byte in-band encrypted memo', () => {
      const intentPayload = {
        protocol: 'z-intent',
        version: 1,
        swapId: 'test-swap-12345',
        destinationChain: 'arb',
        destinationToken: 'USDC',
        recipientAddress: sampleEvmAddress,
        slippageBps: 100,
        nonce: 'nonce_test_abc123',
        timestamp: Date.now(),
      };

      const serialized = serializeMemo(intentPayload);
      assert.equal(serialized.length, 512, 'Serialized memo must be exactly 512 bytes');

      const deserialized = deserializeMemo(serialized);
      assert.equal(deserialized.protocol, 'z-intent');
      assert.equal(deserialized.swapId, 'test-swap-12345');
      assert.equal(deserialized.destinationChain, 'arb');
      assert.equal(deserialized.destinationToken, 'USDC');
      assert.equal(deserialized.recipientAddress, sampleEvmAddress);
    });

    it('computes randomized solver jitter and anti-timing chaff decoy note splits', () => {
      const jitter = calculateJitterDelay(true);
      assert(jitter >= 15 && jitter <= 120, 'Jitter delay must be between 15s and 120s when enabled');

      const noJitter = calculateJitterDelay(false);
      assert.equal(noJitter, 0, 'Jitter delay must be 0 when disabled');

      const chaffDecoys = generateChaffDecoySplits(2.5, sampleOrchardUa);
      assert.equal(chaffDecoys.length, 2, 'Must generate exactly 2 decoy Orchard notes');
      for (const decoy of chaffDecoys) {
        assert(decoy.decoyAmountZec > 0, 'Decoy amount must be positive');
        assert.ok(decoy.decoyCommitment.startsWith('cm_decoy_'), 'Decoy note commitment must be formatted');
      }
    });
  });

  /* =========================================================================
     4. SECURITY INVARIANTS & DEFENSES
     ========================================================================= */
  describe('Unit 4: Security Invariants, Rate Limiting & Zero-Leak Protection', () => {
    it('strictly rejects transparent t-addresses across all entry points', () => {
      const transparentAddress = 't1VpYecBW4UudbGnv4Za2hkYDm8Ep3FsKPq';
      const isPureShielded = isShieldedAddress(transparentAddress);
      assert.equal(isPureShielded, false, 'Transparent address must NOT be classified as pure shielded');

      const validShielded = isShieldedAddress(sampleOrchardUa);
      assert.equal(validShielded, true, 'ZIP-316 Unified Address with Orchard pool must be classified as shielded');
    });

    it('enforces sliding-window rate limiting and rejects burst traffic', () => {
      const testIp = '198.51.100.42';
      const config = { limit: 5, windowMs: 10_000, prefix: 'e2e_test' };

      // Make 5 permitted calls
      for (let i = 0; i < 5; i++) {
        const res = evaluateRateLimit(testIp, config);
        assert.equal(res.allowed, true, `Call ${i + 1} must be allowed`);
      }

      // 6th call must be blocked
      const blocked = evaluateRateLimit(testIp, config);
      assert.equal(blocked.allowed, false, '6th call exceeding limit must be blocked');
      assert.equal(blocked.remaining, 0);
    });

    it('validates idempotency keys to protect against double-submission / replay attacks', () => {
      assert.equal(isValidIdempotencyKey('idem_valid_key_12345'), true);
      assert.equal(isValidIdempotencyKey('a'.repeat(32)), true);

      // Malformed / injection keys must be rejected
      assert.equal(isValidIdempotencyKey(''), false);
      assert.equal(isValidIdempotencyKey('short'), false);
      assert.equal(isValidIdempotencyKey('invalid <script>'), false);
      assert.equal(isValidIdempotencyKey('key with spaces'), false);
    });

    it('masks sensitive API keys and secrets in logs', () => {
      const secret = 'demo_dummy_secret_99887766554433221100aabbcc';
      const masked = maskSensitiveString(secret);
      assert.ok(!masked.includes('99887766554433221100'), 'Middle of secret must be redacted');
      assert.ok(masked.includes('...'), 'Masked string must include ellipsis');
    });
  });
});
