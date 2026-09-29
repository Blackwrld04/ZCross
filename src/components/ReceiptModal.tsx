'use client';

import React from 'react';
import { X, ShieldCheck, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { AuditReceiptData } from '@/core/crypto/receipt';

interface ReceiptModalProps {
  receipt: AuditReceiptData | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zcross-receipt-${receipt.swapId.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
      zIndex: 1100,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 0 35px rgba(16, 185, 129, 0.2)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Zero-Leak Audit Receipt</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cryptographic Settlement & Compliance Record
              </div>
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

        {/* Content Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Key Facts */}
          <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Swap ID:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{receipt.swapId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Settled At:</span>
              <span>{new Date(receipt.settledAt).toUTCString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Input (Shielded):</span>
              <span style={{ fontWeight: 700, color: 'var(--zcash-yellow)' }}>{receipt.origin.amountZec} ZEC ({receipt.origin.pool})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Output (Delivered):</span>
              <span style={{ fontWeight: 700, color: 'var(--cyan-accent)' }}>{receipt.destination.amountReceived} {receipt.destination.asset} ({receipt.destination.chain.toUpperCase()})</span>
            </div>
          </div>

          {/* Cryptographic Invariants Audit */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '12px' }}>
              Cryptographic Invariants Passed:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#10b981" />
                <span><strong>Zero Transparent Hops:</strong> No t-address was used in the transaction path.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#10b981" />
                <span><strong>Memo Privacy:</strong> {receipt.privacyVerification.memoEncryption}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#10b981" />
                <span><strong>Graph Unlinkability:</strong> Sender spending key & UTXO balance remain unrevealed.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#10b981" />
                <span><strong>Auditor Fingerprint:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{receipt.privacyVerification.complianceViewingKeyFingerprint}</code></span>
              </div>
            </div>
          </div>

          {/* Destination Transaction Link */}
          <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Destination Chain Proof:</div>
            <a
              href={receipt.destination.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--cyan-accent)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                wordBreak: 'break-all',
              }}
            >
              <span>{receipt.destination.transactionHash}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={downloadJson}
            className="btn-primary"
            style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
          >
            <Download size={16} />
            <span>Download Verifiable JSON</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.9rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
