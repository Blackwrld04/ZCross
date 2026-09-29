/**
 * Type definitions for NEAR Intents (1Click API & Defuse Protocol)
 * Spec reference: https://docs.near-intents.org/
 */

export interface NearIntentsToken {
  assetId: string;
  decimals: number;
  blockchain: string;
  symbol: string;
  price: number;
  priceUpdatedAt: string;
  contractAddress?: string | null;
  coingeckoId?: string;
}

export type SwapType = 'EXACT_INPUT' | 'EXACT_OUTPUT' | 'FLEX_INPUT' | 'ANY_INPUT';
export type DepositType = 'ORIGIN_CHAIN' | 'INTENTS' | 'CONFIDENTIAL_INTENTS';
export type RecipientType = 'DESTINATION_CHAIN' | 'INTENTS' | 'CONFIDENTIAL_INTENTS';

export interface QuoteRequestPayload {
  dry?: boolean;
  swapType: SwapType;
  slippageTolerance: number; // basis points (100 = 1%)
  originAsset: string;
  depositType: DepositType;
  destinationAsset: string;
  amount: string;           // smallest unit
  recipient: string;        // foreign recipient address (e.g. lowercase 0x...)
  recipientType: RecipientType;
  refundTo: string;
  refundType: DepositType;
  confidentiality?: 'public' | 'basic' | 'advanced';
  deadline?: string;        // ISO timestamp
}

export interface QuoteResponsePayload {
  quote: {
    amountIn: string;
    amountInFormatted: string;
    amountInUsd: string;
    minAmountIn: string;
    amountOut: string;
    amountOutFormatted: string;
    amountOutUsd: string;
    minAmountOut: string;
    timeEstimate: number;
    refundFee: string;
    withdrawFee: string;
    depositAddress?: string;
  };
  signature: string;
  timestamp: string;
  correlationId: string;
  quoteRequest: QuoteRequestPayload;
}

export interface SwapExecutionStatus {
  status: 'PENDING_DEPOSIT' | 'DEPOSIT_DETECTED' | 'SOLVER_PROCESSING' | 'SETTLED' | 'REFUNDED' | 'EXPIRED';
  depositAddress?: string;
  destinationTxHash?: string;
  timeRemainingMs?: number;
}
