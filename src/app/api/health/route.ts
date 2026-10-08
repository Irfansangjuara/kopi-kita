import { getPool } from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    await getPool().query('SELECT 1');

    return Response.json(
      { status: 'ok' },
      { status: 200, headers: noStoreHeaders },
    );
  } catch {
    return Response.json(
      { status: 'error' },
      { status: 503, headers: noStoreHeaders },
    );
  }
}
