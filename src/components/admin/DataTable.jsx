import { useState } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const DataTable = ({ 
    columns, 
    data, 
    onEdit, 
    onDelete, 
    onView,
    actions = true 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Filter data
    const filteredData = data.filter(item => {
        return columns.some(column => {
            const value = item[column.key];
            if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
    });
    
    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    return (
        <div>
            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                                    >
                                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {onView && (
                                            <button
                                                onClick={() => onView(item)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <FaEye />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;