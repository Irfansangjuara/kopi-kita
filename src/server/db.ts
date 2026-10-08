import pg from 'pg';
import { reportServerError } from './observability';

const { Pool } = pg;

// Fix for DATE type: return as 'YYYY-MM-DD' string instead of JavaScript Date object.
// Without this, node-postgres shifts DATE values to UTC midnight which causes off-by-one
// day errors in WIB (UTC+7).
pg.types.setTypeParser(1082, (val: string) => val);

let pool: InstanceType<typeof Pool> | null = null;

export function getPool(): InstanceType<typeof Pool> {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Vercel/serverless: keep idle connections low so they don't pile up
      max: 10,
      idleTimeoutMillis: 30000,
    });
    pool.on('error', (err) => {
      reportServerError(err, 'Unexpected database error');
    });
  }
  return pool;
}
