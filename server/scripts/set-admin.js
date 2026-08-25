import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pg from 'pg';

dotenv.config();

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD are required');
}

const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
const username = ADMIN_EMAIL.split('@')[0].slice(0, 50) || 'admin';

try {
    await client.connect();
    await client.query('BEGIN');
    const result = await client.query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (email) DO UPDATE SET
             password_hash = EXCLUDED.password_hash,
             role = 'admin',
             updated_at = CURRENT_TIMESTAMP
         RETURNING id, email, role`,
        [username, ADMIN_EMAIL, passwordHash]
    );
    await client.query('COMMIT');

    const verified = await bcrypt.compare(ADMIN_PASSWORD, passwordHash);
    if (!verified) {
        throw new Error('Password verification failed');
    }

    console.log(`Admin account configured: ${result.rows[0].email} (${result.rows[0].role})`);
} catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
} finally {
    await client.end();
}
