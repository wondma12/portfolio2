import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUsers, FaUser, FaUserPlus, FaEdit, FaTrash, FaSearch, 
    FaFilter, FaTimes, FaCalendarAlt, FaEnvelope, FaShieldAlt,
    FaUserCheck, FaUserClock, FaSpinner, FaEye, FaCrown
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [updatingRole, setUpdatingRole] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, roleFilter, users]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];
        
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        
        setFilteredUsers(filtered);
    };

    const handleRoleChange = async (userId, role) => {
        setUpdatingRole(userId);
        try {
            await api.put(`/users/${userId}/role`, { role });
            toast.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setDeletingId(userId);
            try {
                await api.delete(`/users/${userId}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length,
        newThisMonth: users.filter(u => {
            const createdDate = new Date(u.created_at);
            const now = new Date();
            return createdDate.getMonth() === now.getMonth() && 
                   createdDate.getFullYear() === now.getFullYear();
        }).length
    };

    if (loading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="manage-users">
            <div className="users-container">
                {/* Header */}
                <div className="users-header">
                    <div className="header-info">
                        <h1 className="users-title">Manage Users</h1>
                        <p className="users-subtitle">Manage user accounts, roles, and permissions</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <FaUsers />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                    </div>
                    <div className="stat-card admins">
                        <div className="stat-icon">
                            <FaCrown />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.admins}</span>
                            <span className="stat-label">Administrators</span>
                        </div>
                    </div>
                    <div className="stat-card users">
                        <div className="stat-icon">
                            <FaUser />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.users}</span>
                            <span className="stat-label">Regular Users</span>
                        </div>
                    </div>
                    <div className="stat-card new">
                        <div className="stat-icon">
                            <FaUserPlus />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.newThisMonth}</span>
                            <span className="stat-label">New This Month</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search users by username or email..."
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
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Administrators</option>
                            <option value="user">Regular Users</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <FaUsers className="empty-icon" />
                        <h3>No users found</h3>
                        <p>{searchTerm ? `No users matching "${searchTerm}"` : 'No users available'}</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="clear-filters-btn">
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredUsers.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="user-row"
                                            >
                                                <td className="user-cell">
                                                    <div className="user-info">
                                                        <div className="user-avatar">
                                                            <span className="avatar-initial">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="user-details">
                                                            <span className="user-name">{user.username}</span>
                                                            <span className="user-id">ID: {user.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="email-cell">
                                                    <div className="email-wrapper">
                                                        <FaEnvelope className="email-icon" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="role-cell">
                                                    <div className="role-select-wrapper">
                                                        <FaShieldAlt className="role-icon" />
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            className={`role-select ${user.role === 'admin' ? 'admin' : 'user'}`}
                                                            disabled={updatingRole === user.id}
                                                        >
                                                            <option value="user">👤 User</option>
                                                            <option value="admin">👑 Admin</option>
                                                        </select>
                                                        {updatingRole === user.id && (
                                                            <FaSpinner className="spinning role-spinner" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="date-cell">
                                                    <div className="date-wrapper">
                                                        <FaCalendarAlt className="date-icon" />
                                                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="actions-cell">
                                                    <motion.button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="delete-btn"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        disabled={deletingId === user.id}
                                                        title="Delete User"
                                                    >
                                                        {deletingId === user.id ? (
                                                            <FaSpinner className="spinning" />
                                                        ) : (
                                                            <FaTrash />
                                                        )}
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Results Counter */}
                        <div className="results-counter">
                            Showing <span className="count">{filteredUsers.length}</span> of <span className="total">{users.length}</span> users
                            {searchTerm && ` matching "${searchTerm}"`}
                            {roleFilter !== 'all' && ` (${roleFilter === 'admin' ? 'Administrators' : 'Regular Users'})`}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;