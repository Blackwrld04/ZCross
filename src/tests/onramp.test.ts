import { describe, it } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { 
  calculateOnrampQuotes, 
  generateProviderUrl, 
  getGooglePayPaymentDataRequest,
  PAYMENT_NETWORKS,
  GOOGLE_PAY_BASE_REQUEST,
  GOOGLE_PAY_CARD_NETWORKS,
  FiatCurrency,
  PaymentNetworkId
} from '../core/onramp/types';
import { globalOnrampStore } from '../core/onramp/store';

describe('Google Pay Shielded ZEC On-Ramp Engine', () => {
  const sampleAddress = 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';

  it('calculates Google Pay quotes across direct rail and aggregators', () => {
    const quotes = calculateOnrampQuotes({
      fiatAmount: 500,
      fiatCurrency: 'USD',
      paymentNetwork: 'google_pay',
      destinationAddress: sampleAddress,
    });

    assert.strictEqual(quotes.length, 4, 'Should return quotes for google_pay_direct, moonpay, transak, and ramp');
    
    // Exactly one provider should hold the isBestRate badge
    const bestRateCount = quotes.filter(q => q.isBestRate).length;
    assert.strictEqual(bestRateCount, 1, 'Exactly one provider should be marked as best rate');

    for (const q of quotes) {
      assert(q.estimatedZec > 0, 'Estimated ZEC should be positive');
      assert(q.totalFeeUsd > 0, 'Total fee should be positive');
      assert.strictEqual(q.paymentMethod, 'google_pay', 'Payment method must be strictly google_pay');
      assert(q.checkoutUrl.includes('zec') || q.checkoutUrl.includes('ZEC') || q.checkoutUrl.includes('gpay_direct'), 'Checkout URL must route to ZEC or direct flow');
    }
  });

  it('verifies that Google Pay Direct offers lower fee structure than external aggregators', () => {
    const quotes = calculateOnrampQuotes({
      fiatAmount: 1000,
      fiatCurrency: 'USD',
      paymentNetwork: 'google_pay',
      destinationAddress: sampleAddress,
    });

    const directQuote = quotes.find(q => q.providerId === 'google_pay_direct');
    const moonpayQuote = quotes.find(q => q.providerId === 'moonpay');

    assert(directQuote !== undefined, 'Google Pay Direct quote must exist');
    assert(moonpayQuote !== undefined, 'MoonPay quote must exist');

    assert(
      directQuote.totalFeeUsd < moonpayQuote.totalFeeUsd,
      `Direct Google Pay fee ($${directQuote.totalFeeUsd}) must be lower than external aggregator fee ($${moonpayQuote.totalFeeUsd})`
    );
    assert(
      directQuote.estimatedZec >= moonpayQuote.estimatedZec,
      'Direct Google Pay should deliver equal or greater shielded ZEC'
    );
  });

  it('generates valid provider checkout URLs embedding user Unified Address for Google Pay', () => {
    const providers = ['moonpay', 'transak', 'ramp'] as const;

    for (const p of providers) {
      const url = generateProviderUrl({
        providerId: p,
        fiatAmount: 250,
        fiatCurrency: 'USD',
        destinationAddress: sampleAddress,
        paymentNetwork: 'google_pay',
      });

      assert(url.startsWith('https://'), `Provider ${p} URL must use secure HTTPS`);
      assert(url.includes(encodeURIComponent(sampleAddress)), `Provider ${p} URL must encode destination address`);
      assert(url.includes('google_pay'), `Provider ${p} URL must specify google_pay payment method`);
    }
  });

  it('builds standard Google Pay Web API payment data request specifications', () => {
    const request = getGooglePayPaymentDataRequest({
      price: '200.00',
      currency: 'USD',
      merchantName: 'ZCross Shielded Test',
      merchantId: 'TEST_MERCHANT_ID',
      gatewayMerchantId: 'sample_moonpay_gateway_id',
    });

    assert.strictEqual(request.apiVersion, GOOGLE_PAY_BASE_REQUEST.apiVersion);
    assert.strictEqual(request.apiVersionMinor, GOOGLE_PAY_BASE_REQUEST.apiVersionMinor);
    assert.strictEqual(request.transactionInfo.totalPrice, '200.00');
    assert.strictEqual(request.transactionInfo.currencyCode, 'USD');
    assert.strictEqual(request.merchantInfo.merchantId, 'TEST_MERCHANT_ID');
    
    // Check payment method parameters
    assert.strictEqual(request.allowedPaymentMethods.length, 1);
    const cardMethod = request.allowedPaymentMethods[0];
    assert.strictEqual(cardMethod.type, 'CARD');
    assert.strictEqual(cardMethod.tokenizationSpecification.type, 'PAYMENT_GATEWAY');
    assert.strictEqual(cardMethod.tokenizationSpecification.parameters.gateway, 'moonpay');
  });

  it('cryptographically validates and records Google Pay webhook settlement payloads', () => {
    const testSecret = 'secret_hmac_test_key_12345';
    const rawPayload = JSON.stringify({
      orderId: 'ord_test_gpay_89201',
      status: 'COMPLETED',
      paymentMethod: 'google_pay',
      fiatAmount: 200,
      fiatCurrency: 'USD',
      cryptoAmount: 0.1415,
      destinationAddress: sampleAddress,
      googlePayTransactionId: 'gpay_token_demo_9921',
      txHash: 'tx_orchard_gpay_completed_abc123',
    });

    // Generate valid HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', testSecret);
    const validSignature = hmac.update(rawPayload).digest('hex');

    // Valid signature check
    const isValid = globalOnrampStore.verifyWebhookSignature({
      providerId: 'moonpay',
      payloadRaw: rawPayload,
      signatureHeader: validSignature,
      secret: testSecret,
    });
    assert.strictEqual(isValid, true, 'Valid HMAC signature must be accepted');

    // Malicious tampered signature check
    const isInvalid = globalOnrampStore.verifyWebhookSignature({
      providerId: 'moonpay',
      payloadRaw: rawPayload,
      signatureHeader: 'tampered_malicious_signature_hex_000',
      secret: testSecret,
    });
    assert.strictEqual(isInvalid, false, 'Tampered signature must be strictly rejected');

    // Order store lifecycle
    globalOnrampStore.saveOrder({
      orderId: 'ord_test_gpay_89201',
      providerId: 'moonpay',
      status: 'COMPLETED',
      paymentMethod: 'google_pay',
      fiatAmount: 200,
      fiatCurrency: 'USD',
      cryptoAmount: 0.1415,
      cryptoCurrency: 'ZEC',
      destinationAddress: sampleAddress,
      googlePayTransactionId: 'gpay_token_demo_9921',
      txHash: 'tx_orchard_gpay_completed_abc123',
      createdAt: new Date().toISOString(),
    });

    const retrieved = globalOnrampStore.getOrder('ord_test_gpay_89201');
    assert.strictEqual(retrieved?.status, 'COMPLETED');
    assert.strictEqual(retrieved?.paymentMethod, 'google_pay');
    assert.strictEqual(retrieved?.cryptoAmount, 0.1415);
  });

  it('simulates Google Pay settlement lifecycle seamlessly', () => {
    const pendingOrderId = 'ord_test_gpay_pending_' + Date.now();
    globalOnrampStore.saveOrder({
      orderId: pendingOrderId,
      providerId: 'google_pay_direct',
      status: 'PENDING',
      paymentMethod: 'google_pay',
      fiatAmount: 300,
      fiatCurrency: 'USD',
      cryptoAmount: 0.2112,
      cryptoCurrency: 'ZEC',
      destinationAddress: sampleAddress,
      googlePayTransactionId: 'gpay_auth_test_123',
      createdAt: new Date().toISOString(),
    });

    const beforeClear = globalOnrampStore.getOrder(pendingOrderId);
    assert.strictEqual(beforeClear?.status, 'PENDING');
    assert.strictEqual(beforeClear?.completedAt, undefined);

    // Simulate clearing
    const afterClear = globalOnrampStore.simulateOrderClearance(pendingOrderId);
    assert.strictEqual(afterClear?.status, 'COMPLETED');
    assert(afterClear?.completedAt !== undefined, 'Cleared order must have completedAt timestamp');
    assert(afterClear?.txHash?.startsWith('tx_orchard_gpay_'), 'Cleared order must have orchard transaction hash');
  });
});
