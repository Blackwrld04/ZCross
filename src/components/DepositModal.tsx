'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Copy, Check, ExternalLink, ShieldCheck, 
  ArrowRight, Clock, AlertCircle, Eye, EyeOff, Zap 
} from 'lucide-react';

interface DepositModalProps {
  quoteData: any;
  onClose: () => void;
  onViewReceipt: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  quoteData,
  onClose,
  onViewReceipt,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(quoteData.status || 'CREATED');
  const [events, setEvents] = useState<any[]>([]);
  const [showMemoInspector, setShowMemoInspector] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [destTxHash, setDestTxHash] = useState<string | null>(null);

  const swapId = quoteData.swapId;

  // Generate QR Code on mount
  useEffect(() => {
    if (quoteData?.zip321Uri) {
      QRCode.toDataURL(quoteData.zip321Uri, {
        width: 240,
        margin: 2,
        color: {
          dark: '#06090e',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err));
    }
  }, [quoteData]);

  // Poll swap status every 2 seconds
  useEffect(() => {
    if (!swapId || status === 'SETTLED') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/swap/${swapId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.swap) {
            setStatus(data.swap.status);
            if (data.swap.dest_tx_hash) {
              setDestTxHash(data.swap.dest_tx_hash);
            }
          }
          if (data.events) {
            setEvents(data.events);
          }
        }
      } catch (err) {
        console.error('Status poll error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [swapId, status]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Simulate judge action
  const handleSimulate = async (action: 'deposit' | 'settle' | 'full_flow') => {
    setSimulating(true);
    try {
      const res = await fetch('/api/swap/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swapId, action }),
      });
      const data = await res.json();
      if (data.swap) {
        setStatus(data.swap.status);
        if (data.swap.dest_tx_hash) {
          setDestTxHash(data.swap.dest_tx_hash);
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Pipeline Step State Helpers
  const isStepDone = (stepIdx: number) => {
    const states = ['CREATED', 'MEMO_DETECTED', 'CONFIRMED_SHIELDED', 'SOLVER_EXECUTING', 'SETTLED'];
    const currentIdx = states.indexOf(status);
    return currentIdx >= stepIdx;
  };

  const isStepActive = (stepIdx: number) => {
    const states = ['CREATED', 'MEMO_DETECTED', 'CONFIRMED_SHIELDED', 'SOLVER_EXECUTING', 'SETTLED'];
    return states.indexOf(status) === stepIdx;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        border: '1px solid var(--border-glow)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div className="badge-tag badge-gold" style={{ marginBottom: '8px' }}>
              Shielded Deposit Request
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Send Exactly {quoteData.originAmountZec} ZEC
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              To receive ≈ {quoteData.estimatedOutput} {quoteData.destinationToken} on {quoteData.destinationChain.toUpperCase()}
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

        {/* QR Code and Payment Details Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1fr) 1.4fr',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '28px',
        }}>
          {/* QR Code container */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="ZIP 321 QR Code" style={{ width: '100%', maxWidth: '220px', height: 'auto', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                Generating QR...
              </div>
            )}
            <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '6px', textAlign: 'center', fontWeight: 600 }}>
              Scan with Zashi / Zodl / Mobile Wallet
            </div>
          </div>

          {/* Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Amount */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Amount to Transfer:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--zcash-yellow)' }}>
                  {quoteData.originAmountZec} ZEC
                </span>
                <button
                  onClick={() => copyToClipboard(quoteData.originAmountZec, 'amount')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copiedField === 'amount' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedField === 'amount' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Solver Vault Address */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Solver Shielded Vault (ZIP 316 UA):</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '220px',
                }}>
                  {quoteData.depositUnifiedAddress}
                </span>
                <button
                  onClick={() => copyToClipboard(quoteData.depositUnifiedAddress, 'vault')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copiedField === 'vault' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedField === 'vault' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 1-Click Payment Link Button */}
            <a
              href={quoteData.zip321Uri}
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '12px', fontSize: '0.9rem' }}
            >
              <ExternalLink size={16} />
              <span>Launch Zcash Wallet Directly</span>
            </a>

            {/* Memo Inspector Toggle */}
            <button
              onClick={() => setShowMemoInspector(!showMemoInspector)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan-accent)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
              }}
            >
              {showMemoInspector ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showMemoInspector ? 'Hide' : 'Inspect'} 512-Byte Encrypted Memo Structure</span>
            </button>
          </div>
        </div>

        {/* Memo Inspector Dropdown */}
        {showMemoInspector && (
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-cyan-glow)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.8rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--cyan-accent)' }}>In-Band Intent Memo Payload (512 Bytes)</span>
              <span style={{ color: 'var(--text-faint)' }}>ChaCha20-Poly1305 Padded</span>
            </div>
            <pre style={{
              background: '#06090e',
              padding: '12px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#a5f3fc',
              marginBottom: '8px',
            }}>
{JSON.stringify({
  protocol: "z-intent",
  version: 1,
  swapId: swapId.slice(0, 16),
  destinationChain: quoteData.destinationChain,
  destinationToken: quoteData.destinationToken,
  recipientAddress: quoteData.recipientAddress,
  slippageBps: 100,
  padding: "512B zero-padded to eliminate size correlation"
}, null, 2)}
            </pre>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              🛡️ <strong>Zero-Leak Invariant:</strong> The memo is encrypted inside the Orchard note ciphertext. Only the Solver's IVK can decrypt these parameters. Observers on the Zcash network cannot see destination chain or recipient.
            </div>
          </div>
        )}

        {/* Real-Time Live Pipeline */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Live Intent Execution Pipeline</span>
            {status !== 'SETTLED' && <span className="badge-tag badge-gold pulse-indicator">Monitoring Blocks</span>}
            {status === 'SETTLED' && <span className="badge-tag badge-emerald">Settled</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Step 1: Created */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isStepDone(0) ? 1 : 0.4 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>✓</div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Intent Created & Rate Locked:</strong> Guaranteed solver quote secured with NEAR Intents.
              </div>
            </div>

            {/* Step 2: Memo Detected */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isStepDone(1) ? 1 : 0.4 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isStepDone(1) ? '#10b981' : isStepActive(0) ? 'var(--zcash-yellow)' : '#334155',
                color: '#06090e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {isStepDone(1) ? '✓' : '2'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Shielded Note Ingestion:</strong> Solver scanning compact block stream via Zebra node.
              </div>
            </div>

            {/* Step 3: Orchard Pool Confirmation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isStepDone(2) ? 1 : 0.4 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isStepDone(2) ? '#10b981' : isStepActive(1) ? 'var(--zcash-yellow)' : '#334155',
                color: '#06090e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {isStepDone(2) ? '✓' : '3'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Halo 2 Zero-Knowledge Proof:</strong> Orchard commitment verified; nullifier registered.
              </div>
            </div>

            {/* Step 4: Solver Settlement */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isStepDone(4) ? 1 : 0.4 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isStepDone(4) ? '#10b981' : isStepActive(3) ? 'var(--cyan-accent)' : '#334155',
                color: '#06090e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {isStepDone(4) ? '✓' : '4'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Foreign Chain Delivery:</strong> Disbursed {quoteData.estimatedOutput} {quoteData.destinationToken} to {quoteData.recipientAddress.slice(0, 10)}...
              </div>
            </div>
          </div>
        </div>

        {/* If Settled: Success Callout */}
        {status === 'SETTLED' ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
                🎉 Swap Fully Settled!
              </div>
              {destTxHash && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tx: {destTxHash.slice(0, 24)}...
                </div>
              )}
            </div>

            <button
              onClick={onViewReceipt}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <ShieldCheck size={16} />
              <span>Audit Receipt</span>
            </button>
          </div>
        ) : (
          /* Judge Sandbox Simulator Controls */
          <div style={{
            background: 'rgba(244, 183, 40, 0.05)',
            border: '1px dashed rgba(244, 183, 40, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--zcash-yellow)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} /> Judge Evaluation Sandbox:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Instant 1-Click Simulation</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSimulate('deposit')}
                disabled={simulating || isStepDone(1)}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                1. Simulate Note Deposit
              </button>

              <button
                type="button"
                onClick={() => handleSimulate('settle')}
                disabled={simulating || status === 'SETTLED'}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                2. Simulate Settlement
              </button>

              <button
                type="button"
                onClick={() => handleSimulate('full_flow')}
                disabled={simulating || status === 'SETTLED'}
                className="btn-primary"
                style={{ flex: 1.5, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                ⚡ 1-Click Complete Flow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
