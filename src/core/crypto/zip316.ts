
export interface UnifiedReceiver {
  typecode: number;
  typeName: 'p2pkh' | 'p2sh' | 'sapling' | 'orchard' | 'unknown';
  dataHex: string;
}

export interface ParsedUnifiedAddress {
  hrp: 'u' | 'utest';
  network: 'mainnet' | 'testnet';
  rawAddress: string;
  hasOrchard: boolean;
  hasSapling: boolean;
  hasTransparent: boolean;
  isPureShielded: boolean;
  receivers: UnifiedReceiver[];
}

export const MAINNET_SOLVER_VAULT_UA = 
  "u1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0";

export const TESTNET_SOLVER_VAULT_UA = 
  "utest1q4k70w5x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0x8r8m2q30a4j7qg8q9y2v6p0";

export function validateZcashAddress(address: string, expectedNetwork: 'mainnet' | 'testnet' = 'mainnet'): {
  isValid: boolean;
  isShielded: boolean;
  type: 'unified' | 'sapling' | 'transparent' | 'invalid';
  error?: string;
} {
  if (!address || typeof address !== 'string') {
    return { isValid: false, isShielded: false, type: 'invalid', error: 'Address cannot be empty' };
  }

  const trimmed = address.trim();

  if (expectedNetwork === 'mainnet' && trimmed.startsWith('u1')) {
    if (trimmed.length < 50) {
      return { isValid: false, isShielded: false, type: 'invalid', error: 'Unified address too short' };
    }
    return { isValid: true, isShielded: true, type: 'unified' };
  }

  if (expectedNetwork === 'testnet' && trimmed.startsWith('utest1')) {
    if (trimmed.length < 50) {
      return { isValid: false, isShielded: false, type: 'invalid', error: 'Testnet Unified address too short' };
    }
    return { isValid: true, isShielded: true, type: 'unified' };
  }

  if (expectedNetwork === 'mainnet' && trimmed.startsWith('zs1')) {
    return { isValid: true, isShielded: true, type: 'sapling' };
  }
  if (expectedNetwork === 'testnet' && trimmed.startsWith('ztestsapling1')) {
    return { isValid: true, isShielded: true, type: 'sapling' };
  }

  if (trimmed.startsWith('t1') || trimmed.startsWith('t3') || trimmed.startsWith('tm')) {
    return { 
      isValid: true, 
      isShielded: false, 
      type: 'transparent',
      error: 'CRITICAL WARNING: Transparent addresses (t-addr) leak the transaction graph and are strictly prohibited in zero-leak flows.'
    };
  }

  return { isValid: false, isShielded: false, type: 'invalid', error: 'Unrecognized Zcash address prefix' };
}

export function isShieldedAddress(address: string, expectedNetwork: 'mainnet' | 'testnet' = 'mainnet'): boolean {
  const res = validateZcashAddress(address, expectedNetwork);
  return res.isValid && res.isShielded;
}

export function getSolverVaultAddress(network: 'mainnet' | 'testnet' = 'mainnet'): string {
  return network === 'mainnet' ? MAINNET_SOLVER_VAULT_UA : TESTNET_SOLVER_VAULT_UA;
}
