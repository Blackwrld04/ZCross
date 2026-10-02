import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZCross | Zero-Leak Shielded Cross-Chain Bridge for Zcash Orchard',
  description: 'Swap Shielded Zcash (Orchard pool) into Arbitrum USDC, Solana SOL, and Bitcoin without unshielding on the way through. Powered by Zcash Encrypted Memos and NEAR Intents.',
  keywords: ['ZCross', 'Zcash', 'Orchard', 'Halo 2', 'NEAR Intents', 'Cross-Chain', 'Privacy', 'ZIP 321', 'Zero Knowledge'],
};

import { PriceProvider } from '@/core/prices/PriceContext';
import { ThemeProvider } from '@/core/theme/ThemeContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png" />
        <link rel="apple-touch-icon" href="/brand/favicon-64.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('zcross_theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <PriceProvider>
            {children}
          </PriceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
