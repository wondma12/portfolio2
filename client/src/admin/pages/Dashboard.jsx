import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaProjectDiagram, FaBlog, FaEnvelope, FaUsers, FaEye, 
    FaChartLine, FaComments, FaUserPlus, FaStar, FaCalendarAlt,
    FaArrowUp, FaArrowDown, FaClock, FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import StatsCard from '../../components/admin/StatsCard';
import api from '../../services/api';
import './Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        blogPosts: 0,
        messages: 0,
        users: 0,
        views: 0,
        newUsersThisMonth: 0,
        activeProjects: 0,
        unreadMessages: 0
    });
    const [recentMessages, setRecentMessages] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projects, blogPosts, messages, users] = await Promise.all([
                api.get('/projects'),
                api.get('/blog?status=all'),
                api.get('/contact'),
                api.get('/users')
            ]);
            
            const projectsData = projects.data.data;
            const blogData = blogPosts.data.data;
            const messagesData = messages.data.data;
            const usersData = users.data.data;
            
            setStats({
                projects: projectsData.length,
                blogPosts: blogData.length,
                messages: messagesData.length,
                users: usersData.length,
                views: 1247,
                newUsersThisMonth: usersData.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length,
                activeProjects: projectsData.filter(p => p.featured).length,
                unreadMessages: messagesData.filter(m => m.status === 'unread').length
            });
            
            setRecentMessages(messagesData.slice(0, 5));
            setRecentProjects(projectsData.slice(0, 4));
            setRecentBlogs(blogData.slice(0, 4));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Chart Data
    const viewsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Page Views',
                data: [120, 190, 150, 210, 240, 180, 200],
                borderColor: '#18b8c8',
                backgroundColor: 'rgba(24, 184, 200, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0fa69c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const projectsData = {
        labels: ['React', 'Node.js', 'Python', 'MongoDB', 'Other'],
        datasets: [
            {
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#18b8c8',
                    '#0fa69c',
                    '#06b6d4',
                    '#0891b2',
                    '#155e75'
                ],
                borderWidth: 0,
                hoverOffset: 10,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    usePointStyle: true,
                    boxWidth: 10,
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                borderColor: '#18b8c8',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#334155',
                },
                ticks: {
                    color: '#94a3b8',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                }
            }
        }
    };

    const statCards = [
        { title: 'Total Projects', value: stats.projects, icon: FaProjectDiagram, color: 'blue', trend: '+12%', trendUp: true },
        { title: 'Blog Posts', value: stats.blogPosts, icon: FaBlog, color: 'green', trend: '+5%', trendUp: true },
        { title: 'Messages', value: stats.messages, icon: FaEnvelope, color: 'purple', trend: '-3%', trendUp: false },
        { title: 'Users', value: stats.users, icon: FaUsers, color: 'orange', trend: '+8%', trendUp: true },
        { title: 'Total Views', value: stats.views, icon: FaEye, color: 'yellow', trend: '+15%', trendUp: true },
        { title: 'Unread Messages', value: stats.unreadMessages, icon: FaComments, color: 'red', trend: '+2%', trendUp: true }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Header */}
                <motion.div 
                    className="dashboard-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your portfolio.</p>
                    </div>
                    <div className="dashboard-date">
                        <FaCalendarAlt />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    className="stats-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {statCards.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            trend={stat.trend}
                            trendUp={stat.trendUp}
                        />
                    ))}
                </motion.div>

                {/* Charts Section */}
                <div className="charts-section">
                    <motion.div 
                        className="chart-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="chart-header">
                            <h3>Page Views Analytics</h3>
                            <div className="period-selector">
                                <button className={selectedPeriod === 'week' ? 'active' : ''} onClick={() => setSelectedPeriod('week')}>Week</button>
                                <button className={selectedPeriod === 'month' ? 'active' : ''} onClick={() => setSelectedPeriod('month')}>Month</button>
                                <button className={selectedPeriod === 'year' ? 'active' : ''} onClick={() => setSelectedPeriod('year')}>Year</button>
                            </div>
                        </div>
                        <div className="chart-container">
                            <Line data={viewsData} options={options} />
                        </div>
                    </motion.div>

                    <motion.div 
                        className="chart-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="chart-header">
                            <h3>Technologies Distribution</h3>
                        </div>
                        <div className="chart-container small">
                            <Doughnut data={projectsData} options={options} />
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity Section */}
                <div className="recent-activity">
                    {/* Recent Messages */}
                    <motion.div 
                        className="activity-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="activity-header">
                            <h3>
                                <FaComments className="header-icon" />
                                Recent Messages
                            </h3>
                            <span className="badge">{stats.unreadMessages} unread</span>
                        </div>
                        <div className="messages-list">
                            {recentMessages.map((message, index) => (
                                <motion.div 
                                    key={message.id} 
                                    className="message-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="message-avatar">
                                        <span className="avatar-initial">{message.name.charAt(0)}</span>
                                    </div>
                                    <div className="message-info">
                                        <div className="message-header">
                                            <h4>{message.name}</h4>
                                            <span className="message-date">{new Date(message.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p>{message.subject || 'No subject'}</p>
                                        <span className={`message-status status-${message.status}`}>
                                            {message.status === 'unread' ? <FaSpinner /> : message.status === 'read' ? <FaCheckCircle /> : <FaCheckCircle />}
                                            {message.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {recentMessages.length === 0 && (
                                <div className="empty-state">
                                    <p>No messages yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Projects */}
                    <motion.div 
                        className="activity-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="activity-header">
                            <h3>
                                <FaProjectDiagram className="header-icon" />
                                Recent Projects
                            </h3>
                        </div>
                        <div className="projects-list">
                            {recentProjects.map((project, index) => (
                                <motion.div 
                                    key={project.id} 
                                    className="project-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="project-icon">
                                        <FaProjectDiagram />
                                    </div>
                                    <div className="project-info">
                                        <h4>{project.title}</h4>
                                        <div className="project-tech">
                                            {project.technologies?.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="tech-badge">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {project.featured && <span className="featured-badge">Featured</span>}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Blog Posts */}
                    <motion.div 
                        className="activity-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div className="activity-header">
                            <h3>
                                <FaBlog className="header-icon" />
                                Recent Blog Posts
                            </h3>
                        </div>
                        <div className="blogs-list">
                            {recentBlogs.map((blog, index) => (
                                <motion.div 
                                    key={blog.id} 
                                    className="blog-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="blog-icon">
                                        <FaBlog />
                                    </div>
                                    <div className="blog-info">
                                        <h4>{blog.title}</h4>
                                        <div className="blog-meta">
                                            <span><FaEye /> {blog.views} views</span>
                                            <span><FaClock /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`blog-status status-${blog.status}`}>{blog.status}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;