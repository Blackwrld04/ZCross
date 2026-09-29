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
} from 'lucide-react';

interface LandingPageProps {
  onOpenWallet: () => void;
  onOpenAuditor?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWallet, onOpenAuditor }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-slate-900 antialiased selection:bg-black selection:text-white font-sans min-h-screen">
      {/* Top Notification / Hackathon Banner */}
      <div className="bg-neutral-950 text-white text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              Zero-Leak Shielded Orchard Cross-Chain Engine Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            {onOpenAuditor && (
              <button
                onClick={onOpenAuditor}
                className="hidden sm:inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition text-xs font-semibold"
              >
                <Shield className="w-3 h-3" />
                Zero-Leak Privacy Rubric
              </button>
            )}
            <button
              onClick={onOpenWallet}
              className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1"
            >
              Launch Desktop Wallet →
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenWallet}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div
            onClick={onOpenWallet}
            className="flex items-center gap-2 font-semibold text-xl tracking-tight cursor-pointer"
          >
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="tracking-tight font-bold text-2xl">swapster</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition">
              <Globe className="w-4 h-4" />
              ENG
            </button>
            <button
              onClick={onOpenWallet}
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              Get the app
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-slate-900">
            FINANCIAL TECHNOLOGIES<br />
            FOR LIMITLESS OPPORTUNITIES
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 font-light">
            Advanced financial infrastructure designed to simplify asset management and accelerate growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all w-full sm:w-auto justify-center shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Apple className="w-5 h-5" />
              Get the app
            </button>
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              <Send className="w-5 h-5" />
              Telegram Bot
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
              SWAPSTER
            </span>
          </div>

          {/* Phone Mockup */}
          <div className="relative z-10 flex justify-center transform translate-y-12">
            <div className="relative w-[300px] md:w-[350px] bg-black rounded-[3rem] p-3 shadow-2xl ring-1 ring-gray-900/10">
              <div className="rounded-[2.5rem] overflow-hidden bg-gray-900 h-[650px] relative text-white flex flex-col justify-between">
                {/* Simulated App UI */}
                <div className="p-6 pt-12">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                      ⚡
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <div className="text-gray-400 text-sm mb-1">Total Balance</div>
                    <div className="text-4xl font-semibold tracking-tight">$73,710</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <button
                      onClick={onOpenWallet}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition">
                        <ArrowUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition">Send</span>
                    </button>

                    <button
                      onClick={onOpenWallet}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition">
                        <ArrowDown className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition">Receive</span>
                    </button>

                    <button
                      onClick={onOpenWallet}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition">Swap</span>
                    </button>

                    <button
                      onClick={onOpenWallet}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition">
                        <MoreHorizontal className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition">More</span>
                    </button>
                  </div>

                  {/* Bitcoin card */}
                  <div
                    onClick={onOpenWallet}
                    className="bg-gray-800/50 rounded-2xl p-4 mb-4 cursor-pointer hover:bg-gray-800/80 transition border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow">
                        B
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Bitcoin</div>
                        <div className="text-xs text-gray-400">BTC</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">$31,520</div>
                        <div className="text-xs text-green-400">+2.4%</div>
                      </div>
                    </div>
                  </div>

                  {/* Referral Callout */}
                  <div className="bg-gradient-to-r from-emerald-900 to-gray-900 rounded-2xl p-4 border border-emerald-800/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-emerald-400 text-sm mb-1">Referral Program</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Invite friends and earn crypto rewards instantly.
                        </p>
                      </div>
                      <Gift className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-20 bg-gray-900/90 backdrop-blur border-t border-gray-800 flex justify-around items-center px-4">
                  <button onClick={onOpenWallet} className="cursor-pointer">
                    <Home className="w-6 h-6 text-white" />
                  </button>
                  <button onClick={onOpenWallet} className="cursor-pointer">
                    <BarChart2 className="w-6 h-6 text-gray-600 hover:text-white transition" />
                  </button>
                  <button onClick={onOpenWallet} className="cursor-pointer">
                    <Wallet className="w-6 h-6 text-gray-600 hover:text-white transition" />
                  </button>
                  <button onClick={onOpenWallet} className="cursor-pointer">
                    <User className="w-6 h-6 text-gray-600 hover:text-white transition" />
                  </button>
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
              Swapster in Numbers
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-center tracking-tight mb-16 max-w-2xl mx-auto text-slate-900">
            Valued by a global community,<br />
            strengthened by every user
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">130K+</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Number of<br />Users
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">2M+</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Monthly<br />Transactions
              </div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">$50B+</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Total Value<br />Transferred
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-semibold mb-2">100+</div>
              <div className="text-gray-500 font-light text-sm md:text-base">
                Number of<br />Countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900">
              Partner you can trust on every step
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 font-light mb-4 text-sm">
                Security and compliance guide our mission, protecting your assets and strengthening trust in every service.
              </p>
              <button
                onClick={onOpenWallet}
                className="inline-flex items-center text-emerald-600 font-medium text-sm hover:text-emerald-700 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Global AML protection</h3>
                <p className="text-gray-500 font-light text-sm">
                  Automated screening of addresses and transactions with risk scores and sanctions checks.
                </p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="relative w-48 h-48 bg-gradient-to-tr from-emerald-100 to-blue-50 rounded-full blur-xl opacity-50"></div>
                <img
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=400&h=400"
                  alt="Abstract 3D Block"
                  className="absolute bottom-[-20px] w-48 h-48 object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 grayscale opacity-80 mix-blend-multiply"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between border border-gray-100/80">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Military-grade security</h3>
                <p className="text-gray-500 font-light text-sm">Your money stays safe, always.</p>
              </div>
              {/* Abstract Security Viz */}
              <div className="mt-auto h-40 w-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 opacity-30">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between overflow-hidden relative group border border-gray-100/80">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Licensed digital assets provider</h3>
                <p className="text-gray-500 font-light text-sm">Your money is 100% legal, worldwide.</p>
              </div>
              <div className="mt-8 flex justify-center relative">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="w-40 h-40 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-500">B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="border-t border-b border-gray-100 py-12">
            <p className="text-center text-sm text-gray-400 mb-8 font-light">
              Already trusted by <span className="font-medium text-gray-900">industry leaders</span> across the globe
            </p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold font-mono tracking-tighter">
                BYB<span className="text-orange-500">I</span>T
              </span>
              <div className="flex items-center gap-2 font-semibold">
                <LinkIcon className="w-5 h-5" /> Chainalysis
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Triangle className="w-5 h-5" /> Allnodes
              </div>
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <Mountain className="w-5 h-5" /> MEXC
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Gem className="w-5 h-5" /> Crystal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 uppercase text-slate-900">
              Swapster Services
            </h2>
            <p className="text-gray-500 font-light text-lg">
              Shaping a future without borders between traditional<br />
              and digital assets united in one ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Wallet Card (Dark) */}
            <div
              onClick={onOpenWallet}
              className="bg-gray-900 rounded-[2.5rem] p-10 md:p-14 min-h-[600px] relative overflow-hidden text-white flex flex-col justify-end group cursor-pointer shadow-xl hover:shadow-2xl transition"
            >
              <div className="absolute top-0 right-0 left-0 h-full flex items-start justify-center pt-10">
                <img
                  src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600"
                  className="w-64 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                  alt="App UI"
                />
              </div>
              <div className="relative z-10 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent pt-20">
                <div className="inline-block bg-amber-400 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Click to open Desktop Wallet
                </div>
                <h3 className="text-3xl font-semibold mb-3">Wallet</h3>
                <p className="text-gray-400 font-light text-lg">
                  A full-scale financial multitool in your pocket. Available via Telegram bot or iOS app.
                </p>
              </div>
            </div>

            {/* Virtual Cards (Light) */}
            <div
              onClick={onOpenWallet}
              className="bg-gray-50 rounded-[2.5rem] p-10 md:p-14 min-h-[600px] relative overflow-hidden flex flex-col justify-end group cursor-pointer shadow-md hover:shadow-xl transition border border-gray-100"
            >
              <div className="absolute top-10 inset-x-0 flex flex-col items-center gap-4 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                {/* Card Mockups */}
                <div className="w-72 h-44 bg-emerald-100 rounded-2xl shadow-lg border border-white/50 flex flex-col p-4 justify-between transform translate-x-12 translate-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-5 bg-black/10 rounded"></div>
                    <span className="text-emerald-800 font-bold italic">VISA</span>
                  </div>
                  <div className="text-emerald-900/50 text-sm">•••• •••• •••• 4242</div>
                </div>
                <div className="w-72 h-44 bg-black rounded-2xl shadow-2xl flex flex-col p-4 justify-between transform -translate-x-4 -translate-y-24 z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-5 bg-white/20 rounded"></div>
                    <span className="text-white font-bold italic">Mastercard</span>
                  </div>
                  <div className="text-gray-500 text-sm">•••• •••• •••• 8888</div>
                </div>
              </div>
              <div className="relative z-10 pt-20">
                <h3 className="text-3xl font-semibold mb-3">Virtual Cards</h3>
                <p className="text-gray-500 font-light text-lg">
                  Instant issuance, Apple Pay and Google Pay ready, global payments.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
              One platform to control it all with smarter tools for modern lifestyle
            </h3>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-24 bg-emerald-50/30 border-t border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 bg-white border border-gray-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <Briefcase className="w-4 h-4" />
              Business Solutions
            </span>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">
              Keep it all to Swapster Business
            </h2>
            <p className="text-gray-500 font-light text-lg max-w-2xl mx-auto">
              The full toolkit your business needs to scale with seamless processing, instant payouts, effortless payroll, and a user-friendly dashboard.
            </p>
            <div className="mt-8">
              <button
                onClick={onOpenWallet}
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Business UI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mockup Left */}
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex flex-col">
              <div className="text-xs text-gray-400 uppercase mb-2">Project Name</div>
              <div className="bg-gray-50 p-2 rounded mb-4 text-sm font-medium">Sirius Gamme</div>
              <div className="text-xs text-gray-400 uppercase mb-2">Accepted Crypto</div>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-100 font-medium">
                  BTC
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100 font-medium">
                  ETH
                </span>
              </div>
              <div className="mt-auto h-2 bg-gray-100 rounded w-1/2"></div>
            </div>

            {/* Middle (API) */}
            <div className="md:col-span-6 bg-emerald-50/50 rounded-3xl p-10 text-center border border-emerald-100 min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-3xl font-semibold mb-4 text-slate-900">Simple API</h3>
              <p className="text-gray-500 font-light mb-8 text-sm">
                Integrate payments and services with fast, reliable, developer-friendly flow
              </p>
              <div className="w-full max-w-md bg-gray-900 rounded-xl p-4 text-left shadow-lg">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <code className="text-xs font-mono text-emerald-400 block leading-relaxed">
                  const swapster = new SwapsterAPI(&#123;<br />
                  &nbsp;&nbsp;apiKey: 'sk_live_...' <br />
                  &#125;);
                </code>
              </div>
            </div>

            {/* Mockup Right */}
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold">Antares Alpha</div>
                  <div className="text-xs text-gray-400">www.antares-alpha.io</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 uppercase mb-2">Project Status</div>
              <div className="flex items-center gap-2 text-xs font-medium bg-gray-50 p-2 rounded justify-between mb-4">
                <span>Stopped</span>
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
              </div>
              <button
                onClick={onOpenWallet}
                className="mt-auto w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-2 rounded font-medium transition cursor-pointer"
              >
                Create new project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Earn Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-lg text-slate-900">
              Grow your wealth powered by Swapster Earn
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 font-light mb-4 text-sm">
                Transform your assets into steady income with unlimited investment opportunities across every major market.
              </p>
              <button
                onClick={onOpenWallet}
                className="inline-flex items-center text-emerald-600 font-medium text-sm hover:text-emerald-700 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investments */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between border border-gray-100/80">
              {/* Tickers */}
              <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8 opacity-90 pb-2">
                <div className="bg-white p-4 rounded-xl shadow-sm min-w-[140px] border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                      B
                    </div>
                    <span className="font-bold text-sm">BTC</span>
                  </div>
                  <div className="text-lg font-semibold">$68,658</div>
                  <div className="text-xs text-red-500 font-medium">-4.04%</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md min-w-[140px] transform scale-105 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      <Apple className="w-3 h-3" />
                    </div>
                    <span className="font-bold text-sm">AAPL</span>
                  </div>
                  <div className="text-lg font-semibold">271.67 $</div>
                  <div className="text-xs text-emerald-500 font-medium">+0.38%</div>
                  <svg className="w-full h-8 mt-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 35 Q 20 30, 40 10 T 100 5" />
                  </svg>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm min-w-[140px] border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      E
                    </div>
                    <span className="font-bold text-sm">ETH</span>
                  </div>
                  <div className="text-lg font-semibold">3,854.81</div>
                  <div className="text-xs text-emerald-500 font-medium">+2.15%</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Investments</h3>
                <p className="text-gray-500 font-light text-sm">
                  Diversify your portfolio with crypto, metals, and global stocks for smarter investing.
                </p>
              </div>
            </div>

            {/* Derivatives */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="absolute top-8 right-8 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-medium z-20">
                Coming soon
              </div>

              <div className="flex justify-center mt-4">
                <div className="bg-gray-900 w-56 h-48 rounded-t-3xl border-4 border-gray-800 p-4 text-white shadow-2xl">
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>Withdraw</span>
                    <span className="text-emerald-400 font-medium">Add Funds</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                        <span className="font-medium">ETH-USD</span>
                      </div>
                      <span className="text-red-400 text-xs font-semibold">-5.2%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                        <span className="font-medium">BTC-USD</span>
                      </div>
                      <span className="text-emerald-400 text-xs font-semibold">+1.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-gray-50 pt-6">
                <h3 className="text-2xl font-semibold mb-2">Derivatives</h3>
                <p className="text-gray-500 font-light text-sm">
                  Expand your portfolio through derivatives, manage risks, hedge positions, and capture opportunities.
                </p>
              </div>
            </div>

            {/* Crypto Loans */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="absolute top-8 left-8 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-medium z-20">
                Coming soon
              </div>
              <div className="flex justify-center mt-4 ml-24">
                <div className="bg-black w-56 h-48 rounded-tl-3xl border-l-4 border-t-4 border-gray-800 p-4 text-white shadow-2xl relative">
                  <h4 className="text-center font-medium mb-4 text-sm">Loans</h4>
                  <div className="bg-gray-800 rounded-lg p-3 mb-2 flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div> BTC
                    </span>
                    <span className="font-semibold text-emerald-400">85% LTV</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-emerald-500 rounded h-8"></div>
                    <div className="flex-1 bg-gray-700 rounded h-8"></div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-6">
                <h3 className="text-2xl font-semibold mb-2">Crypto-Backed Loans</h3>
                <p className="text-gray-500 font-light text-sm">
                  Borrow against your bitcoin without selling it. Get instant loans in USDC while continuing to own your crypto.
                </p>
              </div>
            </div>

            {/* Staking */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-gray-100/80">
              <div className="absolute top-8 right-8 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-medium z-20">
                Coming soon
              </div>

              <div className="flex justify-center items-center py-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 w-64">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-black text-white text-[8px] flex items-center justify-center border-2 border-white">
                        SOL
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold">Solana</div>
                      <div className="text-[10px] text-gray-400">SOL</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 text-center py-2 rounded-lg text-xs font-bold mb-2">
                    Stake Now!
                  </div>
                  <div className="text-center text-[10px] text-gray-400 font-medium">5-6% Flexible</div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Staking</h3>
                <p className="text-gray-500 font-light text-sm">
                  Turn holding into earning with flexible staking solutions. Watch your wealth grow steadily.
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
            with Swapster
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                  M
                </div>
                <div>
                  <div className="font-semibold text-sm">Max</div>
                  <div className="text-xs text-gray-400">Trustpilot</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "I have 2 wallets here at once. One for work and the other for personal purposes. I mainly use USDT, BTC, ETH and recently bought some TONs. A good but underrated wallet. Good luck to the developer"
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                  AA
                </div>
                <div>
                  <div className="font-semibold text-sm">a_a</div>
                  <div className="text-xs text-gray-400">Trustpilot</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "Fast. Solid. Easy to use. That's how I'd sum up Swapster's philosophy and approach. Been using their services for 4 months now — not a single regret. If you're in crypto for hassle-free swaps, I'm telling you: Swapster's the one I recommend!"
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl opacity-60 border border-gray-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                  N
                </div>
                <div>
                  <div className="font-semibold text-sm">Noitman</div>
                  <div className="text-xs text-gray-400">Trustpilot</div>
                </div>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                "Great reliable exchanger wallet in Telegram with storage and withdrawal functions to bank cards. Automatic..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">FAQ</h2>
            <p className="text-gray-500 text-sm">
              Do you have a different question?{' '}
              <a href="mailto:info@swapster.fi" className="text-black font-semibold underline">
                Contact us.
              </a>
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            {[
              {
                q: 'Why Swapster?',
                a: 'Swapster offers low fees, high security, and instant transactions.',
              },
              {
                q: 'Which cryptocurrencies does Swapster support?',
                a: 'We support over 500+ cryptocurrencies across multiple chains including Zcash, Bitcoin, Ethereum, Arbitrum, and Solana.',
              },
              {
                q: 'What services does Swapster offer to its users?',
                a: 'Wallet, Exchange, Virtual Cards, Business API, and Staking.',
              },
              {
                q: 'Are my assets well protected in Swapster?',
                a: 'Yes, we use military-grade encryption and cold storage solutions.',
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
                  <div className="text-gray-500 mt-4 text-sm font-light leading-relaxed">
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
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>LLC «Data Group»</span>
              </div>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Send className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Twitter className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Instagram className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Youtube className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Home
                  </a>
                </li>
                <li>
                  <button onClick={onOpenWallet} className="hover:text-black transition text-left cursor-pointer">
                    Wallet
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Contact information</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> info@swapster.fi
                </li>
                <li className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Telegram support
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-1 flex-shrink-0" />
                  <span>Kyrgyz Republic, Bishkek city, Logvinenko street, 55/5</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm text-slate-900">Our products</h4>
              <div className="space-y-3">
                <button
                  onClick={onOpenWallet}
                  className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all w-full cursor-pointer shadow-sm"
                >
                  <Apple className="w-4 h-4" />
                  Get the app
                </button>
                <button
                  onClick={onOpenWallet}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-all w-full cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Telegram Bot
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-xs text-gray-400 font-light">
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-gray-600 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600 transition">
                User Agreement
              </a>
              <a href="#" className="hover:text-gray-600 transition">
                AML/CFT Policy
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-gray-600 transition">
                Risk Management Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
