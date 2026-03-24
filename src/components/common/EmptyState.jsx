import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';

const EmptyState = ({ title, message, action }) => {
    return (
        <div className="text-center py-12">
            <FaFolderOpen className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
                {message}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;