import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, 
    FaStar, FaImage, FaCode, FaTimes, FaEye, FaCalendarAlt,
    FaLink, FaInfoCircle, FaSearch, FaFilter, FaSpinner,
    FaCheckCircle, FaClock
} from 'react-icons/fa';
import api from '../../services/api';
import './ManageProjects.css';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        github_url: '',
        live_url: '',
        image_url: '',
        featured: false
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [searchTerm, filterFeatured, projects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get('/projects');
            if (response.data.success) {
                setProjects(response.data.data);
                setFilteredProjects(response.data.data);
            } else {
                setError('Failed to load projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data?.message || 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = () => {
        let filtered = [...projects];
        
        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filterFeatured !== 'all') {
            filtered = filtered.filter(project => 
                filterFeatured === 'featured' ? project.featured : !project.featured
            );
        }
        
        setFilteredProjects(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const projectData = {
                title: formData.title,
                description: formData.description,
                technologies: formData.technologies,
                github_url: formData.github_url,
                live_url: formData.live_url,
                image_url: formData.image_url,
                featured: formData.featured
            };
            
            let response;
            if (editingProject) {
                response = await api.put(`/projects/${editingProject.id}`, projectData);
                if (response.data.success) {
                    alert('Project updated successfully!');
                }
            } else {
                response = await api.post('/projects', projectData);
                if (response.data.success) {
                    alert('Project created successfully!');
                }
            }
            
            setShowModal(false);
            setEditingProject(null);
            resetForm();
            fetchProjects();
            
        } catch (err) {
            console.error('Error saving project:', err);
            alert(err.response?.data?.message || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            technologies: '',
            github_url: '',
            live_url: '',
            image_url: '',
            featured: false
        });
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies?.join(', ') || '',
            github_url: project.github_url || '',
            live_url: project.live_url || '',
            image_url: project.image_url || '',
            featured: project.featured || false
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setDeletingId(id);
            try {
                const response = await api.delete(`/projects/${id}`);
                if (response.data.success) {
                    alert('Project deleted successfully!');
                    fetchProjects();
                }
            } catch (err) {
                console.error('Error deleting project:', err);
                alert(err.response?.data?.message || 'Failed to delete project');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const stats = {
        total: projects.length,
        featured: projects.filter(p => p.featured).length,
        live: projects.filter(p => p.live_url).length,
        openSource: projects.filter(p => p.github_url).length
    };

    if (loading) {
        return (
            <div className="projects-loading">
                <div className="loading-spinner"></div>
                <p>Loading your projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Projects</h3>
                <p>{error}</p>
                <button onClick={fetchProjects} className="retry-btn">Try Again</button>
            </div>
        );
    }

    return (
        <div className="manage-projects">
            <div className="projects-container">
                {/* Header */}
                <div className="projects-header">
                    <div className="header-info">
                        <h1 className="projects-title">Manage Projects</h1>
                        <p className="projects-subtitle">Create, edit, and organize your portfolio projects</p>
                    </div>
                    <motion.button
                        onClick={() => {
                            setEditingProject(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="add-project-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus /> Add New Project
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <FaCode />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Projects</span>
                        </div>
                    </div>
                    <div className="stat-card featured">
                        <div className="stat-icon">
                            <FaStar />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.featured}</span>
                            <span className="stat-label">Featured</span>
                        </div>
                    </div>
                    <div className="stat-card live">
                        <div className="stat-icon">
                            <FaExternalLinkAlt />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.live}</span>
                            <span className="stat-label">Live Demos</span>
                        </div>
                    </div>
                    <div className="stat-card opensource">
                        <div className="stat-icon">
                            <FaGithub />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.openSource}</span>
                            <span className="stat-label">Open Source</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search projects by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <div className="filter-wrapper">
                        <FaFilter className="filter-icon" />
                        <select 
                            value={filterFeatured} 
                            onChange={(e) => setFilterFeatured(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Projects</option>
                            <option value="featured">Featured Only</option>
                            <option value="non-featured">Non-Featured Only</option>
                        </select>
                    </div>
                </div>

                {/* Projects Grid - FIXED 2 COLUMNS */}
                {filteredProjects.length === 0 ? (
                    <div className="empty-state">
                        <FaCode className="empty-icon" />
                        <h3>No projects found</h3>
                        <p>{searchTerm ? `No projects matching "${searchTerm}"` : 'Get started by adding your first project'}</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="clear-filters-btn">
                                Clear Search
                            </button>
                        )}
                        {!searchTerm && filterFeatured === 'all' && (
                            <button 
                                onClick={() => {
                                    setEditingProject(null);
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="empty-add-btn"
                            >
                                <FaPlus /> Add Your First Project
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="projects-grid-two-columns">
                            <AnimatePresence>
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        className="project-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="project-image">
                                            {project.image_url ? (
                                                <img src={project.image_url} alt={project.title} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <FaImage />
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                            {project.featured && (
                                                <div className="featured-badge">
                                                    <FaStar /> Featured
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="project-content">
                                            <h3 className="project-title">{project.title}</h3>
                                            <p className="project-description">
                                                {project.description.length > 120 
                                                    ? `${project.description.substring(0, 120)}...` 
                                                    : project.description}
                                            </p>
                                            
                                            <div className="project-technologies">
                                                {project.technologies?.slice(0, 4).map((tech, i) => (
                                                    <span key={i} className="tech-tag">{tech}</span>
                                                ))}
                                                {project.technologies?.length > 4 && (
                                                    <span className="tech-tag more">+{project.technologies.length - 4}</span>
                                                )}
                                            </div>
                                            
                                            <div className="project-links">
                                                {project.github_url && (
                                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                                        <FaGithub /> GitHub
                                                    </a>
                                                )}
                                                {project.live_url && (
                                                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                                        <FaExternalLinkAlt /> Live Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="project-actions">
                                            <motion.button
                                                onClick={() => handleEdit(project)}
                                                className="action-btn edit"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title="Edit Project"
                                            >
                                                <FaEdit />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(project.id)}
                                                className="action-btn delete"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title="Delete Project"
                                                disabled={deletingId === project.id}
                                            >
                                                {deletingId === project.id ? <FaSpinner className="spinning" /> : <FaTrash />}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        
                        {/* Results Counter */}
                        <div className="results-counter">
                            Showing <span className="count">{filteredProjects.length}</span> of <span className="total">{projects.length}</span> projects
                            {searchTerm && ` matching "${searchTerm}"`}
                            {filterFeatured !== 'all' && ` (${filterFeatured === 'featured' ? 'Featured Only' : 'Non-Featured Only'})`}
                        </div>
                    </>
                )}
            </div>

            {/* Modal for Add/Edit Project */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div 
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    {/* <label>Project Title *</label> */}
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter project title"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>Description</label> */}
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Describe your project..."
                                        className="form-textarea"
                                    />
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        {/* <label>Technologies</label> */}
                                        <input
                                            type="text"
                                            name="technologies"
                                            value={formData.technologies}
                                            onChange={handleInputChange}
                                            placeholder="React, Node.js, MongoDB"
                                            className="form-input"
                                        />
                                        <small>Separate technologies with commas</small>
                                    </div>
                                    
                                    <div className="form-group">
                                        {/* <label>Image URL</label> */}
                                        <input
                                            type="url"
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        {/* <label>GitHub URL</label> */}
                                        <input
                                            type="url"
                                            name="github_url"
                                            value={formData.github_url}
                                            onChange={handleInputChange}
                                            placeholder="https://github.com/username/project"
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        {/* <label>Live Demo URL</label> */}
                                        <input
                                            type="url"
                                            name="live_url"
                                            value={formData.live_url}
                                            onChange={handleInputChange}
                                            placeholder="https://project-demo.com"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                        />
                                        <span>Feature this project</span>
                                    </label>
                                </div>
                                
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <FaSpinner className="spinning" /> Saving...
                                            </>
                                        ) : (
                                            editingProject ? 'Update Project' : 'Create Project'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProjects;