import pool from './src/config/db.js';

async function fixTechnologies() {
    try {
        console.log('\n🔧 Fixing technologies format...\n');
        
        // Get all projects
        const [projects] = await pool.query('SELECT id, technologies FROM projects');
        
        for (const project of projects) {
            console.log(`Processing project ${project.id}: ${project.technologies}`);
            
            // Convert comma-separated string to JSON array
            if (project.technologies && typeof project.technologies === 'string') {
                // Split by comma and trim whitespace
                const techArray = project.technologies.split(',').map(t => t.trim());
                const techJson = JSON.stringify(techArray);
                
                // Update the database
                await pool.query(
                    'UPDATE projects SET technologies = ? WHERE id = ?',
                    [techJson, project.id]
                );
                console.log(`✅ Fixed project ${project.id}: ${project.technologies} -> ${techJson}\n`);
            }
        }
        
        // Verify the fix
        console.log('\n🔍 Verifying fix...\n');
        const [updatedProjects] = await pool.query('SELECT id, technologies FROM projects');
        
        for (const project of updatedProjects) {
            try {
                const parsed = typeof project.technologies === 'string'
                    ? JSON.parse(project.technologies)
                    : project.technologies;
                console.log(`✅ Project ${project.id}: ${parsed.join(', ')}`);
            } catch (e) {
                console.log(`❌ Project ${project.id} still has invalid format: ${project.technologies}`);
            }
        }
        
        console.log('\n✅ All technologies fixed!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
    }
}

fixTechnologies();