'use client';

import React from 'react';
import { ShieldCheck, Zap, Lock, ExternalLink } from 'lucide-react';

interface HeaderProps {
  network: 'mainnet' | 'testnet';
  onToggleNetwork: (net: 'mainnet' | 'testnet') => void;
  onOpenAuditor: () => void;
  onOpenSandbox: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  network,
  onToggleNetwork,
  onOpenAuditor,
  onOpenSandbox,
}) => {
  return (
    <header style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      {/* Brand & Track */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f4b728 0%, #e5a91e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(244, 183, 40, 0.4)',
        }}>
          <Lock size={22} color="#06090e" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Z-HYPERINTENT
            </span>
            <span className="badge-tag badge-gold">
              Cross-Chain Track
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Orchard (Halo 2)</span>
            <span>•</span>
            <span>NEAR Intents Protocol</span>
          </div>
        </div>
      </div>

      {/* Badges and Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Zero-Leak Verified Badge */}
        <button
          onClick={onOpenAuditor}
          className="badge-tag badge-emerald"
          style={{ cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '6px 12px' }}
          title="Click to view Zero-Leak Cryptographic Audit Proof"
        >
          <ShieldCheck size={14} />
          <span>Zero-Leak Shielded Verified</span>
        </button>

        {/* Network Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => onToggleNetwork('mainnet')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: network === 'mainnet' ? 'var(--zcash-yellow)' : 'transparent',
              color: network === 'mainnet' ? '#06090e' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Mainnet
          </button>
          <button
            onClick={() => onToggleNetwork('testnet')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: network === 'testnet' ? 'var(--cyan-accent)' : 'transparent',
              color: network === 'testnet' ? '#06090e' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Testnet
          </button>
        </div>

        {/* Interactive Simulator Button */}
        <button
          onClick={onOpenSandbox}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <Zap size={14} color="#f4b728" />
          <span>Simulator</span>
        </button>
      </div>
    </header>
  );
};
