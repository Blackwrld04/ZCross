'use client';

import React, { useState } from 'react';
import { 
  Zap, Shield, Globe, Send, ChevronDown, Check, 
  ArrowUpRight, ArrowUp, ArrowDown, ArrowLeftRight, MoreHorizontal, Gift, Home, BarChart2, Wallet, User 
} from 'lucide-react';

interface LandingPageProps {
  onOpenWallet: () => void;
  onOpenAuditor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWallet, onOpenAuditor }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-2xl tracking-tighter">swapster</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ml-2">
              Zcash Shielded
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAuditor}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              Zero-Leak Invariant Verified
            </button>
            <button 
              onClick={onOpenWallet}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition shadow-lg hover:shadow-xl"
            >
              Open Desktop Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
            <span>🛡️ Zcash Orchard (Halo 2) + NEAR Intents Protocol</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-950 font-geist">
            FINANCIAL TECHNOLOGIES<br />
            FOR LIMITLESS OPPORTUNITIES
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-normal">
            Zero-leak cross-chain liquidity connecting Zcash Shielded Orchard directly to Arbitrum, Solana, and Bitcoin via 512-byte encrypted note intents.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-neutral-800 transition-all w-full sm:w-auto justify-center shadow-xl hover:scale-105"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              Launch Cross-Chain Swap
            </button>
            <button
              onClick={onOpenAuditor}
              className="flex items-center gap-2 bg-white border border-gray-200 text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all w-full sm:w-auto justify-center"
            >
              <Shield className="w-5 h-5 text-emerald-600" />
              View Zero-Leak Rubric
            </button>
          </div>
        </div>

        {/* Phone & Background Text */}
        <div className="relative max-w-7xl mx-auto mt-[-40px]">
          {/* Giant Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <span className="text-[12rem] md:text-[18rem] font-black text-gray-100 opacity-90 tracking-tighter whitespace-nowrap select-none">
              SWAPSTER
            </span>
          </div>
          
          {/* Phone Mockup */}
          <div className="relative z-10 flex justify-center transform translate-y-12">
            <div className="relative w-[320px] md:w-[360px] bg-black rounded-[3rem] p-3.5 shadow-2xl ring-1 ring-gray-900/10">
              <div className="rounded-[2.5rem] overflow-hidden bg-gray-950 h-[660px] relative text-white">
                {/* Simulated App UI */}
                <div className="p-6 pt-12">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">🛡️</div>
                    <div className="text-xs text-amber-400 font-mono font-bold">ORCHARD</div>
                  </div>
                  <div className="text-center mb-8">
                    <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Shielded Balance</div>
                    <div className="text-4xl font-extrabold tracking-tight">$73,710.00</div>
                    <div className="text-xs text-emerald-400 mt-1">51.908 ZEC • Pure Shielded</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <button onClick={onOpenWallet} className="flex flex-col items-center gap-2 text-left cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-400 hover:text-black transition">
                        <ArrowUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400">Send</span>
                    </button>
                    <button onClick={onOpenWallet} className="flex flex-col items-center gap-2 text-left cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-400 hover:text-black transition">
                        <ArrowDown className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400">Receive</span>
                    </button>
                    <button onClick={onOpenWallet} className="flex flex-col items-center gap-2 text-left cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold shadow-lg">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-amber-400 font-bold">Swap</span>
                    </button>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                        <MoreHorizontal className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-gray-400">More</span>
                    </div>
                  </div>

                  {/* Active Asset Card */}
                  <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-extrabold text-lg">
                        Z
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Zcash (Shielded)</div>
                        <div className="text-xs text-gray-400">Orchard Pool • Halo 2</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">$1,420.00</div>
                        <div className="text-xs text-emerald-400">Zero-Leak</div>
                      </div>
                    </div>
                  </div>

                  {/* Referral Callout */}
                  <div className="bg-gradient-to-r from-emerald-950 to-gray-900 rounded-2xl p-4 border border-emerald-800/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-400 text-xs mb-1">NEAR Intents Bridge</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Directly route ZEC into Arbitrum USDC, Solana, & Bitcoin without unshielding.
                        </p>
                      </div>
                      <Gift className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900/90 backdrop-blur border-t border-gray-800 flex justify-around items-center px-4">
                  <Home className="w-5 h-5 text-amber-400" />
                  <BarChart2 className="w-5 h-5 text-gray-600" />
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Swapster in Numbers
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-center tracking-tight mb-16 max-w-2xl mx-auto">
            Valued by a global community,<br />strengthened by every shielded user
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">130K+</div>
              <div className="text-gray-500 font-normal text-sm md:text-base">Number of<br />Users</div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">2M+</div>
              <div className="text-gray-500 font-normal text-sm md:text-base">Monthly<br />Transactions</div>
            </div>
            <div className="text-center md:border-r border-gray-100 p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">$50B+</div>
              <div className="text-gray-500 font-normal text-sm md:text-base">Total Value<br />Transferred</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">30+</div>
              <div className="text-gray-500 font-normal text-sm md:text-base">Connected<br />Chains</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-lg">
              Cryptographic protection on every single step
            </h2>
            <div className="max-w-sm">
              <p className="text-gray-500 font-normal mb-4 text-sm">
                Zero-knowledge Halo 2 proofs and in-band encrypted memos ensure your transaction graph is never published.
              </p>
              <button onClick={onOpenAuditor} className="inline-flex items-center text-emerald-600 font-bold text-sm hover:text-emerald-700">
                LEARN MORE ABOUT ZERO-LEAK AUDITING →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 min-h-[380px] flex flex-col justify-between shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold mb-3">Global AML Compliance</h3>
                <p className="text-gray-500 text-sm">Automated screening via Viewing Keys without compromising private spending authority.</p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center">
                <Shield className="w-16 h-16 text-amber-500" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 min-h-[380px] flex flex-col justify-between shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold mb-3">Military-Grade ZK Proofs</h3>
                <p className="text-gray-500 text-sm">Halo 2 recursive zero-knowledge proving eliminates all trusted setups forever.</p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
                <Zap className="w-16 h-16 text-emerald-500" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 min-h-[380px] flex flex-col justify-between shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold mb-3">In-Band 512B Memos</h3>
                <p className="text-gray-500 text-sm">Cross-chain destinations and parameters are encrypted inside ChaCha20-Poly1305 note ciphertexts.</p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-to-tr from-cyan-50 to-blue-50 border border-cyan-100 flex items-center justify-center">
                <Globe className="w-16 h-16 text-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 uppercase">Swapster Services</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-normal">
              Shaping a future without borders between transparent blockchains and shielded Zcash liquidity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Desktop Wallet Card */}
            <div 
              onClick={onOpenWallet}
              className="bg-gray-950 rounded-[2.5rem] p-10 md:p-14 min-h-[460px] text-white flex flex-col justify-end group cursor-pointer hover:border hover:border-amber-400 transition relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-8 right-8">
                <span className="badge-tag badge-gold">Launch App ↗</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-3">Desktop Wallet</h3>
                <p className="text-gray-400 font-normal text-base max-w-md">
                  Full-scale shielded multitool. Generate ZIP 321 QR codes, inspect encrypted memos, and bridge into Arbitrum USDC with 1 click.
                </p>
              </div>
            </div>

            {/* Cross-Chain Solver Card */}
            <div 
              onClick={onOpenWallet}
              className="bg-gray-100 rounded-[2.5rem] p-10 md:p-14 min-h-[460px] flex flex-col justify-end group cursor-pointer hover:border hover:border-black transition relative overflow-hidden shadow-md"
            >
              <div className="absolute top-8 right-8">
                <span className="badge-tag badge-cyan">NEAR Intents</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-3 text-slate-950">Cross-Chain Solver</h3>
                <p className="text-gray-600 font-normal text-base max-w-md">
                  Instant programmatic solver execution. Fulfill swap intents atomically on Arbitrum, Solana, and Bitcoin without unshielding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">FAQ</h2>
            <p className="text-gray-500 text-sm">
              Have questions about Zcash Shielded Swaps? Learn how our zero-leak solver operates.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            {[
              {
                q: "Why is Z-HyperIntent zero-leak?",
                a: "Unlike traditional bridges that force you into transparent t-addresses, Z-HyperIntent operates strictly within the Orchard pool using Unified Addresses (u1...). Swap intents are encrypted inside the 512-byte memo field, meaning observers see zero sender graph or destination details."
              },
              {
                q: "How does the NEAR Intents integration work?",
                a: "We query live guaranteed quotes from the NEAR Intents 1Click API. Once a user sends a shielded note to the solver vault, the solver verifies the note commitment in the Orchard Merkle Tree and fulfills the foreign chain payout (e.g. Arbitrum USDC) via solvers."
              },
              {
                q: "Which wallets can I use to make swaps?",
                a: "Any modern Orchard-compatible Zcash wallet, including Zashi, Zodl, and Ycash. You simply scan the standard ZIP 321 QR code."
              },
              {
                q: "What if a solver fails to settle?",
                a: "Every swap intent includes a fallback deadline and an optional shielded refund address. If the solver does not settle within the timeout window, the funds are automatically refunded to the user's shielded address."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-200/60 shadow-sm"
                onClick={() => toggleFaq(i)}
              >
                <div className="flex justify-between items-center font-bold text-base text-slate-900">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && (
                  <div className="text-gray-600 mt-4 text-sm font-normal leading-relaxed">
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>swapster • z-hyperintent</span>
            </div>

            <div className="text-xs text-gray-400">
              Built for Zcash Hackathon 2026 • Cross-Chain Track ($15,000) & Grand Prize ($20,000)
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <a href="https://zips.z.cash/" target="_blank" rel="noopener noreferrer" className="hover:text-black">ZIPs ↗</a>
              <a href="https://docs.near-intents.org/" target="_blank" rel="noopener noreferrer" className="hover:text-black">NEAR Intents ↗</a>
              <button onClick={onOpenWallet} className="hover:text-black font-bold">Open App</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
