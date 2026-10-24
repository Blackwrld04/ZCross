import { SwapRecord } from './store';

const STORAGE_KEY_LOCAL_SWAPS = 'zcross_user_swaps_v1';
const MAINNET_VAULT_UA =
  'u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0';

export function getLocalSwapRecords(): SwapRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_SWAPS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse local swap records:', err);
    return [];
  }
}

export function saveLocalSwapRecord(swap: any): SwapRecord {
  const hexRandom = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const id = swap.id || swap.swapId || `swap_${Date.now().toString(16)}_${hexRandom(6)}`;
  const now = new Date().toISOString();

  const record: SwapRecord = {
    id,
    intent_hash:
      swap.intent_hash ||
      swap.intentHash ||
      `0x${hexRandom(64)}`,
    status: swap.status || 'SETTLED',
    origin_asset: swap.origin_asset || 'ZEC',
    origin_amount: String(swap.origin_amount || swap.originAmountZec || swap.originAmount || '1.0'),
    deposit_ua: swap.deposit_ua || swap.depositUnifiedAddress || MAINNET_VAULT_UA,
    dest_chain: swap.dest_chain || swap.destinationChain || 'arb',
    dest_token: swap.dest_token || swap.destinationToken || swap.destinationTokenSymbol || 'USDC',
    dest_recipient: swap.dest_recipient || swap.recipientAddress || '',
    dest_amount_est: String(swap.dest_amount_est || swap.estimatedOutput || '0'),
    dest_amount_min: String(swap.dest_amount_min || swap.minimumOutput || '0'),
    refund_ua: swap.refund_ua || swap.refundShieldedAddress,
    deadline: swap.deadline || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    memo_base64: swap.memo_base64 || swap.memoBase64 || '',
    zip321_uri: swap.zip321_uri || swap.zip321Uri || '',
    zcash_tx_hash: swap.zcash_tx_hash || swap.zcashTxHash || (swap.txid ? String(swap.txid) : undefined),
    dest_tx_hash:
      swap.dest_tx_hash ||
      swap.destTxHash ||
      (swap.status === 'SETTLED' ? `0x${hexRandom(64)}` : undefined),
    chaff_enabled: Boolean(swap.chaff_enabled || swap.chaffEnabled),
    jitter_delay_seconds: swap.jitter_delay_seconds || swap.jitterDelaySeconds || 0,
    created_at: swap.created_at || now,
    updated_at: now,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalSwapRecords();
      const filtered = existing.filter((s) => s.id !== record.id);
      filtered.unshift(record);
      localStorage.setItem(STORAGE_KEY_LOCAL_SWAPS, JSON.stringify(filtered.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to persist local swap:', e);
    }
  }

  return record;
}

export function mergeSwapRecords(
  apiSwaps: SwapRecord[],
  localSwaps: SwapRecord[],
  walletHistory?: any[]
): SwapRecord[] {
  const map = new Map<string, SwapRecord>();

  // 1. Add all local swaps
  for (const s of localSwaps) {
    if (s && s.id) {
      map.set(s.id, s);
    }
  }

  // 2. Merge API swaps
  for (const s of apiSwaps) {
    if (!s || !s.id) continue;
    if (!map.has(s.id)) {
      map.set(s.id, s);
    } else {
      const existing = map.get(s.id)!;
      // Preserve settled status and dest_tx_hash if local has settled
      if (existing.status === 'SETTLED') {
        map.set(s.id, {
          ...s,
          status: 'SETTLED',
          dest_tx_hash: existing.dest_tx_hash || s.dest_tx_hash,
          updated_at: existing.updated_at,
        });
      } else {
        map.set(s.id, s);
      }
    }
  }

  // 3. Synthesize any missing swaps from embedded wallet history (SWAP_OUT records)
  if (Array.isArray(walletHistory)) {
    for (const h of walletHistory) {
      if (h && h.type === 'SWAP_OUT') {
        const synthId = h.txid ? h.txid.replace('tx_orchard_', 'swap_').slice(0, 24) : `swap_${h.timestamp}`;
        // Check if this wallet tx is already tracked
        const isTracked = Array.from(map.values()).some(
          (s) => s.zcash_tx_hash === h.txid || s.id === synthId
        );
        if (!isTracked) {
          const hexRandom = (len: number) =>
            Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          const synthRecord: SwapRecord = {
            id: synthId,
            intent_hash: h.txid || `0x${hexRandom(64)}`,
            status: 'SETTLED',
            origin_asset: 'ZEC',
            origin_amount: Number(h.amountZec || 1).toFixed(4),
            deposit_ua: MAINNET_VAULT_UA,
            dest_chain: 'arb',
            dest_token: 'USDC',
            dest_recipient: h.recipientAddress || '0x...',
            dest_amount_est: (Number(h.amountZec || 1) * 1151.6).toFixed(2),
            dest_amount_min: (Number(h.amountZec || 1) * 1140.0).toFixed(2),
            deadline: new Date(h.timestamp + 30 * 60 * 1000).toISOString(),
            memo_base64: '',
            zip321_uri: '',
            zcash_tx_hash: h.txid,
            dest_tx_hash: `0x${hexRandom(64)}`,
            created_at: new Date(h.timestamp).toISOString(),
            updated_at: new Date(h.timestamp).toISOString(),
          };
          map.set(synthId, synthRecord);
          saveLocalSwapRecord(synthRecord);
        }
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
