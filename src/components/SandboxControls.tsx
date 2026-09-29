'use client';

import React from 'react';
import { X, Play, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';

interface SandboxControlsProps {
  onClose: () => void;
  onQuickDemo: () => void;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({ onClose, onQuickDemo }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 900,
      maxWidth: '380px',
      width: 'calc(100% - 48px)',
    }}>
      <div className="glass-panel" style={{
        padding: '20px',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="var(--zcash-yellow)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Judge Sandbox Console</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
          Test the entire Zcash Orchard → NEAR Intents cross-chain settlement pipeline in Dual-Mode without waiting for testnet blocks.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onQuickDemo}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
          >
            <Play size={14} />
            <span>Launch Quick 1.0 ZEC → USDC Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
