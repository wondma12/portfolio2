import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

export const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Portfolio" <${config.email.user}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        };
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};