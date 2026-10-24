
export interface CrossChainIntentMemo {
  protocol: 'z-intent';
  version: 1;
  swapId: string;           // 8-16 char unique identifier
  destinationChain: string; // e.g. "arb", "sol", "btc", "eth"
  destinationToken: string; // e.g. "USDC", "SOL", "WBTC"
  recipientAddress: string; // Destination chain address (e.g. 0x...)
  slippageBps: number;      // Basis points (100 = 1%)
  refundAddress?: string;   // Optional shielded refund address
  nonce: string;            // Replay-protection nonce
  timestamp: number;
}

export const MEMO_MAX_BYTES = 512;
const MAGIC_HEADER = "ZINT1";

export function serializeIntentMemo(intent: Omit<CrossChainIntentMemo, 'protocol' | 'version'>): {
  buffer: Buffer;
  base64: string;
  hex: string;
} {
  const payload: CrossChainIntentMemo = {
    protocol: 'z-intent',
    version: 1,
    swapId: intent.swapId.slice(0, 16),
    destinationChain: intent.destinationChain,
    destinationToken: intent.destinationToken,
    recipientAddress: intent.recipientAddress,
    slippageBps: intent.slippageBps,
    refundAddress: intent.refundAddress,
    nonce: intent.nonce,
    timestamp: intent.timestamp || Date.now(),
  };

  const jsonStr = JSON.stringify(payload);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');

  if (jsonBuf.length > MEMO_MAX_BYTES) {
    throw new Error(`Memo payload exceeds 512-byte limit (${jsonBuf.length} bytes)`);
  }

  const paddedBuffer = Buffer.alloc(MEMO_MAX_BYTES, 0);
  jsonBuf.copy(paddedBuffer, 0);

  return {
    buffer: paddedBuffer,
    base64: paddedBuffer.toString('base64'),
    hex: paddedBuffer.toString('hex'),
  };
}

export function deserializeIntentMemo(memoBufferOrHex: Buffer | string): CrossChainIntentMemo {
  let buf: Buffer;
  if (typeof memoBufferOrHex === 'string') {
    if (memoBufferOrHex.startsWith('0x')) {
      buf = Buffer.from(memoBufferOrHex.slice(2), 'hex');
    } else if (memoBufferOrHex.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(memoBufferOrHex)) {
      buf = Buffer.from(memoBufferOrHex, 'hex');
    } else {
      buf = Buffer.from(memoBufferOrHex, 'base64');
    }
  } else {
    buf = memoBufferOrHex;
  }

  let lastNonZero = buf.length;
  while (lastNonZero > 0 && buf[lastNonZero - 1] === 0) {
    lastNonZero--;
  }

  const trimmedBuf = buf.subarray(0, lastNonZero);
  const jsonStr = trimmedBuf.toString('utf8');

  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.protocol !== 'z-intent' || parsed.version !== 1) {
      throw new Error('Invalid intent protocol signature');
    }
    if (!parsed.swapId || !parsed.destinationChain || !parsed.recipientAddress) {
      throw new Error('Missing mandatory intent fields');
    }
    return parsed as CrossChainIntentMemo;
  } catch (err: any) {
    throw new Error(`Failed to parse 512-byte intent memo: ${err.message}`);
  }
}

export function serializeMemo(intent: Omit<CrossChainIntentMemo, 'protocol' | 'version'>): Buffer {
  return serializeIntentMemo(intent).buffer;
}

export function deserializeMemo(memoBufferOrHex: Buffer | string): CrossChainIntentMemo {
  return deserializeIntentMemo(memoBufferOrHex);
}
