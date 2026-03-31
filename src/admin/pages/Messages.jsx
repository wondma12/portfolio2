import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEnvelope, FaCheck, FaTrash, FaReply, FaEye, 
    FaUser, FaCalendarAlt, FaMailBulk, FaInbox,
    FaSpinner, FaCheckCircle, FaReplyAll, FaSearch,
    FaFilter, FaTimes, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Messages.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        filterMessages();
    }, [searchTerm, statusFilter, messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/contact');
            setMessages(response.data.data);
            setFilteredMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const filterMessages = () => {
        let filtered = [...messages];
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(msg => 
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (msg.subject && msg.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                msg.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(msg => msg.status === statusFilter);
        }
        
        setFilteredMessages(filtered);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/contact/${id}/read`);
            toast.success('Message marked as read');
            fetchMessages();
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, status: 'read' });
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
            toast.error('Failed to update message');
        }
    };

    const handleMarkAsReplied = async (id) => {
        try {
            await api.put(`/contact/${id}/reply`);
            toast.success('Message marked as replied');
            fetchMessages();
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, status: 'replied' });
            }
        } catch (error) {
            console.error('Error marking message as replied:', error);
            toast.error('Failed to update message');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            try {
                await api.delete(`/contact/${id}`);
                toast.success('Message deleted successfully');
                fetchMessages();
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                toast.error('Failed to delete message');
            }
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            toast.error('Please enter a reply message');
            return;
        }
        
        setSendingReply(true);
        try {
            // Here you would integrate with your email service
            // await api.post(`/contact/${selectedMessage.id}/reply`, { message: replyText });
            toast.success(`Reply sent to ${selectedMessage.name}`);
            setReplyText('');
            await handleMarkAsReplied(selectedMessage.id);
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'read': return <FaCheckCircle className="status-icon read" />;
            case 'replied': return <FaReplyAll className="status-icon replied" />;
            default: return <FaSpinner className="status-icon unread" />;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'read': return '#10b981';
            case 'replied': return '#3b82f6';
            default: return '#f59e0b';
        }
    };

    const stats = {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length
    };

    if (loading) {
        return (
            <div className="messages-loading">
                <div className="loading-spinner"></div>
                <p>Loading your messages...</p>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <div className="messages-container">
                {/* Header */}
                <div className="messages-header">
                    <div className="header-info">
                        <h1 className="messages-title">Messages</h1>
                        <p className="messages-subtitle">Manage and respond to your contact inquiries</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <FaMailBulk />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Messages</span>
                        </div>
                    </div>
                    <div className="stat-card unread">
                        <div className="stat-icon">
                            <FaEnvelope />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.unread}</span>
                            <span className="stat-label">Unread</span>
                        </div>
                    </div>
                    <div className="stat-card read">
                        <div className="stat-icon">
                            <FaCheckCircle />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.read}</span>
                            <span className="stat-label">Read</span>
                        </div>
                    </div>
                    <div className="stat-card replied">
                        <div className="stat-icon">
                            <FaReplyAll />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.replied}</span>
                            <span className="stat-label">Replied</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, subject, or message..."
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
                            <option value="all">All Messages</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                    </div>
                </div>

                {/* Messages Grid */}
                <div className="messages-grid">
                    {/* Messages List */}
                    <div className="messages-list-panel">
                        <div className="messages-list-header">
                            <h3>
                                <FaInbox /> Inbox
                            </h3>
                            <span className="message-count">{filteredMessages.length} messages</span>
                        </div>
                        
                        <div className="messages-list">
                            <AnimatePresence>
                                {filteredMessages.length === 0 ? (
                                    <div className="empty-messages">
                                        <FaEnvelope className="empty-icon" />
                                        <p>No messages found</p>
                                        {searchTerm && (
                                            <button onClick={() => setSearchTerm('')} className="clear-filters-btn">
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredMessages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            className={`message-item ${selectedMessage?.id === message.id ? 'active' : ''}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedMessage(message)}
                                        >
                                            <div className="message-avatar">
                                                <span className="avatar-initial">{message.name.charAt(0)}</span>
                                                {getStatusIcon(message.status)}
                                            </div>
                                            <div className="message-preview">
                                                <div className="message-header">
                                                    <h4>{message.name}</h4>
                                                    <span className="message-date">
                                                        <FaCalendarAlt />
                                                        {new Date(message.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="message-subject">
                                                    {message.subject || 'No subject'}
                                                </p>
                                                <p className="message-excerpt">
                                                    {message.message.substring(0, 60)}...
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    {/* Message Detail */}
                    <div className="message-detail-panel">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="message-detail"
                                >
                                    <div className="detail-header">
                                        <div className="detail-title">
                                            <h2>{selectedMessage.subject || 'No Subject'}</h2>
                                            <div className={`status-badge ${selectedMessage.status}`}>
                                                {getStatusIcon(selectedMessage.status)}
                                                {selectedMessage.status}
                                            </div>
                                        </div>
                                        <div className="detail-actions">
                                            {selectedMessage.status === 'unread' && (
                                                <motion.button
                                                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                                                    className="action-btn read-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    title="Mark as read"
                                                >
                                                    <FaCheck /> Mark as Read
                                                </motion.button>
                                            )}
                                            {selectedMessage.status !== 'replied' && (
                                                <motion.button
                                                    onClick={() => handleMarkAsReplied(selectedMessage.id)}
                                                    className="action-btn reply-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    title="Mark as replied"
                                                >
                                                    <FaReply /> Mark as Replied
                                                </motion.button>
                                            )}
                                            <motion.button
                                                onClick={() => handleDelete(selectedMessage.id)}
                                                className="action-btn delete-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                title="Delete"
                                            >
                                                <FaTrash /> Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-info">
                                        <div className="info-row">
                                            <FaUser className="info-icon" />
                                            <div>
                                                <strong>From:</strong> {selectedMessage.name}
                                                <span className="email">({selectedMessage.email})</span>
                                            </div>
                                        </div>
                                        <div className="info-row">
                                            <FaCalendarAlt className="info-icon" />
                                            <div>
                                                <strong>Sent:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-message">
                                        <h3>Message</h3>
                                        <div className="message-content">
                                            {selectedMessage.message.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-reply">
                                        <h3>Quick Reply</h3>
                                        <textarea
                                            rows="4"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`Type your reply to ${selectedMessage.name}...`}
                                            className="reply-textarea"
                                        />
                                        <motion.button
                                            onClick={handleSendReply}
                                            disabled={sendingReply}
                                            className="send-reply-btn"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {sendingReply ? (
                                                <>
                                                    <FaSpinner className="spinning" /> Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <FaReply /> Send Reply
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="no-message-selected"
                                >
                                    <FaEnvelope className="no-message-icon" />
                                    <h3>No message selected</h3>
                                    <p>Select a message from the list to view its contents</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;