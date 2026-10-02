'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Terminal, Code2, Zap, ArrowLeft, Copy, Check, Play, 
  Send, RefreshCw, Layers, Shield, ExternalLink, BookOpen, 
  Sparkles, CheckCircle2, AlertCircle, ShoppingBag, Lock
} from 'lucide-react';
import { ZCrossPayWidget } from '@/components/ZCrossPayWidget';
import { serializeIntentMemo, deserializeIntentMemo } from '@/core/crypto/memo';
import { TokenIcon } from '@/components/TokenIcon';
import { EmbeddedWalletProvider } from '@/core/zcash/EmbeddedWalletContext';
import { WalletProvider } from '@/core/wallet/WalletContext';
import { ZCrossLogo } from '@/components/BrandLogos';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  defaultPayload?: any;
  defaultParams?: Record<string, string>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'health',
    name: 'Health & Node Status',
    method: 'GET',
    path: '/api/health',
    description: 'Returns real-time consensus node status, Orchard block height, memory, and corridor health.',
  },
  {
    id: 'tokens',
    name: 'Destination Corridors & Tokens',
    method: 'GET',
    path: '/api/tokens',
    description: 'Retrieves all active cross-chain settlement assets, chain IDs, and NEP-141 asset addresses.',
  },
  {
    id: 'quote',
    name: 'Create Cross-Chain Quote / Intent',
    method: 'POST',
    path: '/api/quote',
    description: 'Generates a 15-minute guaranteed rate quote, solver unified address (UA), and 512-byte zero-padded memo.',
    defaultPayload: {
      originAmountZec: '1.5',
      destinationChain: 'arb',
      destinationAsset: 'nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near',
      destinationTokenSymbol: 'USDC',
      recipientAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      slippageBps: 100,
      network: 'mainnet',
    },
  },
  {
    id: 'swap_list',
    name: 'List Recent Intent Swaps',
    method: 'GET',
    path: '/api/swap',
    description: 'Fetches recent cross-chain settlement intents with pagination and execution states.',
    defaultParams: {
      limit: '5',
    },
  },
  {
    id: 'swap_details',
    name: 'Get Intent Status & Cryptographic Receipt',
    method: 'GET',
    path: '/api/swap/swap_phase2_demo_7f9c21',
    description: 'Returns state machine progression and audit receipt with SHA-256 verification hash.',
  },
  {
    id: 'onramp_quote',
    name: 'Google Pay Shielded On-Ramp Quotes',
    method: 'GET',
    path: '/api/onramp/quote',
    description: 'Calculates real-time Google Pay on-ramp quotes with fee breakdown and estimated shielded ZEC.',
    defaultParams: {
      amount: '200',
      currency: 'USD',
      network: 'google_pay',
    },
  },
  {
    id: 'onramp_orders',
    name: 'List Google Pay Shielded Orders',
    method: 'GET',
    path: '/api/onramp/orders',
    description: 'Returns all settled and pending Google Pay tokenized orders with transaction IDs and shielded destination vaults.',
  },
  {
    id: 'zcash_status',
    name: 'Zcash Live Node & Halo 2 Status',
    method: 'GET',
    path: '/api/zcash/status',
    description: 'Inspects live lightwalletd/Zebra blockchain height, Orchard action verification, and node latency.',
  },
  {
    id: 'defuse_status',
    name: 'NEAR Defuse Solver Vault & Liquidity',
    method: 'GET',
    path: '/api/defuse/status',
    description: 'Monitors on-chain NEAR Intents Defuse solver vault reserves across Arbitrum, Solana, Bitcoin, and NEAR.',
  },
  {
    id: 'google_pay_config',
    name: 'Google Pay Production Gateway Config',
    method: 'GET',
    path: '/api/onramp/google-pay/config',
    description: 'Inspects Google Pay production merchant ID, active gateway tokenization, and readiness.',
  },
  {
    id: 'system_domain',
    name: 'Domain, SSL & DNS Diagnostic',
    method: 'GET',
    path: '/api/system/domain',
    description: 'Checks HTTPS SSL enforcement, custom domain routing, and required DNS A/CNAME records.',
  },
  {
    id: 'security_audit',
    name: 'Cryptographic Security & Padding Audit',
    method: 'GET',
    path: '/api/security/audit',
    description: 'Executes automated cryptographic audit: 512B memo padding, timing safe checks, ZIP-316 rules, and KMS status.',
  },
];

export default function DeveloperPage() {
  return (
    <WalletProvider>
      <EmbeddedWalletProvider>
        <DeveloperPortalContent />
      </EmbeddedWalletProvider>
    </WalletProvider>
  );
}

function DeveloperPortalContent() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'memo' | 'widget' | 'docs'>('sandbox');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  
  // Sandbox State
  const [requestPayload, setRequestPayload] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  // Memo Playground State
  const [memoSwapId, setMemoSwapId] = useState<string>('swp_' + Math.random().toString(36).substring(2, 8));
  const [memoChain, setMemoChain] = useState<string>('arb');
  const [memoToken, setMemoToken] = useState<string>('USDC');
  const [memoRecipient, setMemoRecipient] = useState<string>('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  const [memoSlippage, setMemoSlippage] = useState<number>(100);
  const [memoEncodedHex, setMemoEncodedHex] = useState<string>('');
  const [memoEncodedBase64, setMemoEncodedBase64] = useState<string>('');
  const [memoByteSize, setMemoByteSize] = useState<number>(512);
  const [memoDecodedObj, setMemoDecodedObj] = useState<any | null>(null);
  const [memoDecodeError, setMemoDecodeError] = useState<string | null>(null);
  const [customMemoInput, setCustomMemoInput] = useState<string>('');
  const [copiedMemoHex, setCopiedMemoHex] = useState<boolean>(false);

  // Merchant Widget State
  const [merchantName, setMerchantName] = useState<string>('Nordic VPN Shield');
  const [itemTitle, setItemTitle] = useState<string>('Annual Shielded WireGuard Access');
  const [priceZec, setPriceZec] = useState<number>(0.08);
  const [payoutChain, setPayoutChain] = useState<'arb' | 'sol' | 'zec'>('arb');
  const [payoutAddress, setPayoutAddress] = useState<string>('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

  // URL Query handling for direct tab navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'memo' || tabParam === 'widget' || tabParam === 'docs' || tabParam === 'sandbox') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Update sandbox payload on endpoint switch
  useEffect(() => {
    if (selectedEndpoint.defaultPayload) {
      setRequestPayload(JSON.stringify(selectedEndpoint.defaultPayload, null, 2));
    } else {
      setRequestPayload('');
    }
    setResponseData(null);
    setResponseStatus(null);
    setResponseLatency(null);
  }, [selectedEndpoint]);

  // Execute Memo Serialization
  useEffect(() => {
    try {
      const serialized = serializeIntentMemo({
        swapId: memoSwapId,
        destinationChain: memoChain,
        destinationToken: memoToken,
        recipientAddress: memoRecipient,
        slippageBps: memoSlippage,
        nonce: '0x' + Math.random().toString(16).substring(2, 10),
        timestamp: Date.now(),
      });
      setMemoEncodedHex(serialized.hex);
      setMemoEncodedBase64(serialized.base64);
      setMemoByteSize(serialized.buffer.length);

      // Verify deserialization matches
      const parsed = deserializeIntentMemo(serialized.buffer);
      setMemoDecodedObj(parsed);
      setMemoDecodeError(null);
    } catch (err: any) {
      setMemoDecodeError(err.message);
    }
  }, [memoSwapId, memoChain, memoToken, memoRecipient, memoSlippage]);

  // Execute Sandbox API Call
  const handleExecuteSandbox = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      let url = selectedEndpoint.path;
      if (selectedEndpoint.defaultParams) {
        const query = new URLSearchParams(selectedEndpoint.defaultParams).toString();
        url = `${url}?${query}`;
      }

      let res: Response;
      if (selectedEndpoint.method === 'POST') {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': 'sandbox_' + Date.now(),
          },
          body: requestPayload || '{}',
        });
      } else {
        res = await fetch(url);
      }

      const end = performance.now();
      setResponseLatency(Math.round(end - start));
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseData(json);
    } catch (err: any) {
      const end = performance.now();
      setResponseLatency(Math.round(end - start));
      setResponseStatus(500);
      setResponseData({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurlSnippet = () => {
    let url = typeof window !== 'undefined' ? `${window.location.origin}${selectedEndpoint.path}` : `http://localhost:3000${selectedEndpoint.path}`;
    if (selectedEndpoint.defaultParams) {
      const query = new URLSearchParams(selectedEndpoint.defaultParams).toString();
      url = `${url}?${query}`;
    }

    if (selectedEndpoint.method === 'POST') {
      return `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: idemp_${Date.now()}" \\
  -d '${requestPayload.replace(/\n\s*/g, ' ')}'`;
    }
    return `curl -X GET "${url}"`;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-black transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#080c14]/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/swap"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white px-3.5 py-1.5 rounded-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <ZCrossLogo className="w-7 h-7" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Developer Portal</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700">
                    SDK v1.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800/80 p-1 rounded-full border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'sandbox' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>REST Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('memo')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'memo' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Memo Studio (512B)</span>
            </button>

            <button
              onClick={() => setActiveTab('widget')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'widget' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Merchant SDK</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeTab === 'docs' ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Specification</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="badge" />
            <Link
              href="/swap"
              className="hidden sm:inline-flex text-xs font-semibold px-4 py-2 bg-black dark:bg-amber-500 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-amber-400 rounded-full transition shadow-xs"
            >
              Launch Swap App
            </Link>
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="md:hidden flex items-center justify-between border-t border-gray-100 px-3 py-2 bg-gray-50 text-[11px] font-medium overflow-x-auto gap-1">
          <button 
            onClick={() => setActiveTab('sandbox')}
            className={`py-1 px-2.5 rounded-md ${activeTab === 'sandbox' ? 'bg-black text-white font-bold' : 'text-gray-600'}`}
          >
            REST Sandbox
          </button>
          <button 
            onClick={() => setActiveTab('memo')}
            className={`py-1 px-2.5 rounded-md ${activeTab === 'memo' ? 'bg-black text-white font-bold' : 'text-gray-600'}`}
          >
            Memo Studio
          </button>
          <button 
            onClick={() => setActiveTab('widget')}
            className={`py-1 px-2.5 rounded-md ${activeTab === 'widget' ? 'bg-black text-white font-bold' : 'text-gray-600'}`}
          >
            Merchant SDK
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`py-1 px-2.5 rounded-md ${activeTab === 'docs' ? 'bg-black text-white font-bold' : 'text-gray-600'}`}
          >
            Specs
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ================= TAB 1: REST SANDBOX ================= */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                Interactive REST API Sandbox
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Execute live requests against the local solver consensus service with rate limiting and idempotency inspection.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Endpoint Directory */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 mb-2">
                  Available Endpoints
                </div>
                {API_ENDPOINTS.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      selectedEndpoint.id === endpoint.id
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          endpoint.method === 'POST'
                            ? selectedEndpoint.id === endpoint.id ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-800'
                            : selectedEndpoint.id === endpoint.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="font-semibold text-xs truncate max-w-[200px]">
                          {endpoint.name}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-mono truncate ${
                      selectedEndpoint.id === endpoint.id ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {endpoint.path}
                    </span>
                  </button>
                ))}

                {/* Idempotency Alert Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    Idempotency &amp; Rate Limits
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    All POST intent creation requests accept an <code className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200">Idempotency-Key</code> header to prevent double spend during solver routing. Rate limit: 20 req/min per IP.
                  </p>
                </div>
              </div>

              {/* Right Column: Request Composer & Live Response */}
              <div className="lg:col-span-8 space-y-4">
                {/* Request Header Bar */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      selectedEndpoint.method === 'POST' ? 'bg-amber-400 text-black' : 'bg-black text-white'
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 break-all">
                      {selectedEndpoint.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCurl}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition text-slate-700 cursor-pointer shadow-2xs"
                      title="Copy cURL command"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
                    </button>
                    <button
                      onClick={handleExecuteSandbox}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
                    </button>
                  </div>
                </div>

                {/* Request Body (For POST) */}
                {selectedEndpoint.method === 'POST' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">
                      Request JSON Payload:
                    </label>
                    <textarea
                      value={requestPayload}
                      onChange={(e) => setRequestPayload(e.target.value)}
                      rows={7}
                      className="w-full font-mono text-xs p-3.5 bg-gray-900 text-emerald-400 rounded-2xl border border-gray-700 focus:outline-hidden focus:ring-2 focus:ring-black resize-y"
                    />
                  </div>
                )}

                {/* Live Response Panel */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Response</span>
                      {responseStatus !== null && (
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {responseStatus} {responseStatus === 200 ? 'OK' : 'Response'}
                        </span>
                      )}
                    </div>
                    {responseLatency !== null && (
                      <span className="text-xs font-mono text-gray-500">
                        Roundtrip: <span className="font-bold text-slate-800">{responseLatency}ms</span>
                      </span>
                    )}
                  </div>

                  {responseData ? (
                    <pre className="font-mono text-xs p-3.5 bg-gray-950 text-gray-100 rounded-xl overflow-x-auto max-h-[360px] leading-relaxed border border-gray-800">
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  ) : (
                    <div className="py-12 text-center text-xs text-gray-400 font-mono">
                      Click &ldquo;Send Request&rdquo; to execute live query against solver
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MEMO STUDIO (512 BYTES) ================= */}
        {activeTab === 'memo' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                ZIP-302 / ZIP-321 Memo Studio
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Zero-Knowledge Invariant: All Orchard transaction memos must be padded to precisely 512 bytes with 0x00 to guarantee zero length metadata leakage.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Memo Generator Inputs */}
              <div className="lg:col-span-5 p-5 bg-white border border-gray-200 rounded-3xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-slate-900">Intent Payload Builder</h3>
                  <span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full">
                    {memoByteSize} / 512 Bytes
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Swap ID (8-16 chars):</label>
                    <input
                      type="text"
                      value={memoSwapId}
                      onChange={(e) => setMemoSwapId(e.target.value)}
                      className="w-full font-mono p-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Target Chain:</label>
                      <select
                        value={memoChain}
                        onChange={(e) => setMemoChain(e.target.value)}
                        className="w-full font-medium p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer"
                      >
                        <option value="arb">Arbitrum One (arb)</option>
                        <option value="sol">Solana (sol)</option>
                        <option value="btc">Bitcoin Native (btc)</option>
                        <option value="base">Base L2 (base)</option>
                        <option value="eth">Ethereum (eth)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Token Symbol:</label>
                      <input
                        type="text"
                        value={memoToken}
                        onChange={(e) => setMemoToken(e.target.value)}
                        className="w-full font-mono p-2.5 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Recipient Destination Address:</label>
                    <input
                      type="text"
                      value={memoRecipient}
                      onChange={(e) => setMemoRecipient(e.target.value)}
                      className="w-full font-mono p-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Slippage Tolerance (BPS, 100 = 1%):</label>
                    <input
                      type="number"
                      value={memoSlippage}
                      onChange={(e) => setMemoSlippage(Number(e.target.value))}
                      className="w-full font-mono p-2.5 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(memoEncodedHex);
                      setCopiedMemoHex(true);
                      setTimeout(() => setCopiedMemoHex(false), 2000);
                    }}
                    className="w-full py-2.5 px-4 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedMemoHex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMemoHex ? 'Copied 512-Byte Hex Payload!' : 'Copy 512-Byte Raw Hex'}</span>
                  </button>
                </div>
              </div>

              {/* Memo Inspector & Byte Visualizer */}
              <div className="lg:col-span-7 space-y-4">
                {/* Byte Layout Inspector */}
                <div className="p-5 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">512-Byte Uniform Memory Buffer</h3>
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Zero Metadata Leakage Guaranteed
                    </span>
                  </div>

                  {/* Hex Viewer */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Zero-Padded Hexdump (First 128 Bytes + Null Terminator):
                    </span>
                    <div className="p-3.5 bg-gray-950 text-gray-200 rounded-2xl font-mono text-[11px] leading-relaxed break-all border border-gray-800 max-h-[160px] overflow-y-auto">
                      <span className="text-amber-400 font-bold">{memoEncodedHex.slice(0, 160)}</span>
                      <span className="text-gray-600">0000000000000000000000000000000000000000... (Padded to 1024 hex chars)</span>
                    </div>
                  </div>

                  {/* Simulated Solver IVK Decryption */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Solver Incoming Viewing Key (IVK) Decrypted Payload
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        Protocol Verified: z-intent/v1
                      </span>
                    </div>

                    <pre className="p-3.5 bg-gray-50 text-slate-800 rounded-xl font-mono text-xs border border-gray-200 overflow-x-auto">
                      {JSON.stringify(memoDecodedObj, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MERCHANT SDK ================= */}
        {activeTab === 'widget' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                ZCross Pay — Shielded Checkout Widget
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Drop-in payment button allowing e-commerce websites and dApps to accept ZEC shielded payments or cross-chain settlements in 3 lines of code.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Merchant Configuration Controls */}
              <div className="lg:col-span-5 p-5 bg-white border border-gray-200 rounded-3xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-800" />
                  Merchant Parameter Configurator
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Merchant Store Name:</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full font-medium p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Product / Item Description:</label>
                    <input
                      type="text"
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                      className="w-full font-medium p-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Amount (ZEC):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceZec}
                        onChange={(e) => setPriceZec(parseFloat(e.target.value) || 0)}
                        className="w-full font-mono p-2.5 rounded-xl border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Auto-Settle Into:</label>
                      <select
                        value={payoutChain}
                        onChange={(e) => setPayoutChain(e.target.value as any)}
                        className="w-full font-medium p-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer"
                      >
                        <option value="arb">Arbitrum USDC</option>
                        <option value="sol">Solana SOL</option>
                        <option value="zec">Shielded ZEC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Payout Address (Arbitrum / Solana):</label>
                    <input
                      type="text"
                      value={payoutAddress}
                      onChange={(e) => setPayoutAddress(e.target.value)}
                      className="w-full font-mono p-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                  <div className="font-bold text-slate-900">Zero In-Browser Signing Friction</div>
                  <p>
                    Customers using ZCross in-browser vault pay with 1 click. Mobile customers scan the ZIP-321 QR code via Zashi or YWallet.
                  </p>
                </div>
              </div>

              {/* Live Interactive Widget Demo */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-[440px]">
                  <div className="text-center mb-3">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Live Embedded Customer Checkout Preview
                    </span>
                  </div>
                  <ZCrossPayWidget
                    merchantName={merchantName}
                    itemDescription={itemTitle}
                    amountZec={priceZec}
                    settleChain={payoutChain}
                    settleToken={payoutChain === 'sol' ? 'SOL' : payoutChain === 'zec' ? 'ZEC' : 'USDC'}
                    recipientAddress={payoutAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SPECIFICATION & DOCS ================= */}
        {activeTab === 'docs' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                Protocol Architecture &amp; Developer Specification
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Formal cryptographic invariants governing cross-chain intents over shielded Zcash Orchard.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  1. ZIP-316 Unified Addresses &amp; Orchard Invariant
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  All cross-chain deposit addresses generated by ZCross are ZIP-316 Unified Addresses containing exclusively an Orchard receiver (`pool: orchard`). Transparent receivers (`p2pkh` / `t-addresses`) and Sprout/Sapling receivers are intentionally rejected by consensus rules to guarantee zero transaction-graph leakage.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  2. 512-Byte In-Band Encrypted Memo (ZIP-302)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Destination chains, asset contracts, slippage limits, and recipient addresses are encrypted directly inside the Zcash note memo ciphertext. The payload is null-padded to precisely 512 bytes. Only the decentralized solver cluster holding the corresponding Incoming Viewing Key (IVK) can decrypt the execution payload.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  3. Atomic Solver Settlement Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-slate-900 block">Step 1: Quote</span>
                    <span className="text-gray-500 text-[11px]">15-min guaranteed exchange rate lock</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-slate-900 block">Step 2: Deposit</span>
                    <span className="text-gray-500 text-[11px]">Shielded Orchard note broadcasted</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-slate-900 block">Step 3: Solve</span>
                    <span className="text-gray-500 text-[11px]">IVK decrypts memo; fills destination chain</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-slate-900 block">Step 4: Audit</span>
                    <span className="text-gray-500 text-[11px]">Cryptographic SHA-256 audit receipt issued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
