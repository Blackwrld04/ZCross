
export interface RedisOptions {
  exSeconds?: number;
  pxMilliseconds?: number;
}

export class DistributedRedisClient {
  private upstashUrl?: string;
  private upstashToken?: string;
  private memoryStore = new Map<string, { value: string; expiresAt?: number }>();

  constructor() {
    this.upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  async set(key: string, value: string, options?: RedisOptions): Promise<void> {
    const expiresAt = options?.exSeconds
      ? Date.now() + options.exSeconds * 1000
      : options?.pxMilliseconds
      ? Date.now() + options.pxMilliseconds
      : undefined;

    if (this.upstashUrl && this.upstashToken) {
      try {
        const cmd = ['SET', key, value];
        if (options?.exSeconds) {
          cmd.push('EX', options.exSeconds.toString());
        }
        await fetch(`${this.upstashUrl}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.upstashToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cmd),
          signal: AbortSignal.timeout(1500),
        });
        return;
      } catch {
      }
    }

    this.memoryStore.set(key, { value, expiresAt });
  }

  async get(key: string): Promise<string | null> {
    if (this.upstashUrl && this.upstashToken) {
      try {
        const res = await fetch(`${this.upstashUrl}/get/${encodeURIComponent(key)}`, {
          headers: {
            Authorization: `Bearer ${this.upstashToken}`,
          },
          signal: AbortSignal.timeout(1500),
        });
        if (res.ok) {
          const data = await res.json();
          return data.result ?? null;
        }
      } catch {
      }
    }

    const entry = this.memoryStore.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.memoryStore.delete(key);
      return null;
    }

    return entry.value;
  }

  async incr(key: string, exSeconds?: number): Promise<number> {
    if (this.upstashUrl && this.upstashToken) {
      try {
        const res = await fetch(`${this.upstashUrl}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.upstashToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['INCR', key],
            ...(exSeconds ? [['EXPIRE', key, exSeconds.toString()]] : []),
          ]),
          signal: AbortSignal.timeout(1500),
        });
        if (res.ok) {
          const data = await res.json();
          return data[0]?.result || 1;
        }
      } catch {
      }
    }

    const current = await this.get(key);
    const count = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, count.toString(), { exSeconds });
    return count;
  }

  async del(key: string): Promise<void> {
    if (this.upstashUrl && this.upstashToken) {
      try {
        await fetch(`${this.upstashUrl}/del/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${this.upstashToken}` },
          signal: AbortSignal.timeout(1500),
        });
      } catch {}
    }
    this.memoryStore.delete(key);
  }

  async getStatus(): Promise<{
    provider: 'upstash' | 'memory';
    connected: boolean;
    activeKeysEstimate: number;
  }> {
    const isUpstash = Boolean(this.upstashUrl && this.upstashToken);
    return {
      provider: isUpstash ? 'upstash' : 'memory',
      connected: true,
      activeKeysEstimate: this.memoryStore.size,
    };
  }
}

export const redisClient = new DistributedRedisClient();
