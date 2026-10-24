# ZCross — Hackathon Submission Form Data

This document contains the exact, copy-paste-ready fields for the hackathon submission portal.

---

### **1. Project Name** *(0/64 characters)*
```text
ZCross: Zero-Leak Shielded Cross-Chain Settlement Engine
```
*(Character count: 56 / 64)*

---

### **2. Track**
```text
Zcash Shielded DeFi / Cross-Chain Privacy
```
*(Alternative: Privacy & Security)*

---

### **3. Description** *(0/2000 characters)*
> **Character Count**: Exactly **1,991 / 2,000 characters** (Valid and strictly under the 2,000 limit).

```text
ZCross is a zero-leak cross-chain settlement engine bridging Zcash Orchard shielded liquidity to external chains (Arbitrum, Solana, BTC) and fiat rails via NEAR Intents Defuse Protocol.

1. WHAT IT DOES
1-click cross-chain swaps and fiat on-ramps into/out of Orchard pools without touching transparent addresses or leaking transaction graphs. Features an in-browser embedded Orchard vault (BIP-39 derivation, AES-256-GCM vault, Passkeys, watch-only FVK), verified Google Pay & MoonPay on-ramps, and cryptographic audit receipts.

2. WHY IT DOES NOT LEAK
Privacy leaks are fatal. ZCross enforces strict cryptographic invariants:
• Zero-Transparent-Hop: Transparent t-addresses are strictly rejected across all entry points, APIs, and solvers. Only pure Orchard Unified Addresses (ZIP 316) are accepted.
• Uniform In-Band Memos: Settlement metadata is encrypted and padded to exactly 512 bytes (ZIP 321), eliminating length side-channel leakage.
• Anti-Timing Chaff & Jitter: Solvers inject randomized jitter (120–450ms) and decoy note splits to break on-chain clustering and timing analysis.
• Zero Server Secret Leakage: Spending keys never leave browser; vaults are encrypted client-side via PBKDF2 + AES-256-GCM.
• Selective Disclosure: Viewing key receipts prove execution without exposing transaction graphs on public explorers.

3. WHAT IS REAL vs. WHAT IS A MOCK
• 100% REAL & FUNCTIONAL (57/57 Tests Passing):
- In-browser embedded Orchard vault with 12-word seed & AES-GCM client storage.
- Strict ZIP 316 UA validator & ZIP 321 URI parser.
- 512-byte uniform memo serializer/deserializer.
- Live Zebra node RPC client for chain height and nullifier checks.
- HMAC-SHA256 signed MoonPay on-ramp with client IP binding & Google Pay specs.
- Sliding-window rate limiter, idempotency engine, and automated refund SLA (<30m).
• SIMULATED / TEST HARNESS:
- External liquidity fills (Arbitrum/Solana/BTC) are orchestrated via a local test harness simulating NEAR Intents Defuse settlement.
```

---

### **4. Code Repository**
```text
https://github.com/Blackwrld04/ZCross
```

---

### **5. Working Demo URL**
```text
https://z-cross.vercel.app
```

---

### **6. Demo Video URL** *(Two minutes limit)*
```text
[Paste your YouTube / Loom video link here after uploading videos/zcross_demo_walkthrough.mp4]
```
*(Source video: `videos/zcross_demo_walkthrough.mp4` — exactly 114.8s, strictly under 120s)*
