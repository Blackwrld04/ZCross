import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | ZCross Protocol',
  description: 'Autonomous refund protocol SLA, blockchain finality rules, and fiat on-ramp refund mechanisms for ZCross.',
};

export default function RefundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
