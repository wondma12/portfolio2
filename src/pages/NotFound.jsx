import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaHome />
                        <span>Back to Home</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;