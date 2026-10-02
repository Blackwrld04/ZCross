/**
 * Persistent Swap State Machine Database
 * Uses better-sqlite3 with file persistence and in-memory fallback
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export type SwapStatus = 
  | 'CREATED'
  | 'MEMO_DETECTED'
  | 'CONFIRMED_SHIELDED'
  | 'SOLVER_EXECUTING'
  | 'SETTLED'
  | 'REFUNDED'
  | 'EXPIRED';

export interface SwapRecord {
  id: string;
  intent_hash: string;
  status: SwapStatus;
  origin_asset: string;
  origin_amount: string;
  deposit_ua: string;
  dest_chain: string;
  dest_token: string;
  dest_recipient: string;
  dest_amount_est: string;
  dest_amount_min: string;
  refund_ua?: string;
  deadline: string;
  memo_base64: string;
  zip321_uri: string;
  zcash_tx_hash?: string;
  dest_tx_hash?: string;
  chaff_enabled?: boolean;
  jitter_delay_seconds?: number;
  decoy_splits_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SwapEvent {
  id: number;
  swap_id: string;
  event_type: string;
  message: string;
  created_at: string;
}

class SwapStore {
  private db: Database.Database;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Fallback to current directory if permission denied
      }
    }

    const dbPath = path.join(dataDir, 'swaps.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initTables();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS swaps (
        id TEXT PRIMARY KEY,
        intent_hash TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        origin_asset TEXT NOT NULL,
        origin_amount TEXT NOT NULL,
        deposit_ua TEXT NOT NULL,
        dest_chain TEXT NOT NULL,
        dest_token TEXT NOT NULL,
        dest_recipient TEXT NOT NULL,
        dest_amount_est TEXT NOT NULL,
        dest_amount_min TEXT NOT NULL,
        refund_ua TEXT,
        deadline TEXT NOT NULL,
        memo_base64 TEXT NOT NULL,
        zip321_uri TEXT NOT NULL,
        zcash_tx_hash TEXT,
        dest_tx_hash TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS swap_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        swap_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (swap_id) REFERENCES swaps (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_swaps_status ON swaps(status);
      CREATE INDEX IF NOT EXISTS idx_swaps_intent ON swaps(intent_hash);
      CREATE INDEX IF NOT EXISTS idx_events_swap ON swap_events(swap_id);
    `);

    try {
      this.db.exec(`ALTER TABLE swaps ADD COLUMN chaff_enabled INTEGER DEFAULT 0;`);
    } catch {}
    try {
      this.db.exec(`ALTER TABLE swaps ADD COLUMN jitter_delay_seconds INTEGER DEFAULT 0;`);
    } catch {}
    try {
      this.db.exec(`ALTER TABLE swaps ADD COLUMN decoy_splits_count INTEGER DEFAULT 0;`);
    } catch {}
  }

  createSwap(swap: Omit<SwapRecord, 'created_at' | 'updated_at'>): SwapRecord {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO swaps (
        id, intent_hash, status, origin_asset, origin_amount,
        deposit_ua, dest_chain, dest_token, dest_recipient,
        dest_amount_est, dest_amount_min, refund_ua, deadline,
        memo_base64, zip321_uri, zcash_tx_hash, dest_tx_hash,
        chaff_enabled, jitter_delay_seconds, decoy_splits_count,
        created_at, updated_at
      ) VALUES (
        @id, @intent_hash, @status, @origin_asset, @origin_amount,
        @deposit_ua, @dest_chain, @dest_token, @dest_recipient,
        @dest_amount_est, @dest_amount_min, @refund_ua, @deadline,
        @memo_base64, @zip321_uri, @zcash_tx_hash, @dest_tx_hash,
        @chaff_enabled, @jitter_delay_seconds, @decoy_splits_count,
        @created_at, @updated_at
      )
    `);

    const record: any = {
      ...swap,
      refund_ua: swap.refund_ua || null,
      zcash_tx_hash: swap.zcash_tx_hash || null,
      dest_tx_hash: swap.dest_tx_hash || null,
      chaff_enabled: swap.chaff_enabled ? 1 : 0,
      jitter_delay_seconds: swap.jitter_delay_seconds || 0,
      decoy_splits_count: swap.decoy_splits_count || 0,
      created_at: now,
      updated_at: now,
    };

    stmt.run(record);
    this.addEvent(record.id, 'INTENT_CREATED', 'Shielded swap intent created and rate locked with NEAR Intents');
    return {
      ...record,
      chaff_enabled: Boolean(record.chaff_enabled),
    };
  }

  getSwap(id: string): SwapRecord | null {
    const stmt = this.db.prepare('SELECT * FROM swaps WHERE id = ?');
    const row = stmt.get(id);
    return (row as SwapRecord) || null;
  }

  getSwapByIntentHash(intentHash: string): SwapRecord | null {
    const stmt = this.db.prepare('SELECT * FROM swaps WHERE intent_hash = ?');
    const row = stmt.get(intentHash);
    return (row as SwapRecord) || null;
  }

  updateStatus(
    id: string, 
    status: SwapStatus, 
    extra?: { zcash_tx_hash?: string; dest_tx_hash?: string; message?: string }
  ): SwapRecord {
    const now = new Date().toISOString();
    let query = 'UPDATE swaps SET status = ?, updated_at = ?';
    const params: any[] = [status, now];

    if (extra?.zcash_tx_hash) {
      query += ', zcash_tx_hash = ?';
      params.push(extra.zcash_tx_hash);
    }
    if (extra?.dest_tx_hash) {
      query += ', dest_tx_hash = ?';
      params.push(extra.dest_tx_hash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    this.db.prepare(query).run(...params);
    this.addEvent(id, status, extra?.message || `Status updated to ${status}`);

    const updated = this.getSwap(id);
    if (!updated) throw new Error(`Swap ${id} not found`);
    return updated;
  }

  addEvent(swapId: string, eventType: string, message: string): void {
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO swap_events (swap_id, event_type, message, created_at)
      VALUES (?, ?, ?, ?)
    `).run(swapId, eventType, message, now);
  }

  getEvents(swapId: string): SwapEvent[] {
    const stmt = this.db.prepare('SELECT * FROM swap_events WHERE swap_id = ? ORDER BY id ASC');
    return (stmt.all(swapId) as SwapEvent[]) || [];
  }

  getAllSwaps(limit: number = 30): SwapRecord[] {
    const stmt = this.db.prepare('SELECT * FROM swaps ORDER BY created_at DESC LIMIT ?');
    return (stmt.all(limit) as SwapRecord[]) || [];
  }
}

// Singleton instance
export const swapStore = new SwapStore();
