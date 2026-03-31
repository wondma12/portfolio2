import pool from './src/config/db.js';

async function checkMessages() {
    try {
        const [messages] = await pool.query('SELECT * FROM messages');
        console.log('Messages in database:');
        messages.forEach(msg => {
            console.log(`ID: ${msg.id}, Status: ${msg.status}, From: ${msg.name}`);
        });
        
        if (messages.length === 0) {
            console.log('\nNo messages found. Add some test messages:');
            console.log('INSERT INTO messages (name, email, subject, message, status) VALUES');
            console.log("('Test User', 'test@example.com', 'Test Subject', 'Test Message', 'unread');");
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkMessages();