import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

const pgPool = new Pool(config.db.connectionString
    ? {
        connectionString: config.db.connectionString,
        ssl: { rejectUnauthorized: false }
    }
    : {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        port: config.db.port,
        ssl: config.db.ssl ? { rejectUnauthorized: false } : undefined,
        max: config.db.connectionLimit
    });

const toPostgresQuery = (sql) => {
    let parameterIndex = 0;
    return sql.replace(/\?/g, () => `$${++parameterIndex}`);
};

const pool = {
    async query(sql, parameters = []) {
        const normalizedSql = /^\s*INSERT\b/i.test(sql) && !/\bRETURNING\b/i.test(sql)
            ? `${sql} RETURNING id`
            : sql;
        const result = await pgPool.query(toPostgresQuery(normalizedSql), parameters);
        return [result.rows, {
            affectedRows: result.rowCount,
            insertId: result.rows[0]?.id
        }];
    },
    execute(sql, parameters = []) {
        return this.query(sql, parameters);
    },
    async getConnection() {
        const client = await pgPool.connect();
        return {
            query: (sql, parameters) => client.query(toPostgresQuery(sql), parameters),
            release: () => client.release()
        };
    }
};

// Test connection
const testConnection = async () => {
    try {
        const connection = await pgPool.connect();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
};

testConnection();

export default pool;