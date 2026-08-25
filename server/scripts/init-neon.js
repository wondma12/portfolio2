import dotenv from 'dotenv';
import fs from 'node:fs';
import pg from 'pg';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
}

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

try {
    await client.connect();
    const schema = fs.readFileSync(new URL('../../database/database.sql', import.meta.url), 'utf8');
    await client.query(schema);
    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log(`Neon schema initialized. Tables: ${result.rows.map(row => row.table_name).join(', ')}`);
} finally {
    await client.end();
}
