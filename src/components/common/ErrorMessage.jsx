import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-400 mb-3">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;