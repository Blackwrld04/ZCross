import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ZCross Protocol',
  description: 'Terms of service, limitation of liability, non-custodial software license, and regulatory compliance for ZCross Protocol.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
