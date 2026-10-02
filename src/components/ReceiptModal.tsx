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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Settlement Audit Receipt</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cryptographic Settlement &amp; Compliance Proof
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Box */}
        <div className="space-y-4 mb-6">
          {/* Key Facts */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Swap ID:</span>
              <span className="font-mono text-slate-900 dark:text-white font-semibold">{receipt.swapId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Settled At:</span>
              <span className="text-slate-700 dark:text-slate-300">{new Date(receipt.settledAt).toUTCString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Shielded Input:</span>
              <span className="font-bold text-amber-800 dark:text-amber-300">{receipt.origin.amountZec} ZEC ({receipt.origin.pool})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Output Delivered:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {receipt.destination.amountReceived} {receipt.destination.asset} ({receipt.destination.chain.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Cryptographic Invariants */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
            <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
              Settlement Verification Invariants:
            </div>
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span><strong>Shielded Isolation:</strong> 100% shielded Orchard execution path</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span><strong>Uniform Padding:</strong> {receipt.privacyVerification.memoEncryption}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span><strong>Graph Unlinkability:</strong> Sender spending key &amp; UTXO balance never revealed</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Viewing Key Fingerprint:</strong>{' '}
                <code className="font-mono text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">{receipt.privacyVerification.complianceViewingKeyFingerprint}</code>
              </span>
            </div>
          </div>

          {/* Destination Tx Hash */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Destination Transaction Proof:</div>
            <a
              href={receipt.destination.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 font-mono text-xs break-all underline"
            >
              <span>{receipt.destination.transactionHash}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={downloadJson}
            className="flex-1 py-3 px-4 rounded-full bg-black hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Verifiable JSON</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
