'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
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
  Wallet,
  User,
  ArrowUpRight,
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
  ExternalLink,
  Terminal,
  Layers,
  Cpu,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ZcashIcon, NearIcon, DefuseIcon, ZCrossLogo } from './BrandLogos';
import { useLivePrices } from '@/core/prices/PriceContext';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onOpenWallet: () => void;
  onOpenAuditor?: () => void;
}

const BATTLE_TESTED_STANDARDS = [
  {
    id: 'orchard',
    name: 'Zcash Orchard',
    category: 'Shielded Pool',
    tag: 'ZIP-224',
    icon: <ZcashIcon className="w-5 h-5 flex-shrink-0" />,
  },
  {
    id: 'near',
    name: 'NEAR Intents',
    category: 'Solver Relayers',
    tag: '1-Sec Finality',
    icon: <NearIcon className="w-5 h-5 rounded-xs flex-shrink-0" />,
  },
  {
    id: 'defuse',
    name: 'Defuse Protocol',
    category: 'Omni-Liquidity Mesh',
    tag: 'Settlement Engine',
    icon: <DefuseIcon className="w-5 h-5 rounded-xs flex-shrink-0" />,
  },
  {
    id: 'halo2',
    name: 'Halo 2 Proving',
    category: 'Zero-Knowledge Circuit',
    tag: 'No Trusted Setup',
    icon: <Mountain className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  },
  {
    id: 'zip316',
    name: 'ZIP 316 / 321',
    category: 'Unified Addresses & URIs',
    tag: 'Zero-Leak Standard',
    icon: <Gem className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWallet, onOpenAuditor }) => {
  const { zecPriceUsd, change24hPercent } = useLivePrices();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [calcAmount, setCalcAmount] = useState<number>(10);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-black font-sans min-h-screen transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#080c14]/85 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer lg:hidden"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            </button>

            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 font-semibold text-xl tracking-tight cursor-pointer"
              title="ZCross - Return to Top"
            >
              <ZCrossLogo className="w-7 h-7" />
              <span className="tracking-tight font-extrabold text-2xl text-slate-900 dark:text-white">ZCross</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 ml-4">
              <button
                onClick={() => document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                Invariants Audit
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                Architecture
              </button>
              <button
                onClick={() => document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                Corridors
              </button>
              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                FAQ
              </button>
              <NextLink
                href="/developer"
                className="hover:text-black dark:hover:text-white transition cursor-pointer flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white"
              >
                <span>Dev API &amp; SDK</span>
              </NextLink>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:block">
              <ThemeToggle variant="badge" />
            </div>
            <div className="sm:hidden">
              <ThemeToggle variant="icon" />
            </div>
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-black dark:bg-amber-500 text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
            >
              <ZCrossLogo className="w-4 h-4" variant="white" />
              Launch App
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-3 shadow-lg">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('audit-invariants')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 cursor-pointer"
            >
              Invariants Audit
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('corridors')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 cursor-pointer"
            >
              Corridors
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 cursor-pointer"
            >
              FAQ
            </button>
            <NextLink
              href="/developer"
              className="w-full text-left text-sm font-bold text-slate-900 dark:text-white hover:text-black dark:hover:text-white py-2 cursor-pointer flex items-center justify-between"
            >
              <span>Developer API &amp; SDK</span>
            </NextLink>

            <div className="py-2 border-t border-gray-100 dark:border-slate-800">
              <ThemeToggle variant="switch" />
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full bg-black dark:bg-amber-500 text-white dark:text-black py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-amber-400 text-center cursor-pointer transition-colors"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-white dark:bg-[#080c14] transition-colors">
        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
            SHIELDED LIQUIDITY<br />
            WITHOUT BOUNDARIES
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Swap directly from Zcash Orchard into Arbitrum USDC, Solana SOL, and Bitcoin without ever unshielding on the way through. Powered by 512-byte encrypted memos and the NEAR Intents protocol.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-black dark:bg-amber-500 text-white dark:text-black px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-amber-400 transition-all w-full sm:w-auto justify-center shadow-lg hover:shadow-xl cursor-pointer"
            >
              <ZCrossLogo className="w-5 h-5" variant="white" />
              Launch App
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('audit-invariants');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-black dark:text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto justify-center cursor-pointer shadow-sm hover:shadow"
            >
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
            <span className="text-[12rem] md:text-[18rem] font-bold text-gray-100 dark:text-slate-900/60 opacity-90 tracking-tighter whitespace-nowrap">
              ZCROSS
            </span>
          </div>

          {/* Phone Mockup */}
          <div className="relative z-10 flex justify-center transform translate-y-8 sm:translate-y-12">
            <div className="relative w-[300px] sm:w-[340px] md:w-[370px] bg-slate-900 dark:bg-black rounded-[3rem] p-3 shadow-2xl ring-1 ring-black/20 dark:ring-white/10">
              {/* Dynamic Island / Speaker Pill */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 border border-slate-700/60" />
              </div>

              {/* Gloss / Reflection overlay */}
              <div className="absolute inset-3 rounded-[2.4rem] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

              {/* Phone Screen Container with Aspect Ratio matching the screenshots (413 x 802) */}
              <div className="rounded-[2.4rem] overflow-hidden relative shadow-inner bg-slate-950 border border-black/50 aspect-[413/802] w-full">
                {/* 
                  User Specification:
                  - Display the white/light screenshot when in dark mode (contrast effect)
                  - Display the dark screenshot when in white/light mode (contrast effect)
                */}
                <img
                  src="/screenshots/wallet-mobile-light.png"
                  alt="ZCross Shielded Wallet Preview (Light Interface)"
                  className="hidden dark:block w-full h-full object-cover object-top select-none pointer-events-none"
                  loading="eager"
                />
                <img
                  src="/screenshots/wallet-mobile-dark.png"
                  alt="ZCross Shielded Wallet Preview (Dark Interface)"
                  className="block dark:hidden w-full h-full object-cover object-top select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-center tracking-tight mb-16 max-w-2xl mx-auto text-slate-900 dark:text-white">
            Engineered for pure privacy,<br />
            verified by zero-knowledge math
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <div className="text-center md:border-r border-gray-100 dark:border-slate-800 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2 text-emerald-600 dark:text-emerald-400">0</div>
              <div className="text-gray-500 dark:text-gray-400 font-light text-sm md:text-base">
                Transparent Hops<br />(Zero-Leak Invariant)
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 dark:border-slate-800 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2 dark:text-white">512B</div>
              <div className="text-gray-500 dark:text-gray-400 font-light text-sm md:text-base">
                Uniform Padded Memo<br />(No Size Leaks)
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 dark:border-slate-800 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2 dark:text-white">&lt; 90s</div>
              <div className="text-gray-500 dark:text-gray-400 font-light text-sm md:text-base">
                Cross-Chain Solver<br />Fulfillment Time
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2 dark:text-white">5+</div>
              <div className="text-gray-500 dark:text-gray-400 font-light text-sm md:text-base">
                Connected Corridors<br />(Arb, Sol, BTC, Eth, Base)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Privacy & Cost Calculator Section */}
      <section id="privacy-calculator" className="py-24 bg-gray-50/60 dark:bg-[#060a12]/60 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              Interactive Privacy &amp; Cost Calculator
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-base md:text-lg max-w-2xl mx-auto">
              Compare real-world surveillance risk, KYC requirements, and execution speed when moving shielded funds cross-chain.
            </p>
          </div>

          {/* Amount Selection Slider & Presets */}
          <div className="max-w-2xl mx-auto mb-14 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Simulate Transfer Amount:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{calcAmount} ZEC</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  (≈ ${(calcAmount * zecPriceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-amber-500 mb-4"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-between text-xs gap-1.5">
              <span className="text-gray-400 dark:text-gray-500 text-[11px] font-medium">Quick Select:</span>
              <div className="flex items-center gap-2">
                {[1, 5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcAmount(amt)}
                    className={`px-3 py-1 rounded-full font-mono text-xs font-semibold transition cursor-pointer ${
                      calcAmount === amt
                        ? 'bg-black dark:bg-amber-500 text-white dark:text-black shadow-xs'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {amt} ZEC
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3-Column Comparison Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Centralized Exchange (CEX) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-end mb-4">
                  <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">Score: 0/100</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Centralized Custody</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Requires depositing into a corporate wallet, triggering instant address deanonymization.
                </p>

                <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Identity / KYC:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 text-right">Passport &amp; Facial Selfie ID</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Address Exposure:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 text-right">Permanent t-address link to identity</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Surveillance Risk:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 text-right">Chainalysis / TRM Monitored</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Settlement Delay:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-right">30 - 60 min lockup</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Spread / Trading Loss:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-right">≈ ${(calcAmount * zecPriceUsd * 0.015).toFixed(2)} (1.5%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Full Identity Deanonymization
                </span>
              </div>
            </div>

            {/* Column 2: Traditional Wrapped Bridge */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-end mb-4">
                  <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">Score: 25/100</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart Contract Bridge</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Minted synthetic wrapped tokens via shared multi-sig escrow pools.
                </p>

                <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Identity / KYC:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">None Required</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Address Exposure:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 text-right">Public EVM calldata leaks balance</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Honeypot Exploit Risk:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 text-right">Central Custody / Bridge Lockup</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Settlement Delay:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-right">5 - 15 min + gas</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Multi-Hop Gas Fees:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-right">≈ $35.00 - $60.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Public Calldata &amp; Honeypot Risk
                </span>
              </div>
            </div>

            {/* Column 3: ZCross Shielded Route (Winner) */}
            <div className="bg-black dark:bg-slate-950 text-white rounded-3xl p-7 border border-gray-800 dark:border-emerald-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden ring-2 ring-emerald-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    ZCross Protocol
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">Score: 100/100</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pure Orchard Shielding</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Zero transparent addresses, 512-byte constant encrypted memos, atomic solver fulfillment.
                </p>

                <div className="space-y-3.5 text-xs text-gray-300">
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-800">
                    <span className="text-gray-400">Identity / KYC:</span>
                    <span className="font-semibold text-emerald-400 text-right">0 (Zero KYC / Non-Custodial)</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-800">
                    <span className="text-gray-400">Address Exposure:</span>
                    <span className="font-semibold text-emerald-400 text-right">100% Shielded In-Orchard (ZIP 316)</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-800">
                    <span className="text-gray-400">Traffic Leakage:</span>
                    <span className="font-semibold text-emerald-400 text-right">Zero-Leak (512B Uniform Memo)</span>
                  </div>
                  <div className="flex items-start justify-between pb-2.5 border-b border-gray-800">
                    <span className="text-gray-400">Settlement Delay:</span>
                    <span className="font-mono font-bold text-emerald-400 text-right">&lt; 42s Atomic Fill</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-400">Network / Solver Fee:</span>
                    <span className="font-mono font-bold text-emerald-400 text-right">
                      0.15% (≈ ${(calcAmount * zecPriceUsd * 0.0015).toFixed(2)}) + 0.0001 ZEC
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mathematical Zero-Leak Guarantee
                </span>
                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="px-3 py-1 rounded-full bg-white dark:bg-amber-500 text-black dark:text-black font-bold text-xs hover:bg-gray-100 dark:hover:bg-amber-400 transition cursor-pointer"
                >
                  Swap Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero-Leak Security Invariants & Cryptographic Audit Section */}
      <section id="audit-invariants" className="py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-white">
              Zero-Leak Security Invariants
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-lg max-w-2xl mx-auto">
              Mathematical verification of pure Orchard isolation, uniform 512-byte memo padding, and non-custodial solver atomic fulfillment.
            </p>
          </div>

          {/* 4 Invariant Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Pure Shielded Isolation */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 border border-gray-100/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Pure Shielded Isolation</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-6 leading-relaxed">
                Strict enforcement of pure shielded pools with zero transparent address exposure or linkability.
              </p>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Zero transparent addresses (t-addr) accepted or routed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Pure Orchard pool (ZIP 316 Unified Addresses only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Halo 2 recursive zero-knowledge proving system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Zero transaction graph linkability between parties</span>
                </li>
              </ul>
            </div>

            {/* 2. Metadata Defense */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 border border-gray-100/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Constant-Length Memos</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-6 leading-relaxed">
                Eliminates network packet sniffing and byte-length side-channels with uniform constant padding.
              </p>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>In-band ChaCha20-Poly1305 note ciphertexts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Exact 512-byte uniform padding eliminates size leaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Destination chains and tokens hidden from observers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Forward secrecy guaranteed across all note transfers</span>
                </li>
              </ul>
            </div>

            {/* 3. Non-Custodial Solvers */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 border border-gray-100/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Non-Custodial Solvers</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-6 leading-relaxed">
                Decentralized intent fulfillment network eliminating central bridges and smart contract honeypots.
              </p>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Direct integration with NEAR Intents 1Click protocol</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Ed25519-signed guaranteed execution rate quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Automated timeout detection and shielded refund fallbacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Zero wrapped tokens or vulnerable bridge escrow pools</span>
                </li>
              </ul>
            </div>

            {/* 4. Verifiable Receipts */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 border border-gray-100/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Verifiable Audit Receipts</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-6 leading-relaxed">
                Cryptographic proofs of execution allowing selective disclosure for accounting without spending leaks.
              </p>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Cryptographic audit receipt generated for every swap</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Viewing Key fingerprints for tax and audit compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Spending authority remains 100% private and protected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Independently verifiable across on-chain block explorers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900 dark:text-white">
              Zero-leak cross-chain architecture at every step
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 dark:text-gray-400 font-light mb-4 text-sm leading-relaxed">
                Traditional bridges force users into transparent addresses, permanently leaking transaction graphs. ZCross preserves pure Orchard shielding from end to end.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('audit-invariants');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE PRIVACY SPECIFICATIONS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Pure Unified Addresses</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Requires <code className="bg-gray-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">u1...</code> Unified Addresses with Orchard receivers. Transparent <code className="bg-gray-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">t-addresses</code> are rejected to ensure privacy integrity.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="relative w-48 h-48 bg-gradient-to-tr from-amber-100/40 to-orange-50/20 dark:from-amber-500/10 dark:to-orange-500/5 rounded-full blur-xl opacity-50"></div>
                <div className="w-44 h-44 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-amber-100 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center transform group-hover:scale-105 transition-transform">
                  <Shield className="w-12 h-12 text-amber-500 mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">Shielded Orchard</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Recursive ZK Proving</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between border border-gray-100/80 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">In-Band 512B Encrypted Memos</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Intent parameters are encrypted inside ChaCha20-Poly1305 note ciphertexts with uniform 512-byte padding to prevent packet-size side-channels.
                </p>
              </div>
              <div className="mt-auto h-40 w-full flex flex-col items-center justify-center">
                <div className="w-full bg-neutral-900 dark:bg-black rounded-xl p-3 text-xs font-mono text-emerald-400 shadow-inner border border-white/5">
                  <div className="text-[10px] text-gray-500 mb-1">// 512-byte padded memo</div>
                  <div className="truncate">eyJwcm90b2NvbCI6InotaW50ZW50I...</div>
                  <div className="text-[10px] text-amber-400 mt-1">✓ Length: 512.000 Bytes (Uniform)</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Decentralized Solver Network</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Independent solvers scan compact block filters, verify note commitments, and execute atomic settlements on Arbitrum, Solana, and Bitcoin.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="w-40 h-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center p-3 text-center transform group-hover:-translate-y-2 transition-transform">
                  <Zap className="w-10 h-10 text-cyan-500 mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">1Click API</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Atomic Solver Fill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Battle-Tested Standards Animated Marquee (Sliding Left to Right) */}
          <div id="standards-marquee" className="border-t border-b border-gray-100 dark:border-slate-800 py-12 relative overflow-hidden bg-gradient-to-b from-gray-50/30 dark:from-slate-950/30 via-white dark:via-[#080c14] to-gray-50/30 dark:to-slate-950/30">
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8 font-light">
              Built on battle-tested <span className="font-semibold text-slate-900 dark:text-white">Zcash &amp; Cross-Chain standards</span>
            </p>

            {/* Left & Right Edge Gradient Fade Overlays */}
            <div className="pointer-events-none absolute left-0 top-16 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-white via-white/80 dark:from-[#080c14] dark:via-[#080c14]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-16 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-white via-white/80 dark:from-[#080c14] dark:via-[#080c14]/80 to-transparent z-10" />

            {/* Continuous Marquee Track Sliding Left to Right */}
            <div className="flex animate-marquee-right select-none py-1">
              {/* Primary Sequence */}
              <div className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4 shrink-0">
                {[...BATTLE_TESTED_STANDARDS, ...BATTLE_TESTED_STANDARDS].map((std, idx) => (
                  <div
                    key={`std-a-${idx}`}
                    className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 group cursor-default"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-2xs">
                      {std.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                          {std.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 whitespace-nowrap">
                          {std.tag}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                        {std.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duplicate Sequence (Seamless loop clone) */}
              <div className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4 shrink-0" aria-hidden="true">
                {[...BATTLE_TESTED_STANDARDS, ...BATTLE_TESTED_STANDARDS].map((std, idx) => (
                  <div
                    key={`std-b-${idx}`}
                    className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 group cursor-default"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-2xs">
                      {std.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                          {std.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 whitespace-nowrap">
                          {std.tag}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                        {std.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Ecosystem Section */}
      <section id="ecosystem" className="py-24 bg-white dark:bg-[#080c14] transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 uppercase text-slate-900 dark:text-white">
              Ecosystem Architecture
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-lg max-w-2xl mx-auto">
              Two integrated engines connecting pure shielded Zcash liquidity to cross-chain decentralized settlement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Wallet Card (Dark Obsidian / Amber Glow) */}
            <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-8 md:p-10 min-h-[520px] relative overflow-hidden text-white flex flex-col justify-between shadow-2xl border border-slate-800/90 group hover:border-amber-500/40 transition-all duration-300">
              {/* Amber & Gold Glow Ambient */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />
              <div className="absolute top-1/2 -left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Rich Visual Mockup: In-Browser Shielded Wallet Dashboard UI */}
              <div className="relative z-10 w-full mb-8">
                {/* Mock Window Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 pl-1">zcross-shielded-vault</span>
                  </div>
                </div>

                {/* Glassmorphic Inner Wallet Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-inner space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black font-bold text-sm shadow-md">
                        ⓩ
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase font-mono tracking-wider">Shielded Balance</div>
                        <div className="text-2xl font-bold tracking-tight text-white font-mono">17.50000000 <span className="text-amber-400 text-sm">ZEC</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-400 font-mono font-semibold">≈ $23,348.50</div>
                      <div className="text-[10px] text-gray-400">Zero Public Exposure</div>
                    </div>
                  </div>

                  {/* Address Chip */}
                  <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/5 font-mono text-[11px] text-gray-300">
                    <div className="flex items-center gap-2 truncate">
                      <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">u1q4k70w5x8r8m2q0p9z3f...9c14</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold shrink-0 ml-2">ZIP 316</span>
                  </div>

                  {/* Action Quick Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-semibold text-xs">
                    <div className="bg-white/10 hover:bg-white/15 py-1.5 rounded-lg transition text-slate-200 cursor-default">
                      Shield In
                    </div>
                    <div className="bg-amber-500 hover:bg-amber-400 py-1.5 rounded-lg transition text-black font-bold cursor-default shadow-xs">
                      1Click Swap
                    </div>
                    <div className="bg-white/10 hover:bg-white/15 py-1.5 rounded-lg transition text-slate-200 cursor-default">
                      Audit Receipt
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Desktop Shielded Wallet</h3>
                <p className="text-gray-400 font-light text-base sm:text-lg leading-relaxed">
                  Generate ZIP 321 payment request URIs and QR codes, inspect ChaCha20 encrypted memos, monitor live block heights, and review verifiable audit receipts.
                </p>
              </div>
            </div>

            {/* Solver Daemon Card (Terminal Matrix / Cyan Glow) */}
            <div className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-8 md:p-10 min-h-[520px] relative overflow-hidden text-white flex flex-col justify-between shadow-2xl border border-slate-800/90 group hover:border-cyan-500/40 transition-all duration-300">
              {/* Cyan & Indigo Glow Ambient */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-500" />
              <div className="absolute top-1/2 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Rich Visual Mockup: Live Solver Daemon Terminal Feed */}
              <div className="relative z-10 w-full mb-8">
                {/* Mock Terminal Window Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 pl-1">zcross-solver-daemon --network=mainnet</span>
                  </div>
                </div>

                {/* Terminal Console Feed Box */}
                <div className="bg-black/80 rounded-2xl p-4 border border-white/10 font-mono text-[11px] space-y-2 shadow-inner leading-relaxed">
                  <div className="flex items-start gap-2 text-cyan-400">
                    <span className="text-gray-500 shrink-0">14:02:11</span>
                    <span><span className="text-purple-400">[grpc]</span> Lightwalletd stream connected :9067</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 shrink-0">14:02:14</span>
                    <span><span className="text-amber-400">[compact-block]</span> Filter block #2,841,920 matched 1 note</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400">
                    <span className="text-gray-500 shrink-0">14:02:15</span>
                    <span><span className="text-emerald-300">[memo-512b]</span> Decrypted: 1.0 ZEC ➔ Arbitrum (USDC)</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-300">
                    <span className="text-gray-500 shrink-0">14:02:16</span>
                    <span><span className="text-cyan-400">[defuse-mesh]</span> Matched solver-vault.near • SLA &lt; 42s</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                    <span className="text-gray-400">Execution Invariant: <span className="text-emerald-400 font-bold">SHA-256 Verified</span></span>
                    <span className="text-amber-400 font-mono font-semibold">Chaff: Active</span>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Headless Solver Watcher</h3>
                <p className="text-gray-400 font-light text-base sm:text-lg leading-relaxed">
                  CLI daemon (<code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono">npm run solver</code>) scanning Orchard compact block filters, validating commitments, and dispatching execution intents to NEAR market makers.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-slate-900 dark:text-white">
              One unified platform to move shielded value without publishing who paid whom
            </h3>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="solutions" className="py-24 bg-emerald-50/30 dark:bg-slate-950/40 border-t border-emerald-100/50 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-white">
              Seamless Cross-Chain Settlements for DApps &amp; DAOs
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-lg max-w-2xl mx-auto">
              Accept shielded ZEC payments and settle automatically into Arbitrum USDC, Solana, or Bitcoin with zero sender balance exposure.
            </p>
          </div>

          {/* Business UI Grid */}
          <div id="developer-api" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mockup Left */}
            <div className="md:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-64 flex flex-col">
              <div className="text-xs text-gray-400 dark:text-gray-500 uppercase mb-2">Settlement Vault</div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded mb-4 text-sm font-medium text-slate-900 dark:text-white">Orchard Payroll Pool</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 uppercase mb-2">Supported Corridors</div>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800/40 font-medium">
                  ZEC (Shielded)
                </span>
                <span className="px-2 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs rounded-full border border-cyan-200 dark:border-cyan-800/40 font-medium">
                  USDC (Arb)
                </span>
              </div>
              <div className="mt-auto h-2 bg-gray-100 dark:bg-slate-800 rounded w-1/2"></div>
            </div>

            {/* Middle (API) */}
            <div className="md:col-span-6 bg-emerald-50/50 dark:bg-slate-900/70 rounded-3xl p-10 text-center border border-emerald-100 dark:border-slate-800 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">Developer API</h3>
              <p className="text-gray-500 dark:text-gray-400 font-light mb-8 text-sm">
                Initiate shielded intent swaps and track SSE state changes with clean TypeScript bindings
              </p>
              <div className="w-full max-w-md bg-gray-900 dark:bg-black rounded-xl p-4 text-left shadow-lg border border-white/5">
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
            <div className="md:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-64 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-black dark:bg-amber-500 text-amber-400 dark:text-black flex items-center justify-center font-bold text-xs">
                  <Shield className="w-4 h-4 text-amber-400 dark:text-black" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Watcher Daemon</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">compact-block-stream</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 uppercase mb-2">Solver Status</div>
              <div className="flex items-center gap-2 text-xs font-medium bg-gray-50 dark:bg-slate-800 p-2 rounded justify-between mb-4 text-slate-700 dark:text-slate-300">
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
      <section id="corridors" className="py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900 dark:text-white">
              Active Cross-Chain Liquidity Corridors
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 dark:text-gray-400 font-light mb-4 text-sm">
                Convert private ZEC into native tokens across EVM, Solana, and Bitcoin ecosystems at guaranteed market rates.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('corridors-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                EXPLORE ALL CORRIDORS
              </button>
            </div>
          </div>

          <div id="corridors-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arbitrum Corridor */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between border border-gray-100/80 dark:border-slate-800">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8 opacity-90 pb-2">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm min-w-[140px] border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center text-xs font-bold">
                      Z
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">ZEC</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">${zecPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`text-xs font-medium ${change24hPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {change24hPercent >= 0 ? `+${change24hPercent.toFixed(1)}%` : `${change24hPercent.toFixed(1)}%`}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md min-w-[140px] transform scale-105 border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                      $
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">USDC (Arb)</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">$1.00</div>
                  <div className="text-xs text-emerald-500 font-medium">Sub-minute Fill</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Arbitrum One USDC</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Instant settlement on Arbitrum One via NEAR Intents market makers. Zero slippage guaranteed by Ed25519 quotes.
                </p>
              </div>
            </div>

            {/* Solana Corridor */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80 dark:border-slate-800">
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200/80 dark:border-slate-700 mb-6 bg-slate-950">
                <img
                  src="/images/solana-screenshot.jpg"
                  alt="Solana Native SOL Settlement Confirmation"
                  className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Solana Native (SOL)</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Sub-second Solana payouts directly into your Phantom or Backpack address without linking your Zcash wallet.
                </p>
              </div>
            </div>

            {/* Bitcoin Native Corridor */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80 dark:border-slate-800">
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200/80 dark:border-slate-700 mb-6 bg-slate-950">
                <img
                  src="/images/bitcoin-screenshot.jpg"
                  alt="Native Bitcoin SegWit Taproot Transaction Confirmation"
                  className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Native Bitcoin (BTC)</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Route shielded ZEC into self-custodial on-chain Bitcoin transactions via automated solver payment channels.
                </p>
              </div>
            </div>

            {/* Audit & Compliance */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80 dark:border-slate-800">
              <div className="flex justify-center items-center py-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 w-64 text-center">
                  <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800 dark:text-white">Viewing Key Proofs</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-mono">ivk_fp_0e44ee45af8b8159</div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-center py-1.5 rounded-lg text-xs font-bold mt-2 border border-emerald-200 dark:border-emerald-800/40">
                    Verified Zero Leak
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Zero-Knowledge Audit Receipts</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                  Prove legal origin of funds to accountants and auditors via Viewing Keys without compromising private spending authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-center tracking-tight mb-16 text-slate-900 dark:text-white">
            Real Stories, Real Experience<br />
            with ZCross
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-3xl border border-gray-100/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                  M
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">Max</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-light text-sm leading-relaxed">
                "I use ZCross for private cross-chain swaps. The speed and zero-leak shielded architecture are unmatched. Fast, solid, and reliable."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-3xl border border-gray-100/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold">
                  AA
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">Alex A.</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Trustpilot Verified</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-light text-sm leading-relaxed">
                "Fast. Solid. Easy to use. That's how I'd sum up ZCross's philosophy. If you're looking for seamless, private cross-chain liquidity, this is the one I recommend!"
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-3xl border border-gray-100/80 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                  E
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">Elena R.</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">DeFi Operator</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-light text-sm leading-relaxed">
                "Great reliable exchanger wallet with instant settlement to Arbitrum and Solana. Fully automatic and zero metadata exposure."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-white">FAQ</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
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
                className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 cursor-pointer border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 transition"
                onClick={() => toggleFaq(i)}
              >
                <div className="flex justify-between items-center font-medium list-none text-slate-900 dark:text-white">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${openFaq === i ? 'rotate-180 text-black dark:text-amber-400' : ''
                      }`}
                  />
                </div>
                {openFaq === i && (
                  <div className="text-gray-600 dark:text-gray-300 mt-4 text-sm font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#04060a] transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight mb-6">
                <ZCrossLogo className="w-6 h-6" />
                <span className="font-extrabold text-slate-900 dark:text-white">ZCross Protocol</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Zero-leak shielded cross-chain bridge and solver daemon connecting Zcash Orchard to external ecosystems.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </a>
                <a
                  href="https://zips.z.cash"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  <Layers className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900 dark:text-white">Specifications</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                <li>
                  <a href="https://zips.z.cash/zip-0316" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                    ZIP 316: Unified Addresses
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/zip-0321" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                    ZIP 321: Payment Requests
                  </a>
                </li>
                <li>
                  <a href="https://zips.z.cash/protocol/protocol.pdf" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                    Halo 2 Zero-Knowledge Proofs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900 dark:text-white">Ecosystem</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                <li>
                  <a href="https://docs.near-intents.org" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                    NEAR Intents Documentation
                  </a>
                </li>
                <li>
                  <a href="https://chaindefuser.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition">
                    Defuse Protocol (1Click)
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('audit-invariants');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-black dark:hover:text-white transition text-left cursor-pointer"
                  >
                    Privacy Auditor &amp; Invariants
                  </button>
                </li>
                <li>
                  <NextLink href="/developer" className="hover:text-black dark:hover:text-white transition text-slate-900 dark:text-white font-medium">
                    Developer API &amp; Sandbox
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/developer?tab=widget" className="hover:text-black dark:hover:text-white transition">
                    ZCross Pay Merchant SDK
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/developer?tab=memo" className="hover:text-black dark:hover:text-white transition">
                    ZIP-302 Memo Studio (512B)
                  </NextLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900 dark:text-white">Products</h4>
              <div className="space-y-3">
                <button
                  onClick={onOpenWallet}
                  className="flex items-center justify-center gap-2 bg-black dark:bg-amber-500 text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-amber-400 transition-all w-full cursor-pointer shadow-sm"
                >
                  <ZCrossLogo className="w-4 h-4" variant="white" />
                  Launch App
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('audit-invariants');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-black dark:text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all w-full cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Audit Invariants
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-gray-500 font-light">
            <div>
              <span>© {new Date().getFullYear()} ZCross. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
