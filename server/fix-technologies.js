import mysql from 'mysql2/promise';

async function fixTechnologies() {
    // IMPORTANT: Change this to your MySQL password
    const MYSQL_PASSWORD = 'Haymi@mysql1'; // Put your password here
    
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: MYSQL_PASSWORD,
        database: 'portfolio_db'
    });
    
    try {
        console.log('\n🔧 Fixing technologies format...\n');
        
        // Get all projects
        const [projects] = await connection.query('SELECT id, technologies FROM projects');
        
        for (const project of projects) {
            console.log(`Processing project ${project.id}: ${project.technologies}`);
            
            // Convert comma-separated string to JSON array
            if (project.technologies && typeof project.technologies === 'string') {
                // Split by comma and trim whitespace
                const techArray = project.technologies.split(',').map(t => t.trim());
                const techJson = JSON.stringify(techArray);
                
                // Update the database
                await connection.query(
                    'UPDATE projects SET technologies = ? WHERE id = ?',
                    [techJson, project.id]
                );
                console.log(`✅ Fixed project ${project.id}: ${project.technologies} -> ${techJson}\n`);
            }
        }
        
        // Verify the fix
        console.log('\n🔍 Verifying fix...\n');
        const [updatedProjects] = await connection.query('SELECT id, technologies FROM projects');
        
        for (const project of updatedProjects) {
            try {
                const parsed = JSON.parse(project.technologies);
                console.log(`✅ Project ${project.id}: ${parsed.join(', ')}`);
            } catch (e) {
                console.log(`❌ Project ${project.id} still has invalid format: ${project.technologies}`);
            }
        }
        
        console.log('\n✅ All technologies fixed!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixTechnologies();