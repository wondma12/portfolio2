import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import './Projects.css';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique categories/technologies for filter
  const getAllCategories = () => {
    const categories = new Set();
    projects.forEach(project => {
      project.technologies?.forEach(tech => {
        // Categorize technologies into broader categories
        if (tech === 'React' || tech === 'Vue.js' || tech === 'Angular') categories.add('frontend');
        if (tech === 'Node.js' || tech === 'Python' || tech === 'Django') categories.add('backend');
        if (tech === 'MongoDB' || tech === 'PostgreSQL' || tech === 'MySQL') categories.add('database');
        if (tech === 'React Native' || tech === 'Flutter') categories.add('mobile');
      });
    });
    return Array.from(categories);
  };

  const categories = getAllCategories();

  // Filter projects based on selected category
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => {
        if (activeFilter === 'frontend') {
          return project.technologies?.some(tech => ['React', 'Vue.js', 'Angular'].includes(tech));
        }
        if (activeFilter === 'backend') {
          return project.technologies?.some(tech => ['Node.js', 'Python', 'Django', 'Express'].includes(tech));
        }
        if (activeFilter === 'database') {
          return project.technologies?.some(tech => ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'].includes(tech));
        }
        if (activeFilter === 'mobile') {
          return project.technologies?.some(tech => ['React Native', 'Flutter', 'Expo'].includes(tech));
        }
        return true;
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section id="projects" className="projects">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">My Projects</h2>
            <p className="section-subtitle">Here are some of my recent works that showcase my skills and experience</p>
          </motion.div>
          
          <div className="projects-loading">
            {[1, 2, 3].map((item) => (
              <div key={item} className="project-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-tags">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section id="projects" className="projects">
          <div className="projects-error">
            <h3>Error Loading Projects</h3>
            <p>{error}</p>
            <button onClick={fetchProjects} className="retry-btn">Try Again</button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section id="projects" className="projects-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">My Projects</h2>
          <p className="section-subtitle">
            Here are some of my recent works that showcase my skills and experience
          </p>
        </motion.div>
        
        <div className="filter-buttons">
          <motion.button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ALL PROJECTS
          </motion.button>
          {categories.map(category => (
            <motion.button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <div className="project-counter">
          Showing <span>{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="projects-grid"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="project-card"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {project.featured && (
                    <div className="featured-badge">Featured</div>
                  )}
                  <div className="project-image">
                    <img 
                      src={project.image_url || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'} 
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';
                      }}
                    />
                    <div className="project-overlay">
                      <div className="project-links">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <span>🌐</span> Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <span>💻</span> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-tags">
                      {project.technologies?.map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="projects-empty">
                <h3>No projects found</h3>
                <p>No projects match the selected filter. Try a different category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
      <Footer />
    </>
  );
};

export default Projects;