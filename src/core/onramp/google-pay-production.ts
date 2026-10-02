/**
 * Production Google Pay Integration & Gateway Tokenization
 * 
 * Supports production Google Pay configurations:
 * - Production Google Pay Merchant ID validation (Google Pay & Wallet Business Console)
 * - Multi-gateway tokenization: Stripe, Braintree, and MoonPay Direct
 * - Cryptographic HMAC-SHA256 signature verification for settlement callbacks
 * - Strict constant-time webhook authentication
 */

import crypto from 'crypto';

export type GooglePayEnvironment = 'PRODUCTION' | 'TEST';
export type SupportedPaymentGateway = 'stripe' | 'braintree' | 'moonpay';

export interface GooglePayProductionConfig {
  environment: GooglePayEnvironment;
  merchantId: string;
  merchantName: string;
  activeGateway: SupportedPaymentGateway;
  gatewayParameters: Record<string, string>;
  isProductionReady: boolean;
}

export class GooglePayService {
  private environment: GooglePayEnvironment;
  private merchantId: string;
  private merchantName: string;
  private gateway: SupportedPaymentGateway;

  constructor() {
    this.merchantId = process.env.GOOGLE_PAY_MERCHANT_ID || process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || 'BCR2DN6TXEXAMPLE';
    this.merchantName = process.env.GOOGLE_PAY_MERCHANT_NAME || 'ZCross Shielded Payments';
    this.gateway = (process.env.GOOGLE_PAY_GATEWAY as SupportedPaymentGateway) || 'stripe';
    
    const envSetting = (process.env.GOOGLE_PAY_ENVIRONMENT || (process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST')) as GooglePayEnvironment;
    this.environment = envSetting;
  }

  /**
   * Retrieves current Google Pay configuration for client-side PaymentsClient initialization
   */
  getConfig(): GooglePayProductionConfig {
    const gatewayParameters = this.getGatewayParameters(this.gateway);
    const hasValidMerchantId = this.merchantId && !this.merchantId.includes('EXAMPLE') && this.merchantId.length >= 8;

    return {
      environment: this.environment,
      merchantId: this.merchantId,
      merchantName: this.merchantName,
      activeGateway: this.gateway,
      gatewayParameters,
      isProductionReady: Boolean(hasValidMerchantId && this.environment === 'PRODUCTION'),
    };
  }

  /**
   * Builds production gateway tokenization parameters according to Google Pay specification
   */
  getGatewayParameters(gateway: SupportedPaymentGateway): Record<string, string> {
    switch (gateway) {
      case 'stripe':
        return {
          gateway: 'stripe',
          'stripe:version': '2020-08-27',
          'stripe:publishableKey': process.env.STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_sample_stripe_key',
        };
      case 'braintree':
        return {
          gateway: 'braintree',
          'braintree:apiVersion': 'v1',
          'braintree:sdkVersion': '3.94.0',
          'braintree:merchantId': process.env.BRAINTREE_MERCHANT_ID || 'braintree_merchant_live',
          'braintree:clientKey': process.env.BRAINTREE_CLIENT_KEY || 'production_token_sample',
        };
      case 'moonpay':
      default:
        return {
          gateway: 'moonpay',
          gatewayMerchantId: this.merchantId,
        };
    }
  }

  /**
   * Generates a complete Google Pay PaymentDataRequest matching Google Pay Web API v2.0
   */
  buildPaymentDataRequest(params: {
    fiatAmount: string;
    fiatCurrency: string;
    countryCode?: string;
  }) {
    const config = this.getConfig();

    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
            billingAddressRequired: true,
            billingAddressParameters: {
              format: 'FULL',
            },
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: config.gatewayParameters,
          },
        },
      ],
      merchantInfo: {
        merchantId: config.merchantId,
        merchantName: config.merchantName,
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: params.fiatAmount,
        currencyCode: params.fiatCurrency,
        countryCode: params.countryCode || 'US',
      },
    };
  }

  /**
   * Verifies an incoming webhook payload using constant-time HMAC-SHA256 signature verification
   */
  verifyWebhookSignature(payloadRaw: string, signatureHeader: string, secretKey?: string): boolean {
    const secret = secretKey || process.env.GOOGLE_PAY_WEBHOOK_SECRET || process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || 'gpay_webhook_secret_default';
    if (!signatureHeader || !payloadRaw) return false;

    try {
      const computed = crypto.createHmac('sha256', secret).update(payloadRaw).digest('hex');
      const sigBuffer = Buffer.from(signatureHeader, 'hex');
      const compBuffer = Buffer.from(computed, 'hex');

      if (sigBuffer.length !== compBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(sigBuffer, compBuffer);
    } catch {
      return false;
    }
  }
}

export const googlePayService = new GooglePayService();
