import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_db',
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