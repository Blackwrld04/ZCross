'use client';

import React, { useState } from 'react';
import { AuraGlowBackground } from './AuraGlowBackground';
import {
  Menu,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Home,
  Wallet,
  ArrowUpRight,
  ChevronDown,
  Link as LinkIcon,
  Triangle,
  Mountain,
  Gem,
  Shield,
  Zap,
  CheckCircle2,
  Terminal,
  Layers,
  X,
  Plus,
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
    <div className="bg-black text-white antialiased selection:bg-amber-400 selection:text-black font-geist min-h-screen relative overflow-x-hidden">
      {/* Interactive Glowing Aurora Background (Fluid Canvas + UnicornStudio + Luminescent Bloom) */}
      <AuraGlowBackground />

      {/* Mid & Lower Page Ambient Glowing Radial Highlights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[800px] right-[-200px] w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_70%)] blur-3xl"></div>
        <div className="absolute top-[1800px] left-[-200px] w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(168,85,247,0.1),transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[550px] bg-[radial-gradient(ellipse_at_bottom,rgba(244,183,40,0.09),transparent_70%)] blur-2xl"></div>
      </div>

      {/* Mid & Lower Page Ambient Glowing Radial Highlights */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[800px] right-[-200px] w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(56,189,248,0.1),transparent_70%)] blur-3xl"></div>
        <div className="absolute top-[1800px] left-[-200px] w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(168,85,247,0.09),transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[550px] bg-[radial-gradient(ellipse_at_bottom,rgba(244,183,40,0.08),transparent_70%)] blur-2xl"></div>
      </div>

      {/* Header & Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer lg:hidden text-white/80"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 font-semibold text-xl tracking-tight cursor-pointer group"
              title="ZCross - Return to Top"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 p-[1px] shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="tracking-tighter font-bold text-2xl text-white">ZCross</span>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 font-mono font-medium">
                ORCHARD
              </span>
            </div>

            {/* Desktop Floating Pill Navigation */}
            <nav className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-xl gap-1 shadow-inner ml-4">
              <button
                onClick={() => document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                Invariants Audit
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                Architecture
              </button>
              <button
                onClick={() => document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                Corridors
              </button>
              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Launch App Button in Nav */}
          <div className="flex items-center gap-3">
            <div className="relative inline-block group text-xs rounded-full">
              <button
                onClick={onOpenWallet}
                className="relative z-10 overflow-hidden transition-[transform] duration-150 ease-out active:scale-[0.98] text-white bg-neutral-900/90 border border-white/20 px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] text-xs rounded-full cursor-pointer hover:border-amber-400/50"
              >
                <span className="relative z-10 inline-flex items-center gap-2 font-medium text-xs rounded-full">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Launch App
                </span>
                <span className="pointer-events-none absolute bottom-0 left-1/2 right-1/2 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 transition-[left,right] duration-500 ease-out group-hover:left-0 group-hover:right-0 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-neutral-950/95 px-6 py-4 space-y-3 backdrop-blur-2xl shadow-2xl">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-white py-2 cursor-pointer"
            >
              Invariants Audit
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-white py-2 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-white py-2 cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-white py-2 cursor-pointer"
            >
              Corridors
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-white py-2 cursor-pointer"
            >
              FAQ
            </button>
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black py-2.5 rounded-full text-sm font-semibold hover:brightness-110 text-center cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 relative">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-medium text-white/90">Zero-Leak Shielded Liquidity</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-white max-w-5xl mx-auto">
            SHIELDED LIQUIDITY<br />
            WITHOUT BOUNDARIES
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Swap directly from Zcash Orchard into Arbitrum USDC, Solana SOL, and Bitcoin without ever unshielding on the way through. Powered by 512-byte encrypted memos and the NEAR Intents protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Dual-layer animated Launch App button */}
            <button
              onClick={onOpenWallet}
              className="group relative inline-flex min-w-[170px] cursor-pointer transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] hover:-translate-y-[3px] hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden font-semibold text-neutral-300 tracking-tight bg-neutral-900 border border-neutral-700 rounded-full px-7 py-3.5 items-center justify-center w-full sm:w-auto"
            >
              <span className="relative z-10 font-medium rounded-full transition-all duration-500 ease-out group-hover:transform group-hover:translate-y-8 group-hover:opacity-0 group-hover:blur-md flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                Launch App
              </span>
              <span className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ease-in-out transform -translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-none font-medium opacity-0 rounded-full blur-md text-white gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Open Wallet
              </span>
              <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] group-hover:opacity-80 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full blur-[2px]"></span>
              <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[100%] group-hover:opacity-60 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] pointer-events-none bg-gradient-to-t from-amber-400/10 via-white/5 to-transparent rounded-full"></span>
            </button>

            {/* Audit button */}
            <button
              onClick={() => {
                const el = document.getElementById('audit-invariants');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 hover:bg-white/10 text-sm sm:text-base font-medium text-white/90 bg-white/5 border border-white/10 rounded-full px-6 py-3.5 backdrop-blur-xl transition shadow-sm hover:border-white/20 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Audit Zero-Leak Invariants
            </button>
          </div>
        </div>

        {/* Phone & Background Text - Landing Page Wallet Dashboard Preview */}
        <div className="relative max-w-7xl mx-auto mt-[-30px]">
          {/* Giant Background Text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span className="text-[12rem] md:text-[19rem] font-bold text-white/[0.03] tracking-tighter whitespace-nowrap">
              ZCROSS
            </span>
          </div>

          {/* Ambient Glow behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-cyan-500/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          {/* Phone Mockup Frame */}
          <div className="relative z-10 flex justify-center transform translate-y-8">
            <div className="relative w-[320px] md:w-[370px] bg-neutral-950/90 rounded-[3.2rem] p-3.5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] border border-white/15 backdrop-blur-2xl ring-1 ring-white/10">
              {/* Inner Screen */}
              <div className="rounded-[2.6rem] overflow-hidden bg-black/90 h-[670px] relative text-white flex flex-col justify-between border border-white/10 shadow-inner">
                {/* Simulated App UI */}
                <div className="p-6 pt-10">
                  {/* Dynamic Top Bar */}
                  <div className="flex justify-between items-center mb-7">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xs">
                        🛡️
                      </div>
                      <span className="text-[11px] font-mono text-amber-300 font-bold tracking-wider">
                        ORCHARD HALO 2
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-amber-400 shadow-sm">
                      ⚡
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="text-center mb-7">
                    <div className="text-white/40 text-[11px] mb-1 uppercase tracking-widest font-medium">
                      Shielded ZEC Balance
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-white">$24,850.42</div>
                    <div className="text-xs text-emerald-400 mt-1.5 font-mono flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>17.50000000 ZEC • 0 Leaks</span>
                    </div>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-7">
                    <div className="flex flex-col items-center gap-1.5 select-none group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white/10 transition">
                        <ArrowUp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-white/60">Shield</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 select-none group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white/10 transition">
                        <ArrowDown className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-white/60">Receive</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 select-none group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-neutral-950 font-bold flex items-center justify-center shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-amber-300 font-semibold">Swap</span>
                    </div>

                    <div
                      onClick={() => {
                        const el = document.getElementById('audit-invariants');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group"
                      title="Inspect Cryptographic Invariants"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/50 group-hover:text-emerald-300 transition">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-white/60 group-hover:text-white transition">Audit</span>
                    </div>
                  </div>

                  {/* Shielded Asset Card */}
                  <div className="bg-white/5 rounded-2xl p-4 mb-3 border border-white/10 backdrop-blur-xl select-none hover:border-white/20 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-400/20">
                        Z
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white">Zcash Orchard</div>
                        <div className="text-xs text-white/50">Pure Shielded Pool</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-white">17.50 ZEC</div>
                        <div className="text-xs text-emerald-400">+12.5% vs last mo</div>
                      </div>
                    </div>
                  </div>

                  {/* Cross-chain Callout */}
                  <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900/60 to-black rounded-2xl p-4 border border-emerald-500/20 select-none">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-400 text-sm mb-1">NEAR Intents 1Click</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Guaranteed quotes to Arbitrum USDC &amp; Solana via 512-byte encrypted memos.
                        </p>
                      </div>
                      <Zap className="text-amber-400 w-5 h-5 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </div>

                {/* Bottom Simulated Nav */}
                <div className="h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-4 select-none">
                  <div className="text-amber-400 p-2">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="text-white/40 hover:text-white transition p-2">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div className="text-white/40 hover:text-white transition p-2">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div
                    onClick={() => {
                      const el = document.getElementById('audit-invariants');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white/40 hover:text-emerald-400 p-2 cursor-pointer transition"
                    title="Inspect Cryptographic Invariants"
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white max-w-2xl mx-auto">
              Engineered for pure privacy,<br />
              verified by zero-knowledge math
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
              <div className="text-center md:border-r border-white/10 p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-emerald-400 tracking-tight">0</div>
                <div className="text-white/60 font-normal text-sm md:text-base leading-snug">
                  Transparent Hops<br />(Zero-Leak Invariant)
                </div>
              </div>
              <div className="text-center md:border-r border-white/10 p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white tracking-tight">512B</div>
                <div className="text-white/60 font-normal text-sm md:text-base leading-snug">
                  Uniform Padded Memo<br />(No Size Leaks)
                </div>
              </div>
              <div className="text-center md:border-r border-white/10 p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400 tracking-tight">&lt; 90s</div>
                <div className="text-white/60 font-normal text-sm md:text-base leading-snug">
                  Cross-Chain Solver<br />Fulfillment Time
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-cyan-400 tracking-tight">5+</div>
                <div className="text-white/60 font-normal text-sm md:text-base leading-snug">
                  Connected Corridors<br />(Arb, Sol, BTC, Eth, Base)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero-Leak Security Invariants & Cryptographic Audit Section */}
      <section id="audit-invariants" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mathematical Invariants</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-white">
              Zero-Leak Security Invariants
            </h2>
            <p className="text-white/70 font-normal text-base sm:text-lg max-w-2xl mx-auto">
              Mathematical verification of pure Orchard isolation, uniform 512-byte memo padding, and non-custodial solver atomic fulfillment.
            </p>
          </div>

          {/* 4 Invariant Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Pure Shielded Isolation */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
                    ZIP 316
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Pure Shielded Isolation</h3>
                <p className="text-xs text-white/60 font-normal mb-6 leading-relaxed">
                  Strict enforcement of pure shielded pools with zero transparent address exposure or linkability.
                </p>
                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero transparent addresses (t-addr) accepted or routed</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Pure Orchard pool (ZIP 316 Unified Addresses only)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Halo 2 recursive zero-knowledge proving system</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero transaction graph linkability between parties</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. Metadata Defense */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-200">
                    512B UNIFORM
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Constant-Length Memos</h3>
                <p className="text-xs text-white/60 font-normal mb-6 leading-relaxed">
                  Eliminates network packet sniffing and byte-length side-channels with uniform constant padding.
                </p>
                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>In-band ChaCha20-Poly1305 note ciphertexts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Exact 512-byte uniform padding eliminates size leaks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Destination chains and tokens hidden from observers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Forward secrecy guaranteed across all note transfers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Non-Custodial Solvers */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/15 px-2.5 py-0.5 text-[11px] font-medium text-cyan-200">
                    NEAR INTENTS
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Non-Custodial Solvers</h3>
                <p className="text-xs text-white/60 font-normal mb-6 leading-relaxed">
                  Decentralized intent fulfillment network eliminating central bridges and smart contract honeypots.
                </p>
                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Direct integration with NEAR Intents 1Click protocol</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Ed25519-signed guaranteed execution rate quotes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Automated timeout detection and shielded refund fallbacks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Zero wrapped tokens or vulnerable bridge escrow pools</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Verifiable Receipts */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-400/15 px-2.5 py-0.5 text-[11px] font-medium text-purple-200">
                    VIEWING KEYS
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Verifiable Audit Receipts</h3>
                <p className="text-xs text-white/60 font-normal mb-6 leading-relaxed">
                  Cryptographic proofs of execution allowing selective disclosure for accounting without spending leaks.
                </p>
                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Cryptographic audit receipt generated for every swap</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Viewing Key fingerprints for tax and audit compliance</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Spending authority remains 100% private and protected</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Independently verifiable across on-chain block explorers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
                <span>Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter max-w-lg text-white">
                Zero-leak cross-chain architecture at every step
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-white/70 font-normal mb-4 text-sm leading-relaxed">
                Traditional bridges force users into transparent addresses, permanently leaking transaction graphs. ZCross preserves pure Orchard shielding from end to end.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('audit-invariants');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-400 font-medium text-sm hover:text-emerald-300 transition cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE PRIVACY SPECIFICATIONS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 min-h-[420px] flex flex-col justify-between overflow-hidden relative group hover:border-white/20 transition-all shadow-xl">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Pure Unified Addresses</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Requires <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">u1...</code> Unified Addresses with Orchard receivers. Transparent <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 font-mono text-xs">t-addresses</code> are rejected to ensure privacy integrity.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="relative w-48 h-48 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 rounded-full blur-xl opacity-60"></div>
                <div className="w-44 h-44 rounded-2xl bg-neutral-900/90 border border-white/10 shadow-xl flex flex-col items-center justify-center p-4 text-center transform group-hover:scale-105 transition-transform">
                  <Shield className="w-12 h-12 text-amber-400 mb-2" />
                  <span className="text-xs font-bold text-white">Orchard Halo 2</span>
                  <span className="text-[10px] text-white/50">Recursive ZK Proving</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 min-h-[420px] flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">In-Band 512B Encrypted Memos</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Intent parameters are encrypted inside ChaCha20-Poly1305 note ciphertexts with uniform 512-byte padding to prevent packet-size side-channels.
                </p>
              </div>
              <div className="mt-auto h-40 w-full flex flex-col items-center justify-center">
                <div className="w-full bg-black/80 border border-white/10 rounded-xl p-3.5 text-xs font-mono text-emerald-400 shadow-inner">
                  <div className="text-[10px] text-white/40 mb-1">// 512-byte padded memo</div>
                  <div className="truncate text-white/90">eyJwcm90b2NvbCI6InotaW50ZW50I...</div>
                  <div className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Length: 512.000 Bytes (Uniform)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 min-h-[420px] flex flex-col justify-between overflow-hidden relative group hover:border-white/20 transition-all shadow-xl">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Decentralized Solver Network</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Independent solvers scan compact block filters, verify note commitments, and execute atomic settlements on Arbitrum, Solana, and Bitcoin.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl"></div>
                <div className="w-40 h-40 bg-neutral-900/90 rounded-2xl shadow-xl border border-white/10 flex flex-col items-center justify-center p-3 text-center transform group-hover:-translate-y-2 transition-transform">
                  <Zap className="w-10 h-10 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold text-white">1Click API</span>
                  <span className="text-[10px] text-white/50">Atomic Solver Fill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standards & Logos */}
          <div className="border-t border-b border-white/10 py-12">
            <p className="text-center text-xs text-white/50 mb-8 font-medium uppercase tracking-wider">
              Built on battle-tested <span className="text-white font-semibold">Zcash &amp; Cross-Chain standards</span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" /> Zcash Orchard
              </span>
              <div className="flex items-center gap-2 font-semibold text-white/90">
                <LinkIcon className="w-5 h-5 text-cyan-400" /> NEAR Intents
              </div>
              <div className="flex items-center gap-2 font-bold text-white/90">
                <Triangle className="w-5 h-5 text-purple-400" /> Defuse Protocol
              </div>
              <div className="flex items-center gap-2 font-bold tracking-tight text-white/90">
                <Mountain className="w-5 h-5 text-emerald-400" /> Halo 2 Proving
              </div>
              <div className="flex items-center gap-2 font-medium text-white/90">
                <Gem className="w-5 h-5 text-blue-400" /> ZIP 316 / 321
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
              <span>Tooling</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 uppercase text-white">
              Ecosystem Components
            </h2>
            <p className="text-white/70 font-normal text-base sm:text-lg max-w-xl mx-auto">
              Two integrated tools connecting shielded Zcash liquidity to external chains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Wallet Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 md:p-12 min-h-[460px] relative overflow-hidden text-white flex flex-col justify-end shadow-2xl backdrop-blur-xl hover:border-white/20 transition">
              <div className="absolute top-8 right-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="relative z-10 pt-16">
                <h3 className="text-3xl font-semibold mb-3 tracking-tight text-white">Desktop Shielded Wallet</h3>
                <p className="text-white/70 font-normal text-base leading-relaxed">
                  Generate ZIP 321 payment request URIs and QR codes, inspect ChaCha20 encrypted memos, monitor live block heights, and review verifiable audit receipts.
                </p>
              </div>
            </div>

            {/* Solver Daemon Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 min-h-[460px] relative overflow-hidden flex flex-col justify-end shadow-xl backdrop-blur-xl hover:border-white/20 transition">
              <div className="absolute top-8 right-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="relative z-10 pt-16">
                <h3 className="text-3xl font-semibold mb-3 tracking-tight text-white">Headless Solver Watcher</h3>
                <p className="text-white/70 font-normal text-base leading-relaxed">
                  CLI daemon (<code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono">npm run solver</code>) scanning Orchard compact block filters, validating commitments, and dispatching execution intents to NEAR market makers.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white">
              One unified platform to move shielded value without publishing who paid whom
            </h3>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="solutions" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
              <span>Institutional &amp; DAOs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
              Seamless Cross-Chain Settlements for DApps &amp; DAOs
            </h2>
            <p className="text-white/70 font-normal text-base sm:text-lg max-w-2xl mx-auto">
              Accept shielded ZEC payments and settle automatically into Arbitrum USDC, Solana, or Bitcoin with zero sender balance exposure.
            </p>
          </div>

          {/* Business UI Grid */}
          <div id="developer-api" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mockup Left */}
            <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-72 flex flex-col shadow-xl">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Settlement Vault</div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg mb-4 text-sm font-medium text-white">
                Orchard Payroll Pool
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Supported Corridors</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 bg-amber-400/10 text-amber-300 text-xs rounded-full border border-amber-400/20 font-medium">
                  ZEC (Shielded)
                </span>
                <span className="px-2.5 py-1 bg-cyan-400/10 text-cyan-300 text-xs rounded-full border border-cyan-400/20 font-medium">
                  USDC (Arb)
                </span>
              </div>
              <div className="mt-auto h-2 bg-white/10 rounded w-1/2"></div>
            </div>

            {/* Middle (API) */}
            <div className="md:col-span-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 text-center min-h-[320px] flex flex-col items-center justify-center shadow-2xl">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-3 text-white tracking-tight">Developer API</h3>
              <p className="text-white/70 font-normal mb-6 text-sm max-w-md">
                Initiate shielded intent swaps and track SSE state changes with clean TypeScript bindings
              </p>
              <div className="w-full max-w-md bg-black/90 border border-white/10 rounded-xl p-4 text-left shadow-2xl">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <code className="text-xs font-mono text-emerald-400 block leading-relaxed">
                  const solver = new ZCross(&#123;<br />
                  &nbsp;&nbsp;network: &apos;mainnet&apos;,<br />
                  &nbsp;&nbsp;privacy: &apos;pure-orchard&apos;<br />
                  &#125;);<br />
                  const quote = await solver.createIntent(&#123; amountZec: 1.0 &#125;);
                </code>
              </div>
            </div>

            {/* Mockup Right */}
            <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-72 flex flex-col shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                  🛡️
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Watcher Daemon</div>
                  <div className="text-xs text-white/50 font-mono">compact-block-stream</div>
                </div>
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Solver Status</div>
              <div className="flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 p-2.5 rounded-lg justify-between mb-4">
                <span className="text-white">Online &amp; Indexing</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('audit-invariants');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-auto w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs py-2 rounded-lg font-medium transition cursor-pointer"
              >
                Inspect Invariants &amp; Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corridors Section */}
      <section id="corridors" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
                <span>Liquidity</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter max-w-lg text-white">
                Active Cross-Chain Liquidity Corridors
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-white/70 font-normal mb-4 text-sm leading-relaxed">
                Convert private ZEC into native tokens across EVM, Solana, and Bitcoin ecosystems at guaranteed market rates.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('corridors-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-400 font-medium text-sm hover:text-emerald-300 transition cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE ALL CORRIDORS
              </button>
            </div>
          </div>

          <div id="corridors-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arbitrum Corridor */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8 pb-2">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-sm min-w-[140px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center text-xs font-bold">
                      Z
                    </div>
                    <span className="font-bold text-sm text-white">ZEC</span>
                  </div>
                  <div className="text-lg font-semibold text-white">$1,420.00</div>
                  <div className="text-xs text-emerald-400 font-medium">+14.2%</div>
                </div>

                <div className="bg-white/5 border border-cyan-400/30 p-4 rounded-xl shadow-md min-w-[140px] transform scale-105">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold">
                      $
                    </div>
                    <span className="font-bold text-sm text-white">USDC (Arb)</span>
                  </div>
                  <div className="text-lg font-semibold text-white">$1.00</div>
                  <div className="text-xs text-emerald-400 font-medium">Sub-minute Fill</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white tracking-tight">Arbitrum One USDC</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Instant settlement on Arbitrum One via NEAR Intents market makers. Zero slippage guaranteed by Ed25519 quotes.
                </p>
              </div>
            </div>

            {/* Solana Corridor */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden hover:border-white/20 transition-all shadow-xl">
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mb-6 bg-black">
                <img
                  src="/images/solana-screenshot.jpg"
                  alt="Solana Native SOL Settlement Confirmation"
                  className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white tracking-tight">Solana Native (SOL)</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Sub-second Solana payouts directly into your Phantom or Backpack address without linking your Zcash wallet.
                </p>
              </div>
            </div>

            {/* Bitcoin Native Corridor */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden hover:border-white/20 transition-all shadow-xl">
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 mb-6 bg-black">
                <img
                  src="/images/bitcoin-screenshot.jpg"
                  alt="Native Bitcoin SegWit Taproot Transaction Confirmation"
                  className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white tracking-tight">Native Bitcoin (BTC)</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Route shielded ZEC into self-custodial on-chain Bitcoin transactions via automated solver payment channels.
                </p>
              </div>
            </div>

            {/* Audit & Compliance */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden hover:border-white/20 transition-all shadow-xl">
              <div className="flex justify-center items-center py-6">
                <div className="bg-black/80 border border-white/15 p-5 rounded-2xl shadow-xl w-68 text-center backdrop-blur-xl">
                  <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-white">Viewing Key Proofs</div>
                  <div className="text-[10px] text-white/50 mt-1 font-mono">ivk_fp_0e44ee45af8b8159</div>
                  <div className="bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-center py-1.5 rounded-lg text-xs font-bold mt-3">
                    Verified Zero Leak
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-white tracking-tight">Zero-Knowledge Audit Receipts</h3>
                <p className="text-white/70 font-normal text-sm leading-relaxed">
                  Prove legal origin of funds to accountants and auditors via Viewing Keys without compromising private spending authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
              <span>Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white">
              Real Stories, Real Experience<br />
              with ZCross
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-full flex items-center justify-center font-bold text-white">
                  M
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Max</div>
                  <div className="text-xs text-white/50">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-white/70 font-normal text-sm leading-relaxed">
                &ldquo;I use ZCross for private cross-chain swaps. The speed and zero-leak shielded architecture are unmatched. Fast, solid, and reliable.&rdquo;
              </p>
            </div>

            {/* Review 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 rounded-full flex items-center justify-center font-bold">
                  AA
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Alex A.</div>
                  <div className="text-xs text-white/50">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-white/70 font-normal text-sm leading-relaxed">
                &ldquo;Fast. Solid. Easy to use. That&apos;s how I&apos;d sum up ZCross&apos;s philosophy. If you&apos;re looking for seamless, private cross-chain liquidity, this is the one I recommend!&rdquo;
              </p>
            </div>

            {/* Review 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-full flex items-center justify-center font-bold text-white">
                  E
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Elena R.</div>
                  <div className="text-xs text-white/50">DeFi Operator</div>
                </div>
              </div>
              <p className="text-white/70 font-normal text-sm leading-relaxed">
                &ldquo;Great reliable exchanger wallet with instant settlement to Arbitrum and Solana. Fully automatic and zero metadata exposure.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-4">
              <span>Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-white">FAQ</h2>
            <p className="text-white/70 text-sm leading-relaxed">
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
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 cursor-pointer hover:border-white/20 transition-all shadow-md"
                onClick={() => toggleFaq(i)}
              >
                <div className="flex justify-between items-center font-medium list-none text-white">
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <span className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition">
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        openFaq === i ? 'rotate-45 text-white' : ''
                      }`}
                    />
                  </span>
                </div>
                {openFaq === i && (
                  <div className="text-white/70 mt-4 text-sm font-normal leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight mb-4 text-white">
                <div className="w-7 h-7 bg-white/10 border border-white/10 rounded-full flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span>ZCross Protocol</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Zero-leak shielded cross-chain bridge and solver daemon connecting Zcash Orchard to external ecosystems.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition"
                >
                  <Terminal className="w-4 h-4" />
                </a>
                <a
                  href="https://zips.z.cash"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition"
                >
                  <Layers className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-tight">Specifications</h4>
              <ul className="space-y-3 text-sm text-white/60 font-normal">
                <li>
                  <a href="https://zips.z.cash/zip-0316" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    ZIP 316: Unified Addresses
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/zip-0321" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    ZIP 321: Payment Requests
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/protocol/protocol.pdf" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    Halo 2 Zero-Knowledge Proofs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-tight">Ecosystem</h4>
              <ul className="space-y-3 text-sm text-white/60 font-normal">
                <li>
                  <a href="https://docs.near-intents.org" target="_blank" rel="noreferrer" className="hover:text-white transition">
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
                    className="hover:text-white transition text-left cursor-pointer"
                  >
                    Privacy Auditor &amp; Invariants
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-white tracking-tight">Products</h4>
              <div className="space-y-3">
                <button
                  onClick={onOpenWallet}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all w-full cursor-pointer shadow-md shadow-amber-400/20"
                >
                  <Zap className="w-4 h-4 text-black" />
                  Launch App
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('audit-invariants');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all w-full cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Audit Invariants
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-white/40 font-normal">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
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
