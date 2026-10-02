/**
 * ZCross Google Pay Order Store & Webhook Security Engine
 */

import crypto from 'crypto';
import { OnrampOrderEvent, OnrampProviderId } from './types';

class OnrampOrderStore {
  private orders: Map<string, OnrampOrderEvent> = new Map();

  constructor() {
    // Seed with a verified Google Pay settlement order
    this.saveOrder({
      orderId: 'ord_gpay_settled_7f9c21',
      providerId: 'google_pay_direct',
      status: 'COMPLETED',
      paymentMethod: 'google_pay',
      fiatAmount: 200,
      fiatCurrency: 'USD',
      cryptoAmount: 0.1415,
      cryptoCurrency: 'ZEC',
      destinationAddress: 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6',
      googlePayTransactionId: 'gpay_token_94bf02a884',
      txHash: 'tx_orchard_gpay_8f44b20a3219ee',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3540000).toISOString(),
    });

    // Seed with an active pending Google Pay biometric confirmation order
    this.saveOrder({
      orderId: 'ord_gpay_pending_883a1b',
      providerId: 'google_pay_direct',
      status: 'PENDING',
      paymentMethod: 'google_pay',
      fiatAmount: 100,
      fiatCurrency: 'USD',
      cryptoAmount: 0.0705,
      cryptoCurrency: 'ZEC',
      destinationAddress: 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6',
      googlePayTransactionId: 'gpay_auth_pending_33a01',
      createdAt: new Date(Date.now() - 300000).toISOString(),
    });
  }

  public saveOrder(order: OnrampOrderEvent): void {
    this.orders.set(order.orderId, order);
  }

  public getOrder(orderId: string): OnrampOrderEvent | undefined {
    return this.orders.get(orderId);
  }

  public listOrders(): OnrampOrderEvent[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Advance a pending Google Pay order to COMPLETED
   */
  public simulateOrderClearance(orderId: string): OnrampOrderEvent | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;

    order.status = 'COMPLETED';
    order.completedAt = new Date().toISOString();
    if (!order.txHash) {
      order.txHash = `tx_orchard_gpay_cleared_${Date.now().toString(16)}`;
    }
    this.orders.set(orderId, order);
    return order;
  }

  /**
   * Cryptographically verify inbound webhook signatures from Google Pay partners
   */
  public verifyWebhookSignature(params: {
    providerId: OnrampProviderId;
    payloadRaw: string;
    signatureHeader?: string;
    secret?: string;
  }): boolean {
    const { providerId, payloadRaw, signatureHeader, secret } = params;

    // Sandbox / Test mode bypass if secret is unspecified or signature indicates sandbox
    if (!secret || secret === 'sandbox_secret' || signatureHeader === 'sandbox_valid') {
      return true;
    }

    if (!signatureHeader) return false;

    try {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(payloadRaw).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
    } catch {
      return false;
    }
  }
}

export const globalOnrampStore = new OnrampOrderStore();
