import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZCross | Zero-Leak Shielded Cross-Chain Bridge for Zcash Orchard',
  description: 'Swap Shielded Zcash (Orchard pool) into Arbitrum USDC, Solana SOL, and Bitcoin without unshielding on the way through. Powered by Zcash Encrypted Memos and NEAR Intents.',
  keywords: ['ZCross', 'Zcash', 'Orchard', 'Halo 2', 'NEAR Intents', 'Cross-Chain', 'Privacy', 'ZIP 321', 'Zero Knowledge'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
