import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        connectionString: process.env.DATABASE_URL || '',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_db',
        port: Number(process.env.DB_PORT || 5432),
        ssl: process.env.DB_SSL === 'true',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expire: process.env.JWT_EXPIRE || '7d'
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};