'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Shield, Info, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { validateZcashAddress } from '@/core/crypto/zip316';

export interface DestinationToken {
  chain: string;
  chainName: string;
  symbol: string;
  assetId: string;
  decimals: number;
  icon: string;
}

interface SwapCardProps {
  network: 'mainnet' | 'testnet';
  destinations: DestinationToken[];
  onQuoteGenerated: (quoteData: any) => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  network,
  destinations,
  onQuoteGenerated,
}) => {
  const [originAmount, setOriginAmount] = useState<string>('1.0');
  const [selectedDest, setSelectedDest] = useState<DestinationToken>(
    destinations[0] || {
      chain: 'arb',
      chainName: 'Arbitrum One',
      symbol: 'USDC',
      assetId: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
      decimals: 6,
      icon: '💵',
    }
  );
  const [recipient, setRecipient] = useState<string>('0x71c8364426bb8f3f0fba8c91b860475e88e3ef8a');
  const [refundAddress, setRefundAddress] = useState<string>('');
  const [showRefundInput, setShowRefundInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Rate estimates
  const zecPriceUsd = 1420.0;
  const originAmountNum = parseFloat(originAmount) || 0;
  const estimatedUsd = originAmountNum * zecPriceUsd;

  let calculatedOutput = '0.00';
  if (selectedDest.symbol === 'USDC') {
    calculatedOutput = estimatedUsd.toFixed(2);
  } else if (selectedDest.symbol === 'SOL') {
    calculatedOutput = (estimatedUsd / 120.0).toFixed(4);
  } else if (selectedDest.symbol === 'BTC') {
    calculatedOutput = (estimatedUsd / 84000.0).toFixed(6);
  }

  // Handle Quick Amount Click
  const handleQuickAmount = (amt: string) => {
    setOriginAmount(amt);
  };

  // Recipient address validation helper
  const isRecipientValid = () => {
    if (!recipient) return false;
    if (selectedDest.chain === 'arb' || selectedDest.chain === 'eth' || selectedDest.chain === 'base') {
      return /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());
    }
    return recipient.trim().length >= 26;
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (originAmountNum <= 0) {
      setError('Please specify a ZEC amount greater than 0.');
      return;
    }

    if (!isRecipientValid()) {
      setError(`Please provide a valid ${selectedDest.chainName} recipient address.`);
      return;
    }

    if (refundAddress) {
      const refundCheck = validateZcashAddress(refundAddress, network);
      if (!refundCheck.isValid || !refundCheck.isShielded) {
        setError(refundCheck.error || 'Refund address must be a shielded Unified Address (u1...)');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originAmountZec: originAmount,
          destinationChain: selectedDest.chain,
          destinationAsset: selectedDest.assetId,
          destinationTokenSymbol: selectedDest.symbol,
          recipientAddress: recipient.trim().toLowerCase(),
          refundShieldedAddress: refundAddress ? refundAddress.trim() : undefined,
          slippageBps: 100,
          network,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate cross-chain intent');
      }

      onQuoteGenerated(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with quote engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{
      maxWidth: '540px',
      margin: '0 auto',
      padding: '32px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--zcash-yellow), transparent)',
      }} />

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Zero-Leak Shielded Swap
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
          Swap Shielded ZEC directly into external blockchains without ever unshielding on the way through.
        </p>
      </div>

      <form onSubmit={handleGenerateQuote}>
        {/* Origin Section (You Send) */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '8px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>You Pay (Shielded)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--zcash-yellow)', fontWeight: 600 }}>Orchard Pool (Halo 2)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <input
              type="number"
              step="any"
              min="0.0001"
              value={originAmount}
              onChange={(e) => setOriginAmount(e.target.value)}
              placeholder="0.0"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                fontWeight: 700,
                width: '60%',
                outline: 'none',
                fontFamily: 'var(--font-main)',
              }}
              required
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '8px 14px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <span style={{ fontSize: '1.3rem' }}>🛡️</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>ZEC</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>
              ≈ ${estimatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>

            {/* Quick Amount Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['0.5', '1.0', '2.5', '5.0'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAmount(amt)}
                  style={{
                    background: originAmount === amt ? 'rgba(244, 183, 40, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: originAmount === amt ? '1px solid var(--zcash-yellow)' : '1px solid var(--border-subtle)',
                    color: originAmount === amt ? 'var(--zcash-yellow)' : 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Swap Switch Divider */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-10px 0', position: 'relative', zIndex: 2 }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}>
            <ArrowDownUp size={16} color="var(--zcash-yellow)" />
          </div>
        </div>

        {/* Destination Section (You Receive) */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>You Receive</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', fontWeight: 600 }}>Guaranteed Solver Quote</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              {calculatedOutput}
            </div>

            {/* Destination Selector */}
            <select
              value={selectedDest.symbol}
              onChange={(e) => {
                const found = destinations.find((d) => d.symbol === e.target.value);
                if (found) setSelectedDest(found);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 14px',
                borderRadius: '24px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {destinations.map((d) => (
                <option key={`${d.chain}-${d.symbol}`} value={d.symbol} style={{ background: '#0c111a', color: '#fff' }}>
                  {d.icon} {d.symbol} ({d.chainName})
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '8px' }}>
            Rate: 1 ZEC ≈ {(zecPriceUsd / (selectedDest.symbol === 'BTC' ? 84000 : selectedDest.symbol === 'SOL' ? 120 : 1)).toFixed(2)} {selectedDest.symbol} • Max Slippage: 1.0%
          </div>
        </div>

        {/* Destination Recipient Address */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
            Recipient {selectedDest.chainName} Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={selectedDest.chain === 'arb' ? '0x...' : 'Destination address...'}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: isRecipientValid() ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            required
          />
          {isRecipientValid() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem', color: '#10b981' }}>
              <CheckCircle2 size={12} /> Validated destination format
            </div>
          )}
        </div>

        {/* Optional Shielded Refund Address Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowRefundInput(!showRefundInput)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 0',
            }}
          >
            <span>{showRefundInput ? '▼' : '▶'}</span>
            <span>+ Advanced: Custom Shielded Refund Address (Optional)</span>
          </button>

          {showRefundInput && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={refundAddress}
                onChange={(e) => setRefundAddress(e.target.value)}
                placeholder="u1... (Shielded Unified Address for fallback refunds)"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        {/* Privacy Invariant Banner */}
        <div style={{
          background: 'rgba(244, 183, 40, 0.06)',
          border: '1px solid rgba(244, 183, 40, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <Shield size={18} color="var(--zcash-yellow)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-main)' }}>Zero-Leak Invariant Active:</strong> No transparent (t-addr) addresses are ever used. Your swap intent is encrypted inside the Orchard note’s 512-byte memo.
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            color: '#ef4444',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '16px' }}
        >
          {loading ? (
            <span>Securing Shielded Intent Quote...</span>
          ) : (
            <>
              <Sparkles size={18} />
              <span>SWAP SHIELDED ZEC</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
