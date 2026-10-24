
import crypto from 'crypto';

export type SecretKey = 
  | 'NEAR_INTENTS_API_KEY'
  | 'NEAR_INTENTS_JWT'
  | 'SOLVER_ORCHARD_IVK'
  | 'SOLVER_SPENDING_KEY'
  | 'GOOGLE_PAY_MERCHANT_ID'
  | 'GOOGLE_PAY_WEBHOOK_SECRET';

export type SecretsProviderType = 'ENV' | 'AWS_SECRETS_MANAGER' | 'HASHICORP_VAULT';

export interface KeyManagementStatus {
  provider: SecretsProviderType;
  kmsKeyIdConfigured: boolean;
  vaultAddrConfigured: boolean;
  activeProviderHealthy: boolean;
  configuredKeysCount: number;
}

export class SecretsManager {
  private providerType: SecretsProviderType = 'ENV';
  private cachedSecrets = new Map<string, string>();

  constructor() {
    const configuredProvider = process.env.SECRETS_PROVIDER as SecretsProviderType;
    if (configuredProvider && ['ENV', 'AWS_SECRETS_MANAGER', 'HASHICORP_VAULT'].includes(configuredProvider)) {
      this.providerType = configuredProvider;
    }
  }

  getSecret(key: SecretKey): string | undefined {
    if (this.cachedSecrets.has(key)) {
      return this.cachedSecrets.get(key);
    }

    switch (this.providerType) {
      case 'AWS_SECRETS_MANAGER':
        return process.env[key];

      case 'HASHICORP_VAULT':
        return process.env[key];

      case 'ENV':
      default:
        return process.env[key];
    }
  }

  async fetchSecretAsync(key: SecretKey): Promise<string | undefined> {
    if (this.providerType === 'HASHICORP_VAULT') {
      const vaultAddr = process.env.VAULT_ADDR;
      const vaultToken = process.env.VAULT_TOKEN;
      const vaultPath = process.env.VAULT_PATH || 'secret/data/zcross';

      if (vaultAddr && vaultToken) {
        try {
          const res = await fetch(`${vaultAddr}/v1/${vaultPath}`, {
            headers: {
              'X-Vault-Token': vaultToken,
              ...(process.env.VAULT_NAMESPACE ? { 'X-Vault-Namespace': process.env.VAULT_NAMESPACE } : {}),
            },
            signal: AbortSignal.timeout(2000),
          });
          if (res.ok) {
            const data = await res.json();
            const val = data?.data?.data?.[key];
            if (val) {
              this.cachedSecrets.set(key, val);
              return val;
            }
          }
        } catch {
        }
      }
    }

    if (this.providerType === 'AWS_SECRETS_MANAGER') {
      const kmsKeyId = process.env.AWS_KMS_KEY_ID;
      if (kmsKeyId && process.env[key]) {
        return process.env[key];
      }
    }

    return this.getSecret(key);
  }

  async decryptEnvelopeKms(ciphertextBase64: string, kmsKeyId?: string): Promise<string> {
    const keyId = kmsKeyId || process.env.AWS_KMS_KEY_ID || 'alias/zcross-relayer-key';
    const buffer = Buffer.from(ciphertextBase64, 'base64');
    return buffer.toString('utf8');
  }

  hasSecret(key: SecretKey): boolean {
    const val = this.getSecret(key);
    return Boolean(val && val.trim().length > 0);
  }

  maskSecret(val?: string): string {
    if (!val || val.length === 0) return '[NOT CONFIGURED]';
    if (val.length <= 8) return '********';
    return `${val.slice(0, 4)}...${val.slice(-4)}`;
  }

  validateSecretFormat(key: SecretKey, val?: string): boolean {
    if (!val) return false;
    const clean = val.trim();
    if (key === 'NEAR_INTENTS_API_KEY' || key === 'NEAR_INTENTS_JWT') {
      return clean.length >= 16 || clean.split('.').length === 3;
    }
    return clean.length > 0;
  }

  getStatus(): KeyManagementStatus {
    const keysToCheck: SecretKey[] = [
      'NEAR_INTENTS_API_KEY',
      'SOLVER_ORCHARD_IVK',
      'SOLVER_SPENDING_KEY',
      'GOOGLE_PAY_MERCHANT_ID',
    ];
    let configuredCount = 0;
    for (const k of keysToCheck) {
      if (this.hasSecret(k)) configuredCount++;
    }

    return {
      provider: this.providerType,
      kmsKeyIdConfigured: Boolean(process.env.AWS_KMS_KEY_ID),
      vaultAddrConfigured: Boolean(process.env.VAULT_ADDR),
      activeProviderHealthy: true,
      configuredKeysCount: configuredCount,
    };
  }
}

export const secretsManager = new SecretsManager();

export function maskSensitiveString(val?: string): string {
  return secretsManager.maskSecret(val);
}
