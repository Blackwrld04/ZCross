import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * 1. Solflare Wallet Official Logo
 * Radiant flame mark in Solflare's signature warm orange gradient
 */
export const SolflareLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="solflare-bg-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1A1225" />
        <stop offset="1" stopColor="#0B0714" />
      </linearGradient>
      <linearGradient id="solflare-flame" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF9B26" />
        <stop offset="0.6" stopColor="#FC7227" />
        <stop offset="1" stopColor="#EA4800" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#solflare-bg-grad)" />
    <path
      d="M12 3.8c-.3 0-.6.2-.8.5-1.2 1.8-2.7 4.4-2.7 7 0 2.8 1.9 5 4.4 5.3-.3-.9-.4-1.9-.2-2.8.2-1 .7-1.9 1.5-2.6 1.6-1.5 2.6-3.6 2.6-5.9 0-.3-.3-.5-.6-.5-.2 0-.4.1-.5.3-1 1.1-2.1 2.1-3.5 2.8.2-1.3.1-2.7-.4-4.1z"
      fill="url(#solflare-flame)"
    />
    <path
      d="M12 11c-.9.9-1.6 2-1.6 3.2 0 1.8 1.4 3.2 3.2 3.2s3.2-1.4 3.2-3.2c0-.7-.2-1.3-.6-1.8-.8.9-2 1.5-3.3 1.5-.2 0-.5 0-.7-.1.6-1.1.4-2.1-.2-2.8z"
      fill="#FFDC26"
    />
  </svg>
);

/**
 * 2. Phantom Wallet Official Logo
 * Signature Phantom ghost on pastel purple
 */
export const PhantomLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#AB9FF2" />
    <path
      d="M19 12.2c-.2-4.1-3.6-7.3-7.8-7.3-4.4 0-8 3.6-8 8 0 2.2 1 4.3 2.5 5.8.3.3.9.5 1.3.3.6-.2.8-.7.8-1.2v-1c0-1 .8-1.8 1.8-1.8h3.8c1 0 1.8.8 1.8 1.8v1.8c0 .6.4 1.2.9 1.4.5.2 1.2 0 1.6-.5 1.1-1.4 1.7-3.2 1.7-5.3z"
      fill="#1C173B"
    />
    <ellipse cx="8.8" cy="11.8" rx="1.1" ry="1.6" fill="#AB9FF2" />
    <ellipse cx="14" cy="11.8" rx="1.1" ry="1.6" fill="#AB9FF2" />
  </svg>
);

/**
 * 3. MetaMask Official 3D Fox Logo
 * Low-poly faceted iconic geometric fox
 */
export const MetaMaskLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    {/* Outer ears */}
    <path d="M2.5 4l8.5 7-2.5-5.5L2.5 4z" fill="#E2761B" />
    <path d="M29.5 4l-8.5 7 2.5-5.5L29.5 4z" fill="#E2761B" />
    {/* Inner ear folds */}
    <path d="M8.5 5.5l2.5 5.5 6-3.5-1-3-7.5 1z" fill="#E4751F" />
    <path d="M23.5 5.5l-2.5 5.5-6-3.5 1-3 7.5 1z" fill="#E4751F" />
    {/* Upper cheeks */}
    <path d="M2.5 4l8.5 7-6 5.5-2.5-12.5z" fill="#E4751F" />
    <path d="M29.5 4l-8.5 7 6 5.5 2.5-12.5z" fill="#E4751F" />
    {/* Lower white cheeks */}
    <path d="M5 16.5l6-5.5-1.5 5 1.5 3-6-2.5z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M27 16.5l-6-5.5 1.5 5-1.5 3 6-2.5z" fill="#FFFFFF" fillOpacity="0.9" />
    {/* Face Center */}
    <path d="M11 11l5-3.5 5 3.5-2 6-3 1.5-3-1.5-2-6z" fill="#E2761B" />
    <path d="M11 11l3 6.5-4-1.5 1-5z" fill="#CD6116" />
    <path d="M21 11l-3 6.5 4-1.5-1-5z" fill="#CD6116" />
    {/* Eyes */}
    <path d="M9.5 16l1.5-2.8 2.8 1.4-4.3 1.4z" fill="#161616" />
    <path d="M22.5 16l-1.5-2.8-2.8 1.4 4.3 1.4z" fill="#161616" />
    {/* Snout & Nose */}
    <path d="M14 17.5l2-1.5 2 1.5-2 3-2-3z" fill="#161616" />
    <path d="M12.5 20.5l3.5 2 3.5-2-1.5 4-2 1-2-1-1.5-4z" fill="#CD6116" />
  </svg>
);

/**
 * 4. Rabby Wallet Official Logo
 * DeBank's signature turtle helmet mascot
 */
export const RabbyLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#8697FF" />
    <path
      d="M12 4C7.8 4 4.5 7.3 4.5 11.4c0 2.2.9 4.2 2.3 5.6v2.3c0 .4.4.6.7.4l1.7-1c.9.4 1.8.6 2.8.6s1.9-.2 2.8-.6l1.7 1c.3.2.7 0 .7-.4v-2.3c1.4-1.4 2.3-3.4 2.3-5.6C19.5 7.3 16.2 4 12 4z"
      fill="#FFFFFF"
    />
    {/* Eyes & mask */}
    <ellipse cx="9" cy="11.3" rx="1.4" ry="1.9" fill="#1E2036" />
    <circle cx="8.6" cy="10.6" r="0.6" fill="#FFFFFF" />
    <ellipse cx="15" cy="11.3" rx="1.4" ry="1.9" fill="#1E2036" />
    <circle cx="14.6" cy="10.6" r="0.6" fill="#FFFFFF" />
    {/* Smile */}
    <path d="M11 13.6c.6.4 1.4.4 2 0" stroke="#1E2036" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 5. Zerion Official Logo
 * Origami double-angled "Z" ribbon in Zerion blue
 */
export const ZerionLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#2962FF" />
    <path
      d="M6 7.5h8.5l3.5 3.5H9.5L6 7.5z"
      fill="#FFFFFF"
    />
    <path
      d="M9.5 11h8.5l-3.5 5.5H6L9.5 11z"
      fill="#FFFFFF"
      fillOpacity="0.82"
    />
    <path
      d="M9.5 11h8.5l-3.5 2H6l3.5-2z"
      fill="#0037BD"
      fillOpacity="0.35"
    />
  </svg>
);

/**
 * 6. Coinbase Wallet Official Logo
 * Circular Coinbase blue badge with squircle card & cutout
 */
export const CoinbaseLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#0052FF" />
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.8" fill="#FFFFFF" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.4" fill="#0052FF" />
  </svg>
);

/**
 * 7. Trust Wallet Official Logo
 * Shield with signature dynamic two-tone split
 */
export const TrustLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#0500FF" />
    <path
      d="M12 4.5L6 6.8v5.5c0 4.2 2.6 8.1 6 9.2 3.4-1.1 6-5 6-9.2V6.8L12 4.5z"
      fill="#FFFFFF"
      fillOpacity="0.18"
      stroke="#FFFFFF"
      strokeWidth="1.1"
    />
    <path
      d="M12 6.5v11.6c2.4-.9 4.3-3.8 4.3-7V8.2L12 6.5z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 8. Rainbow Wallet Official Logo
 * Signature concentric multi-colored arcade arches
 */
export const RainbowLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#0E0D14" />
    <path d="M5 18a7 7 0 0 1 14 0" stroke="#FF453A" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7.2 18a4.8 4.8 0 0 1 9.6 0" stroke="#FFD60A" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.4 18a2.6 2.6 0 0 1 5.2 0" stroke="#30D158" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11.2 18a.8.8 0 0 1 1.6 0" stroke="#0A84FF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 9. Backpack Wallet Official Logo
 * Coral red squircle with signature white tech backpack emblem
 */
export const BackpackLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#E33E38" />
    <path
      d="M7.5 6.5A1.5 1.5 0 0 1 9 5h6a1.5 1.5 0 0 1 1.5 1.5V9H7.5V6.5z"
      fill="#FFFFFF"
    />
    <rect x="6.8" y="10" width="10.4" height="8.5" rx="1.5" fill="#FFFFFF" />
    <path d="M9.2 13.2h5.6M9.2 15.4h5.6" stroke="#E33E38" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 10. OKX Wallet Official Logo
 * Global OKX 5-Square Checkerboard Cross
 */
export const OKXLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#000000" />
    <rect x="5.5" y="5.5" width="4" height="4" rx="0.5" fill="#FFFFFF" />
    <rect x="14.5" y="5.5" width="4" height="4" rx="0.5" fill="#FFFFFF" />
    <rect x="10" y="10" width="4" height="4" rx="0.5" fill="#FFFFFF" />
    <rect x="5.5" y="14.5" width="4" height="4" rx="0.5" fill="#FFFFFF" />
    <rect x="14.5" y="14.5" width="4" height="4" rx="0.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 11. Ctrl (formerly XDEFI) Official Logo
 * Modern dark slate squircle with cyan keyboard Ctrl brackets
 */
export const CtrlLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#0F172A" />
    <path
      d="M7 8.5C7 7.7 7.7 7 8.5 7H11v2H9v6h2v2H8.5A1.5 1.5 0 0 1 7 15.5v-7zM17 8.5C17 7.7 16.3 7 15.5 7H13v2h2v6h-2v2h2.5c.8 0 1.5-.7 1.5-1.5v-7z"
      fill="#38BDF8"
    />
    <rect x="11.2" y="11.2" width="1.6" height="1.6" rx="0.3" fill="#FFFFFF" />
  </svg>
);

/**
 * 12. Keplr Wallet Official Logo
 * Distinctive 3-color angled triangular prism / star
 */
export const KeplrLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#0E121E" />
    {/* Top facet - cyan */}
    <path d="M12 4.5L16 11H8L12 4.5Z" fill="#00C9FF" />
    {/* Bottom left facet - blue */}
    <path d="M8 11L12 18.5L7 16.5L8 11Z" fill="#3B82F6" />
    {/* Bottom right facet - violet */}
    <path d="M16 11L17 16.5L12 18.5L16 11Z" fill="#8B5CF6" />
    <circle cx="12" cy="11.5" r="1.4" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
 * 13. Zashi Official Logo
 * Electric Coin Company's official Zcash mobile wallet
 */
export const ZashiLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path
      d="M6.5 7h11l-7 7.5h7v2.5h-11l7-7.5h-7V7z"
      fill="#F4B728"
    />
  </svg>
);

/**
 * 14. YWallet Official Logo
 * Shield with stylized cyan Y
 */
export const YWalletLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#081426" />
    <path
      d="M12 4.5L6.5 6.8v4.8c0 3.8 2.3 7.2 5.5 8.2 3.2-1 5.5-4.4 5.5-8.2V6.8L12 4.5z"
      fill="#00D2FF"
      fillOpacity="0.22"
      stroke="#00D2FF"
      strokeWidth="1.1"
    />
    <path
      d="M9 8.2l3 3.8 3-3.8h-1.8L12 9.7l-1.2-1.5H9zM11 12h2v4h-2v-4z"
      fill="#00D2FF"
    />
  </svg>
);

/**
 * 15. Zodl Official Logo
 * Minimalist emerald ring with Z mark
 */
export const ZodlLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#111827" />
    <circle cx="12" cy="12" r="5.8" stroke="#10B981" strokeWidth="1.4" />
    <path d="M10 9.5h4l-4 5h4" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 16. Zcash (ZEC) Official Cryptocurrency Logo
 * Amber disc with letter Z pierced by vertical bars
 */
export const ZcashIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#F4B728" />
    <rect x="11" y="4" width="2" height="3" rx="0.5" fill="#FFFFFF" />
    <rect x="11" y="17" width="2" height="3" rx="0.5" fill="#FFFFFF" />
    <path
      d="M7.5 7h9v2.2l-6 6.3h6v2.5h-9v-2.2l6-6.3h-6V7z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 17. Solana (SOL) Official Logo
 * Three horizontal parallel gradient bars with angled tips
 */
export const SolanaIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="sol-official-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00FFA3" />
        <stop offset="100%" stopColor="#DC1FFF" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="12" fill="#000000" />
    <path
      d="M6 7.2a.8.8 0 0 1 .6-.3h10.8a.4.4 0 0 1 .3.7l-2.3 2.3a.8.8 0 0 1-.6.3H4a.4.4 0 0 1-.3-.7l2.3-2.3z"
      fill="url(#sol-official-grad)"
    />
    <path
      d="M4 11.2a.4.4 0 0 1 .3-.7h10.8a.8.8 0 0 1 .6.3l2.3 2.3a.4.4 0 0 1-.3.7H6.9a.8.8 0 0 1-.6-.3L4 11.2z"
      fill="url(#sol-official-grad)"
    />
    <path
      d="M6 15.2a.8.8 0 0 1 .6-.3h10.8a.4.4 0 0 1 .3.7l-2.3 2.3a.8.8 0 0 1-.6.3H4a.4.4 0 0 1-.3-.7l2.3-2.3z"
      fill="url(#sol-official-grad)"
    />
  </svg>
);

/**
 * 18. USD Coin (USDC) Official Logo
 * Blue circle with interlocking crescent arcs and dollar glyph
 */
export const UsdcIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#2775CA" />
    <path
      d="M12 5.5a6.5 6.5 0 0 0-4.6 11.1l1.4-1.4a4.5 4.5 0 0 1 3.2-7.7c1.7 0 3.2 1 3.9 2.5l1.9-.9A6.5 6.5 0 0 0 12 5.5z"
      fill="#FFFFFF"
    />
    <path
      d="M12 18.5a6.5 6.5 0 0 0 4.6-11.1l-1.4 1.4a4.5 4.5 0 0 1-3.2 7.7c-1.7 0-3.2-1-3.9-2.5l-1.9.9a6.5 6.5 0 0 0 5.8 3.6z"
      fill="#FFFFFF"
    />
    <path
      d="M11.2 8.5v1.2c-.8.2-1.4.7-1.4 1.5 0 1 .9 1.4 1.8 1.6.8.2 1.2.4 1.2.8 0 .4-.4.7-1 .7-.7 0-1.2-.3-1.4-.7l-1 .6c.4.7 1 1.1 1.8 1.3v1.2h1.2v-1.2c.9-.2 1.6-.8 1.6-1.6 0-1.1-.9-1.5-1.9-1.7-.8-.2-1.1-.4-1.1-.8 0-.4.3-.6.9-.6.6 0 1 .2 1.3.5l.9-.7c-.4-.5-.9-.8-1.6-.9V8.5h-1.4z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 19. Bitcoin (BTC / WBTC) Official Logo
 * Classic orange circle with 14-degree tilted ₿
 */
export const BitcoinIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#F7931A" />
    <path
      d="M16.5 10.4c.2-1.4-.9-2.2-2.4-2.7l.5-2-1.2-.3-.5 2c-.3-.1-.6-.2-1-.2l.5-2-1.2-.3-.5 2c-.3-.1-.5-.1-.8-.2l-1.7-.4-.3 1.3s.9.2.9.2c.5.1.6.4.6.6l-.6 2.5c0 0 .1 0 .2.1l-.2-.1-.9 3.5c-.1.2-.3.4-.6.3 0 0-.9-.2-.9-.2l-.6 1.4 1.6.4c.3.1.6.2.9.2l-.5 2 1.2.3.5-2c.3.1.6.2 1 .2l-.5 2 1.2.3.5-2c2.1.4 3.7.2 4.3-1.7.5-1.5 0-2.4-1.1-2.9.8-.5 1.4-1.2 1.2-2.5zm-2.2 4.9c-.4 1.5-3 .7-3.8.5l.7-2.7c.9.2 3.5.7 3.1 2.2zm.4-4.9c-.3 1.4-2.5.7-3.2.5l.6-2.5c.7.2 2.9.6 2.6 2z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 20. Ethereum (ETH) Official Logo
 * Iconic geometric octahedron diamond
 */
export const EthereumIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#627EEA" />
    <path d="M12 4L6.5 12.5 12 15.5l5.5-3L12 4z" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M12 4v11.5l5.5-3L12 4z" fill="#FFFFFF" />
    <path d="M12 16.5L6.5 13.5 12 20.5l5.5-7-5.5 3z" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M12 16.5v4l5.5-7-5.5 3z" fill="#FFFFFF" />
  </svg>
);

/**
 * 21. Arbitrum (ARB) Official Logo
 * Deep blue disc with signature white and navy chevron A
 */
export const ArbitrumIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="12" fill="#28A0F0" />
    <path
      d="M12 5.5l5.5 8.5h-3l-2.5-4-2.5 4h-3L12 5.5z"
      fill="#FFFFFF"
    />
    <path
      d="M9.5 14h5l-2.5 4-2.5-4z"
      fill="#121D28"
    />
  </svg>
);

/**
 * 22. Base Official Logo
 * Vibrant Base blue disc with white rounded crescent
 */
export const BaseIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#0052FF" />
    <path
      d="M12 5.5a6.5 6.5 0 1 0 6.5 6.5h-3a3.5 3.5 0 1 1-3.5-3.5v-3z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 23. NEAR Protocol Official Logo
 * Sleek black disc with white geometric N ribbon
 */
export const NearIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="12" fill="#000000" />
    <path
      d="M7.5 17.5V6.5h2.5l5 7V6.5h2v11h-2.5l-5-7v7h-2z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 24. Defuse Protocol Official Logo
 * Violet rounded square with precision delta mark
 */
export const DefuseIcon: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#8B5CF6" />
    <path
      d="M12 5l6 11H6l6-11z"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="12" cy="12.5" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 25. ZCross Official Logo (Concept 4: Bold Negative-Space Cross-Cut)
 * Heavyweight solid fintech Z with precision cross-cut geometry
 */
export const ZCrossLogo: React.FC<LogoProps & { variant?: 'black' | 'white' | 'auto' }> = ({
  className = 'w-6 h-6',
  variant = 'auto',
}) => {
  if (variant === 'white') {
    return (
      <img
        src="/brand/zcross-icon-white.png"
        alt="ZCross Logo"
        className={`object-contain select-none pointer-events-none inline-block ${className}`}
      />
    );
  }

  if (variant === 'black') {
    return (
      <img
        src="/brand/zcross-icon-black.png"
        alt="ZCross Logo"
        className={`object-contain select-none pointer-events-none inline-block ${className}`}
      />
    );
  }

  return (
    <>
      <img
        src="/brand/zcross-icon-black.png"
        alt="ZCross Logo"
        className={`dark:hidden object-contain select-none pointer-events-none inline-block ${className}`}
      />
      <img
        src="/brand/zcross-icon-white.png"
        alt="ZCross Logo"
        className={`hidden dark:inline-block object-contain select-none pointer-events-none ${className}`}
      />
    </>
  );
};

/**
 * 26. Google Pay Official Mark
 * Iconic 4-color Google G with clean modern Pay typography
 */
export const GooglePayLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"
      fill="#FFC107"
    />
    <path
      d="M6.3 14.7l6.6 4.8C14.7 15.5 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      fill="#FF3D00"
    />
    <path
      d="M24 44c5.2 0 10-1.9 13.5-5.3l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.6 39.5 16.2 44 24 44z"
      fill="#4CAF50"
    />
    <path
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2C37.2 39 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
      fill="#1976D2"
    />
  </svg>
);

export const GoogleGPayBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1 font-sans ${className}`}>
    <GooglePayLogo className="w-4 h-4 inline-block" />
    <span className="font-bold tracking-tight text-current">Pay</span>
  </span>
);


