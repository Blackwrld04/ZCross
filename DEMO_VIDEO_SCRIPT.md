# ZCross — 2-Minute Demo Video Script & Walkthrough (120 Seconds)

> **Judge Rubric Priorities**: Privacy, Security, Technical Execution, and Mathematical Proof of Zero Metadata Leakage.  
> **Target Duration**: Exactly 2 Minutes (120 Seconds).  
> **Recommended Screen Size**: 1080p (1920x1080) or 1440p, browser in Dark Mode at 100% zoom.  
> **Live Demo URL**: [https://z-cross.vercel.app](https://z-cross.vercel.app) (or local: `http://localhost:3001`)

---

## Pre-Recording Setup & Rehearsal (10 Seconds Before Recording)

1. Open [https://z-cross.vercel.app](https://z-cross.vercel.app) in your browser.
2. If a wallet is currently connected, click the wallet badge in the top right, open the modal, and click **`Disconnect`** (or run `localStorage.clear()` in DevTools console and reload).
3. Confirm the top-right header displays the amber **`[ 🛡️ Connect Vault ]`** button.
4. Prepare your microphone and screen recorder (Loom, OBS, or QuickTime).

---

## Timestamped 2-Minute Script (120 Seconds)

| Timestamp | Visual Action on Screen | Voiceover Narration |
| :--- | :--- | :--- |
| **0:00 – 0:15** <br>*(15 sec)* | **Open Homepage**: Show [https://z-cross.vercel.app](https://z-cross.vercel.app). <br>• Highlight pitch-black dark mode theme, live ZEC price graph, and Swap Card. <br>• Point to the amber **`[ 🛡️ Connect Vault ]`** button in the navbar. | *"Decentralized finance has a fatal privacy flaw: public blockchains broadcast your entire transaction graph, wallet balance, and counterparty history. This is ZCross: a zero-leak cross-chain settlement engine bridging Zcash Orchard shielded liquidity directly to external chains and fiat rails via the NEAR Intents Defuse Protocol."* |
| **0:15 – 0:40** <br>*(25 sec)* | **Demonstrate Fresh Vault Creation**: <br>1. Click **`Connect Vault`** in the header. <br>2. Modal opens with **`Create New Vault`** tab selected. <br>3. Highlight features: Zero Server Trust, Pure ZIP-316 Orchard, AES-256-GCM. <br>4. Click **`Generate 12-Word Shielded Vault`**. <br>5. Show the **12-word seed phrase** in the 3×4 numbered grid. <br>6. Click **`Copy 12-Word Phrase`** (shows green checkmark). <br>7. Click **`Enter Shielded Vault (5.0000 ZEC Ready) →`**. <br>8. Show live Unified Address (`u1q...`) and `5.0000 ZEC` balance. Point out the **`Disconnect`** button in the header. | *"First, onboarding. Users shouldn't need a bulky desktop node or trusted third-party wallet to access shielded privacy. ZCross features an in-browser embedded Zcash Orchard vault. With zero server interaction, it generates a fresh BIP-39 12-word recovery phrase, derives pure ZIP-316 Unified Addresses, and encrypts keys client-side using AES-256-GCM. Your private spending keys never leave your browser."* |
| **0:40 – 1:00** <br>*(20 sec)* | **Demonstrate Zero-Transparent-Hop Protection**: <br>1. Close modal and go to Swap Card. <br>2. Set amount to `1.5 ZEC` to `Arbitrum USDC`. <br>3. Paste a transparent Zcash address starting with `t1...` (e.g., `t1Vpr43td58oTpx84tE9sJz9K9zYv7s6e4d`) into recipient. <br>4. Point to the **Red Warning Banner**: *"Transparent t-addresses strictly rejected. Zero transparent hops allowed."* | *"Now, the core privacy guarantee that judges score first. Transparent addresses are fatal to privacy because clustering heuristics easily deanonymize users. ZCross enforces a strict Zero-Transparent-Hop invariant: transparent t-addresses are strictly rejected across all entry points, APIs, and solvers. Zero transparent hops are permitted."* |
| **1:00 – 1:25** <br>*(25 sec)* | **Execute 1-Click Cross-Chain Swap**: <br>1. Clear the recipient and enter a valid Arbitrum address (`0x71C...` or click Address Book / Connect Wallet). <br>2. Click **`INSTANT SHIELDED SWAP (1-CLICK IN-APP)`**. <br>3. Show the signing spinner and instant settlement. <br>4. Point out the **512-Byte In-Band Encrypted Memo** and **Solver Jitter & Anti-Timing Chaff** protection. <br>5. Show the updated shielded balance and cryptographic receipt hash (`rcpt_...`). | *"When executing a swap, settlement metadata is packaged into a ZIP-321 in-band encrypted memo padded to exactly 512 bytes, eliminating length side-channel leakage. To thwart on-chain statistical clustering, our solver engine injects randomized jitter (120 to 450ms) and anti-timing chaff decoy note splits to break correlation between deposit and settlement."* |
| **1:25 – 1:45** <br>*(20 sec)* | **Demonstrate Fiat On-Ramp (Google Pay & MoonPay)**: <br>1. Click **`Buy ZEC`** (or open the Google Pay / Fiat modal). <br>2. Show the Google Pay Direct lowest-fee rail alongside authenticated MoonPay card integration. <br>3. Open the MoonPay checkout widget with cryptographic signature verified. | *"Need to on-ramp? Users can go from fiat to Orchard shielded privacy in seconds. With biometric Google Pay tokenization and authenticated MoonPay card rails, users purchase shielded ZEC directly into their in-browser vault without leaking their public identity on-chain."* |
| **1:45 – 2:00** <br>*(15 sec)* | **Code & Security Proof**: <br>1. Switch to terminal showing all **57/57 automated unit & security tests passing** (`npm test`). <br>2. Show the production build running cleanly. <br>3. Return to the home screen. | *"ZCross is production-tested with 57 automated cryptographic and security verification tests covering rate-limiting, idempotency, and live node nullifier checks. Real privacy isn't an afterthought — it's mathematically enforced from Orchard to external chains. Experience zero-leak privacy today on ZCross."* |

---

## Quick Cheat Sheet for Recording

### Addresses to Copy-Paste During Video

- **Invalid Transparent Address (to demonstrate rejection)**:
  ```text
  t1Vpr43td58oTpx84tE9sJz9K9zYv7s6e4d
  ```
- **Valid Destination Arbitrum Address (to demonstrate successful swap)**:
  ```text
  0x71C8363837918a71018282083710892018371029
  ```
- **Valid Destination Solana Address (optional)**:
  ```text
  9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin
  ```

### Re-recording a Take
If you make a mistake while recording:
1. Click the wallet badge in the top right.
2. Click **`Disconnect`**.
3. You are instantly back to the fresh **`[ 🛡️ Connect Vault ]`** state with no stored wallet!
