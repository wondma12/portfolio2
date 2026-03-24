import { Link, useLocation } from 'react-router-dom';
import { 
    FaDashboard, 
    FaProjectDiagram, 
    FaBlog, 
    FaEnvelope, 
    FaUsers, 
    FaUserEdit,
    FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    
    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: FaDashboard },
        { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
        { path: '/admin/blog', label: 'Blog Posts', icon: FaBlog },
        { path: '/admin/messages', label: 'Messages', icon: FaEnvelope },
        { path: '/admin/users', label: 'Users', icon: FaUsers },
        { path: '/admin/profile', label: 'Edit Profile', icon: FaUserEdit }
    ];
    
    const isActive = (path) => {
        return location.pathname === path;
    };
    
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen">
            <div className="p-4 border-b dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                        isActive(item.path)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <IconComponent className="mr-3" size={18} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <FaSignOutAlt className="mr-3" size={18} />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;