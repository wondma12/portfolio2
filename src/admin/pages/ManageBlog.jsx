import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, 
    FaTag, FaImage, FaTimes, FaSearch, FaFilter,
    FaCheckCircle, FaClock, FaSpinner, FaArrowRight,
    FaSave, FaTimesCircle
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import './ManageBlog.css';

const ManageBlog = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [searchTerm, statusFilter, posts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/blog?status=all');
            setPosts(response.data.data);
            setFilteredPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch blog posts');
        } finally {
            setLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = [...posts];
        
        if (searchTerm) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(post => post.status === statusFilter);
        }
        
        setFilteredPosts(filtered);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            if (editingPost) {
                // Update existing post
                const response = await api.put(`/blog/${editingPost.id}`, data);
                if (response.data.success) {
                    toast.success('Blog post updated successfully!');
                    fetchPosts();
                    closeModal();
                }
            } else {
                // Create new post
                const response = await api.post('/blog', data);
                if (response.data.success) {
                    toast.success('Blog post created successfully!');
                    fetchPosts();
                    closeModal();
                }
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error(error.response?.data?.message || 'Failed to save blog post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setValue('title', post.title);
        setValue('content', post.content);
        setValue('excerpt', post.excerpt || '');
        setValue('cover_image', post.cover_image || '');
        setValue('status', post.status);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            setDeletingId(id);
            try {
                const response = await api.delete(`/blog/${id}`);
                if (response.data.success) {
                    toast.success('Blog post deleted successfully!');
                    fetchPosts();
                    // If the deleted post was selected, clear it
                    if (editingPost?.id === id) {
                        setEditingPost(null);
                    }
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error(error.response?.data?.message || 'Failed to delete blog post');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const openModal = () => {
        setEditingPost(null);
        reset({
            title: '',
            content: '',
            excerpt: '',
            cover_image: '',
            status: 'draft'
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        reset();
    };

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
    };

    if (loading) {
        return (
            <div className="blog-loading">
                <div className="loading-spinner"></div>
                <p>Loading your blog posts...</p>
            </div>
        );
    }

    return (
        <div className="manage-blog">
            <div className="blog-container">
                {/* Header */}
                <div className="blog-header">
                    <div className="header-info">
                        <h1 className="blog-title">Manage Blog Posts</h1>
                        <p className="blog-subtitle">Create, edit, and organize your blog content</p>
                    </div>
                    <motion.button
                        onClick={openModal}
                        className="create-post-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus /> Create New Post
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <FaTag />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Posts</span>
                        </div>
                    </div>
                    <div className="stat-card published">
                        <div className="stat-icon">
                            <FaCheckCircle />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.published}</span>
                            <span className="stat-label">Published</span>
                        </div>
                    </div>
                    <div className="stat-card draft">
                        <div className="stat-icon">
                            <FaClock />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.draft}</span>
                            <span className="stat-label">Draft</span>
                        </div>
                    </div>
                    <div className="stat-card views">
                        <div className="stat-icon">
                            <FaEye />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.totalViews}</span>
                            <span className="stat-label">Total Views</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search posts by title, content, or excerpt..."
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
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Posts</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="empty-state">
                        <FaTag className="empty-icon" />
                        <h3>No blog posts found</h3>
                        <p>{searchTerm ? `No posts matching "${searchTerm}"` : 'Get started by creating your first blog post'}</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="clear-filters-btn">
                                Clear Search
                            </button>
                        )}
                        {!searchTerm && statusFilter === 'all' && (
                            <button onClick={openModal} className="empty-add-btn">
                                <FaPlus /> Create Your First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="blog-posts-grid">
                            <AnimatePresence>
                                {filteredPosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        className="blog-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="blog-card-image">
                                            {post.cover_image ? (
                                                <img src={post.cover_image} alt={post.title} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <FaImage />
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                            <div className={`status-badge ${post.status}`}>
                                                {post.status === 'published' ? <FaCheckCircle /> : <FaClock />}
                                                {post.status}
                                            </div>
                                        </div>
                                        
                                        <div className="blog-card-content">
                                            <h3 className="blog-card-title">{post.title}</h3>
                                            <p className="blog-card-excerpt">
                                                {post.excerpt || post.content?.substring(0, 120) || 'No preview available'}...
                                            </p>
                                            
                                            <div className="blog-card-meta">
                                                <span className="meta-item">
                                                    <FaCalendarAlt />
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="meta-item">
                                                    <FaEye />
                                                    {post.views || 0} views
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="blog-card-actions">
                                            <motion.button
                                                onClick={() => handleEdit(post)}
                                                className="action-btn edit"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title="Edit Post"
                                            >
                                                <FaEdit />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(post.id)}
                                                className="action-btn delete"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title="Delete Post"
                                                disabled={deletingId === post.id}
                                            >
                                                {deletingId === post.id ? <FaSpinner className="spinning" /> : <FaTrash />}
                                            </motion.button>
                                            {post.status === 'published' && (
                                                <a 
                                                    href={`/blog/${post.slug}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="action-btn view"
                                                    title="View Post"
                                                >
                                                    <FaEye />
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        
                        {/* Results Counter */}
                        <div className="results-counter">
                            Showing <span className="count">{filteredPosts.length}</span> of <span className="total">{posts.length}</span> posts
                            {searchTerm && ` matching "${searchTerm}"`}
                            {statusFilter !== 'all' && ` (${statusFilter})`}
                        </div>
                    </>
                )}
            </div>

            {/* Modal for Create/Edit Post */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPost ? 'Edit Blog Post' : 'Create New Blog Post'} size="lg">
                <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                    <div className="form-group">
                        {/* <label>Post Title *</label> */}
                        <input
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Enter your post title"
                            className={`form-input ${errors.title ? 'error' : ''}`}
                        />
                        {errors.title && <span className="error-message">{errors.title.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        {/* <label>Excerpt / Summary</label> */}
                        <textarea
                            {...register('excerpt')}
                            rows="2"
                            placeholder="Brief summary of your post..."
                            className="form-textarea"
                        />
                        <small>A short description that appears in blog listings</small>
                    </div>
                    
                    <div className="form-group">
                        {/* <label>Cover Image URL</label> */}
                        <input
                            {...register('cover_image')}
                            placeholder="https://example.com/cover-image.jpg"
                            className="form-input"
                        />
                        <small>Image will be displayed at the top of your post</small>
                    </div>
                    
                    <div className="form-group">
                        {/* <label>Post Content *</label> */}
                        <textarea
                            {...register('content', { required: 'Content is required' })}
                            rows="12"
                            placeholder="Write your blog post content here... Use markdown or plain text"
                            className={`form-textarea content-editor ${errors.content ? 'error' : ''}`}
                        />
                        {errors.content && <span className="error-message">{errors.content.message}</span>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            {/* <label>Status</label> */}
                            <select
                                {...register('status')}
                                className="form-select"
                            >
                                <option value="draft">📝 Draft - Save as draft</option>
                                <option value="published">🚀 Published - Visible to public</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" onClick={closeModal} className="btn-cancel">
                            <FaTimesCircle /> Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <FaSpinner className="spinning" /> Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave /> {editingPost ? 'Update Post' : 'Create Post'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageBlog;