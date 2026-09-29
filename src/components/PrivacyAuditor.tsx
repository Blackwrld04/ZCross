'use client';

import React from 'react';
import { X, ShieldCheck, Zap, Layers, CheckCircle2, Lock, Key } from 'lucide-react';

interface PrivacyAuditorProps {
  onClose: () => void;
}

export const PrivacyAuditor: React.FC<PrivacyAuditorProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '36px',
        border: '1px solid var(--border-glow)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div className="badge-tag badge-emerald" style={{ marginBottom: '8px' }}>
              Security &amp; Cryptographic Architecture
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Zero-Leak Security Invariants</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Mathematical verification of privacy guarantees, uniform memo padding, and non-custodial solver execution.
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* 1. Privacy Pillar */}
          <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>1. Pure Shielded Isolation</h3>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#10b981" /> Zero transparent addresses (t-addr) accepted or routed.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#10b981" /> Pure Orchard pool (ZIP 316 Unified Addresses).
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#10b981" /> Halo 2 recursive zero-knowledge proving system.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#10b981" /> Zero transaction graph linkability between parties.
              </li>
            </ul>
          </div>

          {/* 2. Metadata Defense */}
          <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(244, 183, 40, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Lock size={20} color="var(--zcash-yellow)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--zcash-yellow)' }}>2. Constant-Length Memos</h3>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--zcash-yellow)" /> In-band ChaCha20-Poly1305 note ciphertexts.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--zcash-yellow)" /> Exact 512-byte uniform padding eliminates side-channels.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--zcash-yellow)" /> Destination chains and tokens hidden from observers.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--zcash-yellow)" /> Forward secrecy guaranteed across all note transfers.
              </li>
            </ul>
          </div>

          {/* 3. Non-Custodial Solvers */}
          <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Zap size={20} color="var(--cyan-accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-accent)' }}>3. Non-Custodial Solvers</h3>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--cyan-accent)" /> Integration with NEAR Intents 1Click protocol.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--cyan-accent)" /> Ed25519-signed guaranteed execution quotes.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--cyan-accent)" /> Automatic timeout and shielded refund fallbacks.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="var(--cyan-accent)" /> No wrapped intermediary tokens or bridge honeypots.
              </li>
            </ul>
          </div>

          {/* 4. Compliance Receipts */}
          <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(217, 70, 239, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Key size={20} color="#d946ef" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#d946ef' }}>4. Verifiable Audit Receipts</h3>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#d946ef" /> Cryptographic audit receipt generated for every swap.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#d946ef" /> Viewing Key fingerprints for institutional compliance.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#d946ef" /> Spending authority remains 100% private and protected.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#d946ef" /> Verifiable on Arbiscan and Solscan explorers.
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          Got it, Close Overview
        </button>
      </div>
    </div>
  );
};
