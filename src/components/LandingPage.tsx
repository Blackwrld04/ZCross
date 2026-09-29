'use client';

import React, { useState } from 'react';
import {
  Menu,
  Globe,
  Apple,
  Send,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  MoreHorizontal,
  Gift,
  Home,
  BarChart2,
  Wallet,
  User,
  BarChart,
  ArrowUpRight,
  Briefcase,
  UserCheck,
  ChevronDown,
  Link as LinkIcon,
  Triangle,
  Mountain,
  Gem,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink,
  Terminal,
  Layers,
  Cpu,
  X,
  ShieldCheck,
  Key,
} from 'lucide-react';

interface LandingPageProps {
  onOpenWallet: () => void;
  onOpenAuditor?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWallet, onOpenAuditor }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-slate-900 antialiased selection:bg-black selection:text-white font-sans min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer lg:hidden"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>

            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 font-semibold text-xl tracking-tight cursor-pointer"
              title="ZCross - Return to Top"
            >
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="tracking-tight font-bold text-2xl">ZCross</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600 ml-4">
              <button
                onClick={() => document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition cursor-pointer"
              >
                Invariants Audit
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition cursor-pointer"
              >
                Architecture
              </button>
              <button
                onClick={() => document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition cursor-pointer"
              >
                Corridors
              </button>
              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition cursor-pointer"
              >
                FAQ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onOpenWallet}
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black py-2 cursor-pointer"
            >
              Invariants Audit
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black py-2 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black py-2 cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black py-2 cursor-pointer"
            >
              Corridors
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black py-2 cursor-pointer"
            >
              FAQ
            </button>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 text-center cursor-pointer"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-slate-900">
            SHIELDED LIQUIDITY<br />
            WITHOUT BOUNDARIES
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Swap directly from Zcash Orchard into Arbitrum USDC, Solana SOL, and Bitcoin without ever unshielding on the way through. Powered by 512-byte encrypted memos and the NEAR Intents protocol.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all w-full sm:w-auto justify-center shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              Launch App
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('audit-invariants');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all w-full sm:w-auto justify-center cursor-pointer shadow-sm hover:shadow"
            >
              <Shield className="w-5 h-5 text-emerald-600" />
              Audit Zero-Leak Invariants
            </button>
          </div>
        </div>

        {/* Phone & Background Text */}
        <div className="relative max-w-7xl mx-auto mt-[-40px]">
          {/* Giant Background Text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span className="text-[12rem] md:text-[18rem] font-bold text-gray-100 opacity-90 tracking-tighter whitespace-nowrap">
              ZCROSS
            </span>
          </div>

          {/* Phone Mockup */}
          <div className="relative z-10 flex justify-center transform translate-y-12">
            <div className="relative w-[300px] md:w-[350px] bg-black rounded-[3rem] p-3 shadow-2xl ring-1 ring-gray-900/10">
              <div className="rounded-[2.5rem] overflow-hidden bg-gray-950 h-[650px] relative text-white flex flex-col justify-between border border-gray-800">
                {/* Simulated App UI */}
                <div className="p-6 pt-12">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-xs">
                        🛡️
                      </div>
                      <span className="text-xs font-mono text-amber-400 font-bold">ORCHARD HALO 2</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                      ⚡
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Shielded ZEC Balance</div>
                    <div className="text-4xl font-semibold tracking-tight">$24,850.42</div>
                    <div className="text-xs text-emerald-400 mt-1 font-mono">17.50000000 ZEC • 0 Leaks</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="flex flex-col items-center gap-2 select-none group">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300">
                        <ArrowUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400">Shield</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 select-none group">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300">
                        <ArrowDown className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400">Receive</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 select-none group">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center shadow-lg">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-amber-400 font-semibold">Swap</span>
                    </div>

                    <div
                      onClick={() => {
                        const el = document.getElementById('audit-invariants');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      title="Inspect Cryptographic Invariants"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition text-gray-300">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition">Audit</span>
                    </div>
                  </div>

                  {/* Shielded Asset Card */}
                  <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-white/10 select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-neutral-950 font-bold shadow">
                        Z
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Zcash Orchard</div>
                        <div className="text-xs text-gray-400">Pure Shielded Pool</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">17.50 ZEC</div>
                        <div className="text-xs text-emerald-400">+12.5% vs last mo</div>
                      </div>
                    </div>
                  </div>

                  {/* Cross-chain Callout */}
                  <div className="bg-gradient-to-r from-emerald-950/70 to-neutral-900 rounded-2xl p-4 border border-emerald-800/40 select-none">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-emerald-400 text-sm mb-1">NEAR Intents 1Click</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Guaranteed quotes to Arbitrum USDC &amp; Solana via 512-byte encrypted memos.
                        </p>
                      </div>
                      <Zap className="text-amber-400 w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-20 bg-gray-950/90 backdrop-blur border-t border-gray-800 flex justify-around items-center px-4 select-none">
                  <div className="text-amber-400 p-2">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="text-gray-500 p-2">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <div className="text-gray-500 p-2">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div
                    onClick={() => {
                      const el = document.getElementById('audit-invariants');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-500 hover:text-emerald-400 p-2 cursor-pointer transition"
                    title="Inspect Cryptographic Invariants"
                  >
                    <Shield className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-12">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <BarChart className="w-4 h-4" />
              ZCross in Numbers
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-center tracking-tight mb-16 max-w-2xl mx-auto text-slate-900">
            Engineered for pure privacy,<br />
            verified by zero-knowledge math
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2 text-emerald-600">0</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Transparent Hops<br />(Zero-Leak Invariant)
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">512B</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Uniform Padded Memo<br />(No Size Leaks)
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">&lt; 90s</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Cross-Chain Solver<br />Fulfillment Time
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">5+</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Connected Corridors<br />(Arb, Sol, BTC, Eth, Base)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero-Leak Security Invariants & Cryptographic Audit Section */}
      <section id="audit-invariants" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Cryptographic Invariants &amp; Audit
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
              Zero-Leak Security Invariants
            </h2>
            <p className="text-gray-400 font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Mathematical verification of pure Orchard isolation, uniform 512-byte memo padding, and non-custodial solver atomic fulfillment.
            </p>
          </div>

          {/* 4 Invariant Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* 1. Pure Shielded Isolation */}
            <div className="bg-neutral-900/80 rounded-2xl p-7 border border-emerald-500/30 shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 font-mono">Invariant 01</div>
                <h3 className="text-xl font-semibold text-white mb-3">Pure Shielded Isolation</h3>
                <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
                  Strict enforcement of pure shielded pools with zero transparent address exposure or linkability.
                </p>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero transparent addresses (t-addr) accepted or routed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Pure Orchard pool (ZIP 316 Unified Addresses only)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Halo 2 recursive zero-knowledge proving system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero transaction graph linkability between parties</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                <span>ORCHARD_HALO2</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>

            {/* 2. Metadata Defense */}
            <div className="bg-neutral-900/80 rounded-2xl p-7 border border-amber-400/30 shadow-lg hover:border-amber-400/50 transition-all flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 font-mono">Invariant 02</div>
                <h3 className="text-xl font-semibold text-white mb-3">Constant-Length Memos</h3>
                <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
                  Eliminates network packet sniffing and byte-length side-channels with uniform constant padding.
                </p>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>In-band ChaCha20-Poly1305 note ciphertexts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Exact 512-byte uniform padding eliminates size leaks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Destination chains and tokens hidden from observers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Forward secrecy guaranteed across all note transfers</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-amber-400 font-mono">
                <span>MEMO_512B_PAD</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>

            {/* 3. Non-Custodial Solvers */}
            <div className="bg-neutral-900/80 rounded-2xl p-7 border border-cyan-400/30 shadow-lg hover:border-cyan-400/50 transition-all flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 font-mono">Invariant 03</div>
                <h3 className="text-xl font-semibold text-white mb-3">Non-Custodial Solvers</h3>
                <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
                  Decentralized intent fulfillment network eliminating central bridges and smart contract honeypots.
                </p>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Direct integration with NEAR Intents 1Click protocol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Ed25519-signed guaranteed execution rate quotes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Automated timeout detection and shielded refund fallbacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Zero wrapped tokens or vulnerable bridge escrow pools</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                <span>NEAR_DEFUSE_1CLICK</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>

            {/* 4. Verifiable Receipts */}
            <div className="bg-neutral-900/80 rounded-2xl p-7 border border-fuchsia-400/30 shadow-lg hover:border-fuchsia-400/50 transition-all flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-fuchsia-400/20 text-fuchsia-400 flex items-center justify-center mb-4">
                  <Key className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-1 font-mono">Invariant 04</div>
                <h3 className="text-xl font-semibold text-white mb-3">Verifiable Audit Receipts</h3>
                <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
                  Cryptographic proofs of execution allowing selective disclosure for accounting without spending leaks.
                </p>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                    <span>Cryptographic audit receipt generated for every swap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                    <span>Viewing Key fingerprints for tax and audit compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                    <span>Spending authority remains 100% private and protected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                    <span>Independently verifiable across on-chain block explorers</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-fuchsia-400 font-mono">
                <span>AUDIT_PROOF_V1</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Invariant Assertion Summary */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base mb-1">
                  Automated Invariant Assertion Engine
                </h4>
                <p className="text-gray-400 text-xs md:text-sm font-light">
                  Every transaction is validated before fulfillment: Zero Transparent Hops, 512B Padded In-Band Memo, and NEAR Intents Atomic Settlement.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3.5 py-2 rounded-lg whitespace-nowrap font-bold">
                ✓ 4/4 INVARIANTS PASSED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900">
              Zero-leak cross-chain architecture at every step
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 font-light mb-4 text-sm leading-relaxed">
                Traditional bridges force users into transparent addresses, permanently leaking transaction graphs. ZCross preserves pure Orchard shielding from end to end.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('audit-invariants');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-600 font-medium text-sm hover:text-emerald-700 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE PRIVACY SPECIFICATIONS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block mb-2">ZIP 316 Standard</span>
                <h3 className="text-2xl font-semibold mb-3">Pure Unified Addresses</h3>
                <p className="text-gray-500 font-light text-sm">
                  Requires <code className="bg-gray-200 px-1 py-0.5 rounded text-slate-800">u1...</code> Unified Addresses with Orchard receivers. Transparent <code className="bg-gray-200 px-1 py-0.5 rounded text-slate-800">t-addresses</code> are rejected to ensure privacy integrity.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="relative w-48 h-48 bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full blur-xl opacity-50"></div>
                <div className="w-44 h-44 rounded-2xl bg-white shadow-lg border border-amber-100 flex flex-col items-center justify-center p-4 text-center transform group-hover:scale-105 transition-transform">
                  <Shield className="w-12 h-12 text-amber-500 mb-2" />
                  <span className="text-xs font-bold text-slate-800">Orchard Halo 2</span>
                  <span className="text-[10px] text-gray-500">Recursive ZK Proving</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between border border-gray-100/80">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block mb-2">Cryptographic Padding</span>
                <h3 className="text-2xl font-semibold mb-3">In-Band 512B Encrypted Memos</h3>
                <p className="text-gray-500 font-light text-sm">
                  Intent parameters are encrypted inside ChaCha20-Poly1305 note ciphertexts with uniform 512-byte padding to prevent packet-size side-channels.
                </p>
              </div>
              <div className="mt-auto h-40 w-full flex flex-col items-center justify-center">
                <div className="w-full bg-neutral-900 rounded-xl p-3 text-xs font-mono text-emerald-400 shadow-inner">
                  <div className="text-[10px] text-gray-500 mb-1">// 512-byte padded memo</div>
                  <div className="truncate">eyJwcm90b2NvbCI6InotaW50ZW50I...</div>
                  <div className="text-[10px] text-amber-400 mt-1">✓ Length: 512.000 Bytes (Uniform)</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-wider block mb-2">NEAR Intents Integration</span>
                <h3 className="text-2xl font-semibold mb-3">Decentralized Solver Network</h3>
                <p className="text-gray-500 font-light text-sm">
                  Independent solvers scan compact block filters, verify note commitments, and execute atomic settlements on Arbitrum, Solana, and Bitcoin.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="w-40 h-40 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-3 text-center transform group-hover:-translate-y-2 transition-transform">
                  <Zap className="w-10 h-10 text-cyan-500 mb-2" />
                  <span className="text-xs font-bold text-slate-800">1Click API</span>
                  <span className="text-[10px] text-gray-500">Atomic Solver Fill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="border-t border-b border-gray-100 py-12">
            <p className="text-center text-sm text-gray-400 mb-8 font-light">
              Built on battle-tested <span className="font-medium text-gray-900">Zcash &amp; Cross-Chain standards</span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <Shield className="w-5 h-5 text-amber-500" /> Zcash Orchard
              </span>
              <div className="flex items-center gap-2 font-semibold">
                <LinkIcon className="w-5 h-5 text-cyan-500" /> NEAR Intents
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Triangle className="w-5 h-5 text-purple-500" /> Defuse Protocol
              </div>
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <Mountain className="w-5 h-5 text-emerald-500" /> Halo 2 Proving
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Gem className="w-5 h-5 text-blue-500" /> ZIP 316 / 321
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Ecosystem Section */}
      <section id="ecosystem" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 uppercase text-slate-900">
              Ecosystem Components
            </h2>
            <p className="text-gray-500 font-light text-lg">
              Two integrated tools connecting shielded Zcash liquidity to external chains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Wallet Card (Dark) */}
            <div className="bg-gray-950 rounded-[2.5rem] p-10 md:p-14 min-h-[500px] relative overflow-hidden text-white flex flex-col justify-end shadow-xl border border-gray-800">
              <div className="absolute top-8 right-8">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3.5 py-1.5 rounded-full">
                  Client Interface
                </span>
              </div>
              <div className="relative z-10 pt-20">
                <h3 className="text-3xl font-semibold mb-3">Desktop Shielded Wallet</h3>
                <p className="text-gray-400 font-light text-lg leading-relaxed">
                  Generate ZIP 321 payment request URIs and QR codes, inspect ChaCha20 encrypted memos, monitor live block heights, and review verifiable audit receipts.
                </p>
              </div>
            </div>

            {/* Solver Daemon Card (Light) */}
            <div className="bg-gray-50 rounded-[2.5rem] p-10 md:p-14 min-h-[500px] relative overflow-hidden flex flex-col justify-end shadow-md border border-gray-100">
              <div className="absolute top-8 right-8">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                  Automated Daemon
                </span>
              </div>
              <div className="relative z-10 pt-20">
                <h3 className="text-3xl font-semibold mb-3 text-slate-900">Headless Solver Watcher</h3>
                <p className="text-gray-500 font-light text-lg leading-relaxed">
                  CLI daemon (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded text-slate-800">npm run solver</code>) scanning Orchard compact block filters, validating commitments, and dispatching execution intents to NEAR market makers.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
              One unified platform to move shielded value without publishing who paid whom
            </h3>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="solutions" className="py-24 bg-emerald-50/30 border-t border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 bg-white border border-gray-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <Briefcase className="w-4 h-4" />
              Business Solutions
            </span>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">
              Seamless Cross-Chain Settlements for DApps &amp; DAOs
            </h2>
            <p className="text-gray-500 font-light text-lg max-w-2xl mx-auto">
              Accept shielded ZEC payments and settle automatically into Arbitrum USDC, Solana, or Bitcoin with zero sender balance exposure.
            </p>
            <div className="mt-8">
              <button
                onClick={() => {
                  const el = document.getElementById('developer-api');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
              >
                Explore Developer API
              </button>
            </div>
          </div>

          {/* Business UI Grid */}
          <div id="developer-api" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mockup Left */}
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex flex-col">
              <div className="text-xs text-gray-400 uppercase mb-2">Settlement Vault</div>
              <div className="bg-gray-50 p-2 rounded mb-4 text-sm font-medium">Orchard Payroll Pool</div>
              <div className="text-xs text-gray-400 uppercase mb-2">Supported Corridors</div>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200 font-medium">
                  ZEC (Shielded)
                </span>
                <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full border border-cyan-200 font-medium">
                  USDC (Arb)
                </span>
              </div>
              <div className="mt-auto h-2 bg-gray-100 rounded w-1/2"></div>
            </div>

            {/* Middle (API) */}
            <div className="md:col-span-6 bg-emerald-50/50 rounded-3xl p-10 text-center border border-emerald-100 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-3xl font-semibold mb-4 text-slate-900">Developer API</h3>
              <p className="text-gray-500 font-light mb-8 text-sm">
                Initiate shielded intent swaps and track SSE state changes with clean TypeScript bindings
              </p>
              <div className="w-full max-w-md bg-gray-900 rounded-xl p-4 text-left shadow-lg">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <code className="text-xs font-mono text-emerald-400 block leading-relaxed">
                  const solver = new ZCross(&#123;<br />
                  &nbsp;&nbsp;network: 'mainnet',<br />
                  &nbsp;&nbsp;privacy: 'pure-orchard'<br />
                  &#125;);<br />
                  const quote = await solver.createIntent(&#123; amountZec: 1.0 &#125;);
                </code>
              </div>
            </div>

            {/* Mockup Right */}
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-black text-amber-400 flex items-center justify-center font-bold text-xs">
                  🛡️
                </div>
                <div>
                  <div className="text-sm font-semibold">Watcher Daemon</div>
                  <div className="text-xs text-gray-400">compact-block-stream</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 uppercase mb-2">Solver Status</div>
              <div className="flex items-center gap-2 text-xs font-medium bg-gray-50 p-2 rounded justify-between mb-4">
                <span>Online &amp; Indexing</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('audit-invariants');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded font-medium transition cursor-pointer"
              >
                Inspect Invariants &amp; Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Earn Section */}
      <section id="corridors" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900">
              Active Cross-Chain Liquidity Corridors
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 font-light mb-4 text-sm">
                Convert private ZEC into native tokens across EVM, Solana, and Bitcoin ecosystems at guaranteed market rates.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('corridors-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-600 font-medium text-sm hover:text-emerald-700 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE ALL CORRIDORS
              </button>
            </div>
          </div>

          <div id="corridors-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arbitrum Corridor */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between border border-gray-100/80">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8 opacity-90 pb-2">
                <div className="bg-white p-4 rounded-xl shadow-sm min-w-[140px] border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center text-xs font-bold">
                      Z
                    </div>
                    <span className="font-bold text-sm">ZEC</span>
                  </div>
                  <div className="text-lg font-semibold">$1,420.00</div>
                  <div className="text-xs text-emerald-500 font-medium">+14.2%</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md min-w-[140px] transform scale-105 border border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                      $
                    </div>
                    <span className="font-bold text-sm">USDC (Arb)</span>
                  </div>
                  <div className="text-lg font-semibold">$1.00</div>
                  <div className="text-xs text-emerald-500 font-medium">Sub-minute Fill</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Arbitrum One USDC</h3>
                <p className="text-gray-500 font-light text-sm">
                  Instant settlement on Arbitrum One via NEAR Intents market makers. Zero slippage guaranteed by Ed25519 quotes.
                </p>
              </div>
            </div>

            {/* Solana Corridor */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="flex justify-center mt-4">
                <div className="bg-gray-900 w-56 h-48 rounded-t-3xl border-4 border-gray-800 p-4 text-white shadow-2xl">
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>Orchard Deposit</span>
                    <span className="text-purple-400 font-medium">Solana Fill</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                        <span className="font-medium">SOL Native</span>
                      </div>
                      <span className="text-emerald-400 text-xs font-semibold">11.82 SOL / ZEC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-gray-50 pt-6">
                <h3 className="text-2xl font-semibold mb-2">Solana Native (SOL)</h3>
                <p className="text-gray-500 font-light text-sm">
                  Sub-second Solana payouts directly into your Phantom or Backpack address without linking your Zcash wallet.
                </p>
              </div>
            </div>

            {/* Bitcoin Native Corridor */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="flex justify-center mt-4 ml-24">
                <div className="bg-black w-56 h-48 rounded-tl-3xl border-l-4 border-t-4 border-gray-800 p-4 text-white shadow-2xl relative">
                  <h4 className="text-center font-medium mb-4 text-sm">Bitcoin Output</h4>
                  <div className="bg-gray-800 rounded-lg p-3 mb-2 flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div> BTC
                    </span>
                    <span className="font-semibold text-emerald-400">SegWit / Taproot</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-6">
                <h3 className="text-2xl font-semibold mb-2">Native Bitcoin (BTC)</h3>
                <p className="text-gray-500 font-light text-sm">
                  Route shielded ZEC into self-custodial on-chain Bitcoin transactions via automated solver payment channels.
                </p>
              </div>
            </div>

            {/* Audit & Compliance */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="flex justify-center items-center py-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 w-64 text-center">
                  <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800">Viewing Key Proofs</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-mono">ivk_fp_0e44ee45af8b8159</div>
                  <div className="bg-emerald-50 text-emerald-700 text-center py-1.5 rounded-lg text-xs font-bold mt-2">
                    Verified Zero Leak
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Zero-Knowledge Audit Receipts</h3>
                <p className="text-gray-500 font-light text-sm">
                  Prove legal origin of funds to accountants and auditors via Viewing Keys without compromising private spending authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <UserCheck className="w-4 h-4" />
              Trusted by people
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-center tracking-tight mb-16 text-slate-900">
            Real Stories, Real Experience<br />
            with ZCross
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  M
                </div>
                <div>
                  <div className="font-semibold text-sm">Max</div>
                  <div className="text-xs text-gray-400">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "I use ZCross for private cross-chain swaps. The speed and zero-leak shielded architecture are unmatched. Fast, solid, and reliable."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                  AA
                </div>
                <div>
                  <div className="font-semibold text-sm">Alex A.</div>
                  <div className="text-xs text-gray-400">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "Fast. Solid. Easy to use. That's how I'd sum up ZCross's philosophy. If you're looking for seamless, private cross-chain liquidity, this is the one I recommend!"
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  E
                </div>
                <div>
                  <div className="font-semibold text-sm">Elena R.</div>
                  <div className="text-xs text-gray-400">DeFi Operator</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "Great reliable exchanger wallet with instant settlement to Arbitrum and Solana. Fully automatic and zero metadata exposure."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">FAQ</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Technical details regarding Zcash Orchard shielding, memo encryption, and NEAR Intents solver execution.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            {[
              {
                q: 'Why is ZCross guaranteed zero-leak?',
                a: 'Traditional cross-chain bridges require depositing to a transparent address (t-addr) before bridging, permanently linking your shielded identity to an on-chain cluster. ZCross accepts deposits exclusively into Orchard Unified Addresses (u1...). The cross-chain destination, token, and recipient are encrypted inside the 512-byte memo field, ensuring zero sender graph or destination details are revealed on the Zcash blockchain.',
              },
              {
                q: 'Why are memos padded uniformly to 512 bytes?',
                a: 'Variable-length memos leak packet metadata and allow external eavesdroppers to infer recipient address types or destination chains based on byte length. By uniformly padding all memos to exactly 512 bytes using zero-byte constant buffers, we eliminate size-leakage side-channels completely.',
              },
              {
                q: 'How does the NEAR Intents 1Click protocol work?',
                a: 'We query guaranteed, Ed25519-signed exchange rate quotes from the NEAR Intents (Chain Defuser) protocol. Solvers monitor our compact block watcher for confirmed Orchard notes and fulfill the destination chain transfer (e.g., Arbitrum USDC) atomically from their own liquidity.',
              },
              {
                q: 'Which Zcash wallets are compatible?',
                a: 'Any wallet supporting the ZIP 321 Payment Request standard and Orchard Unified Addresses, such as Zashi, Zodl, or Ycash. You simply scan the generated QR code and send the shielded note with the pre-filled memo.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 cursor-pointer border border-gray-100 hover:border-gray-200 transition"
                onClick={() => toggleFaq(i)}
              >
                <div className="flex justify-between items-center font-medium list-none text-slate-900">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === i ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </div>
                {openFaq === i && (
                  <div className="text-gray-600 mt-4 text-sm font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight mb-6">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span>ZCross Protocol</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Zero-leak shielded cross-chain bridge and solver daemon connecting Zcash Orchard to external ecosystems.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Terminal className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="https://zips.z.cash"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Layers className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Specifications</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li>
                  <a href="https://zips.z.cash/zip-0316" target="_blank" rel="noreferrer" className="hover:text-black transition">
                    ZIP 316: Unified Addresses
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/zip-0321" target="_blank" rel="noreferrer" className="hover:text-black transition">
                    ZIP 321: Payment Requests
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/protocol/protocol.pdf" target="_blank" rel="noreferrer" className="hover:text-black transition">
                    Halo 2 Zero-Knowledge Proofs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Ecosystem</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li>
                  <a href="https://docs.near-intents.org" target="_blank" rel="noreferrer" className="hover:text-black transition">
                    NEAR Intents Documentation
                  </a>
                </li>
                <li>
                  <a href="https://chaindefuser.com" target="_blank" rel="noreferrer" className="hover:text-black transition">
                    Defuse Protocol (1Click)
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('audit-invariants');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-black transition text-left cursor-pointer"
                  >
                    Privacy Auditor &amp; Invariants
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Products</h4>
              <div className="space-y-3">
                <button
                  onClick={onOpenWallet}
                  className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all w-full cursor-pointer shadow-sm"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Launch App
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('audit-invariants');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-all w-full cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Audit Invariants
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-xs text-gray-400 font-light">
            <div className="flex gap-6 mb-4 md:mb-0">
              <span>Pure Orchard Invariant: Verified</span>
              <span>Open Source: MIT / Apache 2.0</span>
              <span>Decentralized Liquidity Protocol</span>
            </div>
            <div>
              <span>Zero-Leak Cryptographic Invariant Guarded</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
