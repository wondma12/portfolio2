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

export const emailService = {
    async sendContactNotification(contactData) {
        const { name, email, subject, message } = contactData;
        
        const mailOptions = {
            from: `"Portfolio Contact" <${config.email.user}>`,
            to: config.email.user,
            subject: `New Contact Message: ${subject}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email send error:', error);
        }
    },
    
    async sendWelcomeEmail(userEmail, username) {
        const mailOptions = {
            from: `"Portfolio" <${config.email.user}>`,
            to: userEmail,
            subject: 'Welcome to My Portfolio!',
            html: `
                <h2>Welcome ${username}!</h2>
                <p>Thank you for subscribing to my portfolio. I'll keep you updated with my latest projects and blog posts.</p>
                <p>Best regards,<br/>John Doe</p>
            `
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email send error:', error);
        }
    }
};