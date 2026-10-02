/**
 * ZCross Google Pay Fiat-to-Shielded-ZEC On-Ramp Engine
 * Dedicated Google Pay integration for 1-click tokenized shielded funding
 */

export type PaymentNetworkId = 'google_pay';

export type OnrampProviderId = 'moonpay' | 'transak' | 'ramp' | 'google_pay_direct';

export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface PaymentNetworkConfig {
  id: PaymentNetworkId;
  name: string;
  category: 'mobile_wallet';
  icon: string;
  settlementTime: string;
  feePercentage: number;
  fixedFeeUsd: number;
  supportedCurrencies: FiatCurrency[];
  recommendedProvider: OnrampProviderId;
  description: string;
}

export interface ProviderQuote {
  providerId: OnrampProviderId;
  providerName: string;
  logo: string;
  estimatedZec: number;
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  networkFeeUsd: number;
  totalFeeUsd: number;
  ratePerZec: number;
  isBestRate: boolean;
  settlementTime: string;
  checkoutUrl: string;
  paymentMethod: 'google_pay';
}

export interface OnrampOrderEvent {
  orderId: string;
  providerId: OnrampProviderId;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  paymentMethod: 'google_pay';
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  cryptoAmount: number;
  cryptoCurrency: string;
  destinationAddress: string;
  googlePayTransactionId?: string;
  txHash?: string;
  createdAt: string;
  completedAt?: string;
}

export const PAYMENT_NETWORKS: Record<PaymentNetworkId, PaymentNetworkConfig> = {
  google_pay: {
    id: 'google_pay',
    name: 'Google Pay',
    category: 'mobile_wallet',
    icon: 'google_pay',
    settlementTime: '< 1 minute',
    feePercentage: 0.015,
    fixedFeeUsd: 0.30,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    recommendedProvider: 'google_pay_direct',
    description: 'Instant 1-tap biometric tokenized mobile checkout via Google Wallet.',
  },
};

export const PROVIDER_METADATA: Record<OnrampProviderId, { name: string; badge: string; supportShieldedDirect: boolean }> = {
  google_pay_direct: {
    name: 'Google Pay Direct (Fastest)',
    badge: '1-Tap Native Google Wallet',
    supportShieldedDirect: true,
  },
  moonpay: {
    name: 'MoonPay (GPay Rail)',
    badge: 'Instant Card Tokenization',
    supportShieldedDirect: true,
  },
  transak: {
    name: 'Transak (GPay Rail)',
    badge: 'Lowest GPay Fees',
    supportShieldedDirect: true,
  },
  ramp: {
    name: 'Ramp Network (GPay Rail)',
    badge: 'Instant Open Banking & GPay',
    supportShieldedDirect: true,
  },
};

/**
 * Currency conversion multipliers relative to USD base rate
 */
export const FIAT_RATES_TO_USD: Record<FiatCurrency, number> = {
  USD: 1.0,
  EUR: 1.085,
  GBP: 1.282,
  CAD: 0.735,
  AUD: 0.655,
};

/**
 * Live ZEC Market Price in USD (dynamically updated from CoinGecko)
 */
export let ZEC_BASE_PRICE_USD = 1378.52;

export function setLiveZecPrice(price: number) {
  if (price > 0) {
    ZEC_BASE_PRICE_USD = price;
  }
}

/**
 * Calculate Google Pay quotes across aggregators & direct rail
 */
export function calculateOnrampQuotes(params: {
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  destinationAddress: string;
  paymentNetwork?: PaymentNetworkId;
  zecPriceUsd?: number;
}): ProviderQuote[] {
  const { fiatAmount, fiatCurrency, destinationAddress, zecPriceUsd } = params;
  const netConfig = PAYMENT_NETWORKS.google_pay;
  const currencyRateUsd = FIAT_RATES_TO_USD[fiatCurrency] || 1.0;
  const amountInUsd = fiatAmount * currencyRateUsd;

  const providers: OnrampProviderId[] = ['google_pay_direct', 'moonpay', 'transak', 'ramp'];

  const quotes: ProviderQuote[] = providers.map((providerId) => {
    let feeMultiplier = 1.0;
    if (providerId === 'google_pay_direct') feeMultiplier = 0.75; // lowest direct fee
    if (providerId === 'transak') feeMultiplier = 0.85;
    if (providerId === 'moonpay') feeMultiplier = 0.90;

    const percentageFee = amountInUsd * (netConfig.feePercentage * feeMultiplier);
    const fixedFee = netConfig.fixedFeeUsd;
    const totalFeeUsd = parseFloat((percentageFee + fixedFee).toFixed(2));
    
    // Net USD purchasing power
    const netPurchasingPowerUsd = Math.max(0, amountInUsd - totalFeeUsd);
    const ratePerZec = zecPriceUsd && zecPriceUsd > 0 ? zecPriceUsd : ZEC_BASE_PRICE_USD;
    const estimatedZec = parseFloat((netPurchasingPowerUsd / ratePerZec).toFixed(4));

    const checkoutUrl = generateProviderUrl({
      providerId,
      fiatAmount,
      fiatCurrency,
      destinationAddress,
    });

    return {
      providerId,
      providerName: PROVIDER_METADATA[providerId].name,
      logo: providerId,
      estimatedZec,
      fiatAmount,
      fiatCurrency,
      networkFeeUsd: totalFeeUsd,
      totalFeeUsd,
      ratePerZec,
      isBestRate: false,
      settlementTime: netConfig.settlementTime,
      checkoutUrl,
      paymentMethod: 'google_pay',
    };
  });

  // Flag highest ZEC return as best rate
  if (quotes.length > 0) {
    let best = quotes[0];
    for (const q of quotes) {
      if (q.estimatedZec > best.estimatedZec) {
        best = q;
      }
    }
    best.isBestRate = true;
  }

  return quotes;
}

/**
 * Generate official gateway launcher URL for Google Pay
 */
export function generateProviderUrl(params: {
  providerId: OnrampProviderId;
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  destinationAddress: string;
  paymentNetwork?: PaymentNetworkId;
}): string {
  const { providerId, fiatAmount, fiatCurrency, destinationAddress } = params;
  const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://zcross.cash';

  switch (providerId) {
    case 'google_pay_direct': {
      return `${redirectOrigin}/swap?gpay_direct=1&amount=${fiatAmount}&currency=${fiatCurrency}&to=${encodeURIComponent(destinationAddress)}`;
    }
    case 'moonpay': {
      const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY || 'pk_test_sample';
      const base = 'https://buy.moonpay.com';
      return `${base}?apiKey=${apiKey}`
        + `&currencyCode=zec`
        + `&walletAddress=${encodeURIComponent(destinationAddress)}`
        + `&baseCurrencyCode=${fiatCurrency.toLowerCase()}`
        + `&baseCurrencyAmount=${fiatAmount}`
        + `&paymentMethod=google_pay`
        + `&redirectURL=${encodeURIComponent(`${redirectOrigin}/swap?onramp_complete=1&provider=moonpay`)}`;
    }
    case 'transak': {
      const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API_KEY || 'sample_transak_key';
      const base = 'https://global.transak.com';
      return `${base}?apiKey=${apiKey}`
        + `&cryptoCurrencyCode=ZEC`
        + `&walletAddress=${encodeURIComponent(destinationAddress)}`
        + `&fiatCurrency=${fiatCurrency}`
        + `&defaultFiatAmount=${fiatAmount}`
        + `&paymentMethod=google_pay`
        + `&networks=zcash`;
    }
    case 'ramp': {
      const apiKey = process.env.NEXT_PUBLIC_RAMP_API_KEY || 'sample_ramp_key';
      const base = 'https://app.ramp.network';
      return `${base}?hostApiKey=${apiKey}`
        + `&swapAsset=ZEC_ZEC`
        + `&userAddress=${encodeURIComponent(destinationAddress)}`
        + `&fiatCurrency=${fiatCurrency}`
        + `&fiatValue=${fiatAmount}`
        + `&paymentMethod=google_pay`
        + `&finalUrl=${encodeURIComponent(`${redirectOrigin}/swap?onramp_complete=1&provider=ramp`)}`;
    }
  }
}

/**
 * Standard Google Pay API Specification for Web
 * https://developers.google.com/pay/api/web/guides/tutorial
 */
export const GOOGLE_PAY_BASE_REQUEST = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

export const GOOGLE_PAY_CARD_NETWORKS = ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'];
export const GOOGLE_PAY_AUTH_METHODS = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

export function getGooglePayPaymentDataRequest(params: {
  price: string;
  currency: string;
  merchantName?: string;
  merchantId?: string;
  gatewayMerchantId?: string;
}) {
  const { price, currency, merchantName = 'ZCross Shielded Payments', merchantId = 'TEST', gatewayMerchantId = 'sample_gateway_id' } = params;

  return {
    ...GOOGLE_PAY_BASE_REQUEST,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: GOOGLE_PAY_AUTH_METHODS,
          allowedCardNetworks: GOOGLE_PAY_CARD_NETWORKS,
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'moonpay',
            gatewayMerchantId,
          },
        },
      },
    ],
    merchantInfo: {
      merchantId,
      merchantName,
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: price,
      currencyCode: currency,
      countryCode: 'US',
    },
  };
}
