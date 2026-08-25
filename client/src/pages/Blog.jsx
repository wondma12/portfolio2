import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaEye, FaArrowLeft, FaSearch, FaClock } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import './Blog.css';

const Blog = () => {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        if (slug) {
            fetchPost();
        } else {
            fetchPosts();
        }
    }, [slug]);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/blog');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await api.get(`/blog/slug/${slug}`);
            setPost(response.data.data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
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
                <div className="blog-page">
                    <div className="blog-container">
                        <div className="blog-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading amazing articles...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Single blog post view
    if (slug && post) {
        return (
            <>
                <Navbar />
                <main>
                    <article className="blog-page single-post">
                        <div className="blog-container">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Link to="/blog" className="back-link">
                                    <FaArrowLeft /> Back to all posts
                                </Link>
                                
                                {post.cover_image && (
                                    <motion.div 
                                        className="post-cover"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <img src={post.cover_image} alt={post.title} />
                                    </motion.div>
                                )}
                                
                                <motion.div 
                                    className="post-header"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <h1 className="post-title">{post.title}</h1>
                                    <div className="post-meta">
                                        <span className="post-date">
                                            <FaCalendar /> {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className="post-views">
                                            <FaEye /> {post.views} views
                                        </span>
                                        <span className="post-read-time">
                                            <FaClock /> {Math.ceil(post.content.split(' ').length / 200)} min read
                                        </span>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className="post-content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {post.content.split('\n').map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </article>
                </main>
                <Footer />
            </>
        );
    }

    // Blog listing view
    return (
        <>
            <Navbar />
            <section className="blog-page">
                <div className="blog-container">
                    {/* Header Section */}
                    <motion.div 
                        className="blog-header"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="section-title">Blog</h1>
                        <p className="section-subtitle">
                            Thoughts, tutorials, and insights about web development
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div 
                        className="blog-search"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </motion.div>

                    {/* Blog Grid */}
                    <AnimatePresence>
                        {filteredPosts.length === 0 ? (
                            <motion.div 
                                className="blog-empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h3>No articles found</h3>
                                <p>Try adjusting your search or check back later for new content.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="blog-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        variants={itemVariants}
                                        className="blog-card"
                                        whileHover={{ y: -8 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {post.cover_image && (
                                            <div className="blog-image">
                                                <img src={post.cover_image} alt={post.title} />
                                                <div className="blog-overlay">
                                                    <Link to={`/blog/${post.slug}`} className="read-more-link">
                                                        Read Article →
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        <div className="blog-content">
                                            <h2>
                                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="blog-excerpt">
                                                {post.excerpt || post.content.substring(0, 120)}...
                                            </p>
                                            <div className="blog-meta">
                                                <span className="blog-date">
                                                    <FaCalendar /> {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="blog-views">
                                                    <FaEye /> {post.views} views
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Blog;