import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, '../..');

async function migrate() {
  try {
    console.log('Running database migrations...');
    
    // Read and execute schema
    const schemaPath = join(apiRoot, 'db/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('✓ Schema created');
    
    // Read and execute seed
    const seedPath = join(apiRoot, 'db/seed.sql');
    const seed = readFileSync(seedPath, 'utf-8');
    await pool.query(seed);
    console.log('✓ Seed data inserted');
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
