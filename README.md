# 🛡️ ZCross: Zero-Leak Shielded Cross-Chain Bridge & Solver

> **Production-Grade Shielded Liquidity Infrastructure**  
> **Ecosystem Primitives**: Zcash Orchard (Halo 2) • ZIP 316 • ZIP 321 • NEAR Intents (Defuse Protocol) • SQLite State Machine

---

## 1. Executive Summary: Solving the "Zcash Island Problem"

Historically, Zcash has lived as an economic island:
* **The Delisting Crisis**: Centralized exchanges (CEXs) under regulatory pressure have restricted or delisted privacy assets.
* **The "Unshielding" Bridge Leak**: Past bridging solutions forced users to unshield to transparent addresses (`t-addr`), destroying the sender's privacy and exposing their wallet graph.
* **The ZCross Solution**: Swaps, bridges and intents that reach foreign chains directly from the Orchard shielded pool without unshielding on the way through.

**ZCross** is the premier cross-chain intent bridge and automated solver engine that enables users to swap Shielded Zcash (Orchard) directly into multi-chain assets (Arbitrum USDC, Solana SOL, Bitcoin, Ethereum) **without ever touching a transparent address or leaking metadata**.

---

## 2. Zero-Leak Cryptographic Invariants

| Privacy Vector | Industry Standard (Broken) | ZCross Solution |
| :--- | :--- | :--- |
| **Address Model** | Bridges generate transparent deposit addresses (`t1...`) | **100% Pure Shielded Unified Addresses (ZIP 316 `u1...`)**. Any transparent address is strictly rejected. |
| **Intent Metadata** | Orders and recipients are published in plaintext memo fields or public order books | **512-Byte In-Band Encrypted Memos (ChaCha20-Poly1305)**. Only the Solver's Incoming Viewing Key (`IVK`) can decrypt the intent. |
| **Length Side-Channels** | Ciphertext size leaks the payload structure | **Uniform 512-byte zero padding**. All note memos have identical length to defeat size analysis. |
| **Intermediary Hops** | Multi-hop unshielding through bridge contracts | **Direct Solver Fulfillment**. The user sends a shielded note; the solver delivers the foreign asset directly. |
| **Compliance & Auditing** | All-or-nothing (either 100% secret or 100% public) | **Zero-Knowledge Audit Receipts**. Uses viewing key fingerprints for tax/accounting without spending authority. |

---

## 3. End-to-End Architecture Flow

```
[ User Mobile Wallet (Zashi / Zodl) ]
            │
            │ 1. Scans ZIP 321 QR Code
            │    Sends 1.0 ZEC in Orchard Shielded Pool
            │    (512-Byte Encrypted Memo: { destChain: "arb", token: "USDC", to: "0x71c..." })
            ▼
[ Solver Shielded Vault (ZIP 316 UA) ]
            │
            │ 2. Solver Daemon scans compact blocks via Zebra RPC
            │    Decrypts note memo using Solver IVK
            ▼
[ Automated Solver Daemon (TypeScript / SQLite State Machine) ]
            │
            │ 3. Validates note nullifier in Orchard Merkle Tree
            │    Quotes NEAR Intents 1Click API for guaranteed settlement
            ▼
[ NEAR Intents Solver Network (1Click API / Defuse Protocol) ]
            │
            │ 4. Solver fulfills foreign leg (e.g., 1,420.00 USDC to User on Arbitrum)
            ▼
[ Foreign Destination (Arbitrum One) ]
            │
            │ 5. Payout delivered to User's 0x71c... address
            ▼
[ Cryptographic Settlement Receipt Generated ]
```

---

## 4. Quickstart Guide

### Prerequisites
* Node.js v18+ or v20+ (tested on Node.js v24.16.0)
* npm v10+

### 1. Installation
```bash
git clone <repo-url>
cd ZCASH
npm install
```

### 2. Run Test Suite (7/7 Passing)
Verify the core cryptographic modules, 512-byte memo serializer, ZIP 321 parser, and full solver lifecycle:
```bash
npm test
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 4. Run Standalone Background Solver Daemon
To run the background compact block scanner and solver dispatch daemon:
```bash
npm run solver
```

---

## 5. Project Structure

```
src/
├── core/
│   ├── crypto/
│   │   ├── zip316.ts        # Pure Shielded Unified Address (u1/utest1) validator
│   │   ├── zip321.ts        # ZIP 321 Payment Request URI generator
│   │   ├── memo.ts          # 512-byte constant-padded in-band memo serializer
│   │   └── receipt.ts       # Zero-knowledge cryptographic audit receipt generator
│   ├── near-intents/
│   │   ├── client.ts        # NEAR Intents 1Click API client (live tokens & quotes)
│   │   └── types.ts         # Type definitions matching Defuse Protocol specs
│   └── solver/
│       ├── store.ts         # Persistent SQLite database state machine with WAL mode
│       ├── engine.ts        # Solver coordination, memo decryption, and settlement
│       └── watcher.ts       # Standalone CLI solver daemon
├── components/
│   ├── Header.tsx           # Navigation, network toggle (Mainnet/Testnet), audit badges
│   ├── SwapCard.tsx         # Real-time exchange rates, input validation, Orchard invariants
│   ├── DepositModal.tsx     # Dynamic ZIP 321 QR code, 512B memo inspector, live pipeline
│   ├── ReceiptModal.tsx     # Cryptographic audit receipt with JSON export
│   ├── PrivacyAuditor.tsx   # Cryptographic verification & privacy invariant inspector
│   ├── LandingPage.tsx      # High-conversion product showcase & interactive flows
│   └── WalletDashboard.tsx  # Desktop wallet dashboard and node status
├── app/
│   ├── globals.css          # Tailored obsidian & gold glassmorphic design system
│   ├── page.tsx             # Main application orchestrator
│   └── api/
│       ├── quote/route.ts   # POST /api/quote
│       ├── tokens/route.ts  # GET /api/tokens
│       ├── swap/[id]/route.ts
│       └── swap/simulate/route.ts # State transition simulation endpoints
└── tests/
    ├── memo.test.ts         # 512-byte padding & length side-channel tests
    ├── zip321.test.ts       # URI encoding & parsing round-trip tests
    ├── zip316.test.ts       # UA validation & t-address disqualification tests
    └── engine.test.ts       # Full lifecycle integration tests
```

---

## 6. Official Documentation & References
* [Zcash Documentation](https://zcash.readthedocs.io/en/latest/)
* [Zcash Improvement Proposals (ZIPs)](https://zips.z.cash/)
* [Zcash Protocol Specification (ZIP 224: Orchard)](https://zips.z.cash/zip-0224)
* [ZIP 316: Unified Addresses](https://zips.z.cash/zip-0316)
* [ZIP 321: Payment Request URIs](https://zips.z.cash/zip-0321)
* [NEAR Intents Protocol (Defuse)](https://docs.near-intents.org/)
* [Electric Coin Co. / librustzcash](https://github.com/zcash/librustzcash)
* [Zcash Foundation Zebra](https://github.com/ZcashFoundation/zebra)

---

## License
MIT License • Open Source
