import { NextResponse } from 'next/server';
import { securityAuditor } from '@/core/security/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await securityAuditor.runFullAudit();
    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Security audit execution failed',
      },
      { status: 500 }
    );
  }
}
