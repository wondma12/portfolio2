import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };
    
    const loader = (
        <div className={`inline-block animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}></div>
    );
    
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
                {loader}
            </div>
        );
    }
    
    return loader;
};

export default Loader;