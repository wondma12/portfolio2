// import mysql from 'mysql2/promise';

// async function verifyData() {
//     const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Haymi@mysql1',
//         database: 'portfolio_db'
//     });
    
//     try {
//         console.log('\n🔍 Verifying database data...\n');
        
//         // Check users
//         const [users] = await connection.query('SELECT id, username, email, role FROM users');
//         console.log('✅ Users:');
//         users.forEach(user => {
//             console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
//         });
        
//         // Check projects
//         const [projects] = await connection.query('SELECT id, title, technologies FROM projects');
//         console.log('\n📊 Projects:');
//         for (const project of projects) {
//             console.log(`\n   ID: ${project.id}`);
//             console.log(`   Title: ${project.title}`);
//             console.log(`   Raw technologies: ${project.technologies}`);
//             try {
//                 const parsed = JSON.parse(project.technologies);
//                 console.log(`   ✅ Parsed technologies: ${parsed.join(', ')}`);
//             } catch (e) {
//                 console.log(`   ❌ Error parsing: ${e.message}`);
//             }
//         }
        
//         console.log('\n✅ Verification complete!');
        
//     } catch (error) {
//         console.error('❌ Error:', error.message);
//     } finally {
//         await connection.end();
//     }
// }

// verifyData();