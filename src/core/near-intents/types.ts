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
export type DepositMode = 'SIMPLE' | 'MEMO';
export type ConfidentialityMode = 'public' | 'basic' | 'advanced';

export interface QuoteRequestPayload {
  dry?: boolean;
  depositMode?: DepositMode;
  swapType: SwapType;
  slippageTolerance: number; // basis points (100 = 1%)
  originAsset: string;
  depositType: DepositType;
  destinationAsset: string;
  amount: string;           // smallest base unit integer string
  recipient: string;        // foreign recipient address or intents account
  recipientType: RecipientType;
  refundTo: string;
  refundType: DepositType;
  deadline?: string;        // ISO 8601 date string (required for quotes)
  confidentiality?: ConfidentialityMode;
  referral?: string;
  quoteWaitingTimeMs?: number;
  appFees?: Array<{ recipient: string; fee: number }>;
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
    depositMemo?: string;
    deadline?: string;
    timeWhenInactive?: string;
  };
  signature?: string;
  timestamp?: string;
  correlationId?: string;
  quoteRequest: QuoteRequestPayload;
}

export interface SwapExecutionStatus {
  status: 'PENDING_DEPOSIT' | 'DEPOSIT_DETECTED' | 'SOLVER_PROCESSING' | 'SETTLED' | 'REFUNDED' | 'EXPIRED';
  depositAddress?: string;
  depositMemo?: string;
  destinationTxHash?: string;
  timeRemainingMs?: number;
}

/**
 * User Session Authentication types for Confidential Intents
 * Reference: https://docs.near-intents.org/integration/distribution-channels/1click-api/authentication
 */
export interface SignedDataPayload {
  standard: 'nep413' | 'erc191' | 'ed25519';
  payload: {
    recipient: string;
    nonce: string;
    message: string; // JSON with { deadline, intents: [], signer_id }
  };
  public_key: string;
  signature: string;
}

export interface UserAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface UserBalanceItem {
  assetId: string;
  symbol: string;
  amount: string;
  amountFormatted: string;
  amountUsd: string;
}

export interface UserBalancesResponse {
  balances: UserBalanceItem[];
}
