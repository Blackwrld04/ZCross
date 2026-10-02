import React from 'react';
import { CircleDot } from 'lucide-react';
import {
  ZcashIcon,
  SolanaIcon,
  UsdcIcon,
  BitcoinIcon,
  EthereumIcon,
  ArbitrumIcon,
  BaseIcon,
  NearIcon,
} from './BrandLogos';

interface TokenIconProps {
  symbol?: string;
  chain?: string;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({
  symbol = '',
  chain = '',
  className = 'w-5 h-5',
}) => {
  const sym = symbol.toUpperCase().trim();
  const ch = chain.toLowerCase().trim();

  // 1. Match by Symbol
  if (sym === 'ZEC') {
    return <ZcashIcon className={className} />;
  }
  if (sym === 'SOL') {
    return <SolanaIcon className={className} />;
  }
  if (sym === 'USDC' || sym === 'USDT') {
    return <UsdcIcon className={className} />;
  }
  if (sym === 'BTC' || sym === 'WBTC') {
    return <BitcoinIcon className={className} />;
  }
  if (sym === 'ETH' || sym === 'WETH') {
    return <EthereumIcon className={className} />;
  }
  if (sym === 'ARB') {
    return <ArbitrumIcon className={className} />;
  }
  if (sym === 'NEAR') {
    return <NearIcon className={className} />;
  }

  // 2. Match by Chain if symbol didn't match
  if (ch === 'sol') {
    return <SolanaIcon className={className} />;
  }
  if (ch === 'arb') {
    return <ArbitrumIcon className={className} />;
  }
  if (ch === 'base') {
    return <BaseIcon className={className} />;
  }
  if (ch === 'eth') {
    return <EthereumIcon className={className} />;
  }
  if (ch === 'btc') {
    return <BitcoinIcon className={className} />;
  }
  if (ch === 'near') {
    return <NearIcon className={className} />;
  }
  if (ch === 'zec') {
    return <ZcashIcon className={className} />;
  }

  return <CircleDot className={`${className} text-gray-500`} />;
};
