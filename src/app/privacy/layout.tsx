import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ZCross Protocol',
  description: 'Exhaustive data collection disclosure, zero-knowledge privacy standards, third-party integrations, and GDPR/CCPA rights for ZCross Protocol.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
