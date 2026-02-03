import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

interface ListItem {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  updatedAt: string;
  author: string;
}

const D31ListPagePattern: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API Call
      const response = await new Promise<ListItem[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: '1', title: 'Q1 Financial Report', status: 'active', category: 'Finance', updatedAt: '2023-10-01', author: 'Jane Doe' },
            { id: '2', title: 'Marketing Strategy 2024', status: 'pending', category: 'Marketing', updatedAt: '2023-10-05', author: 'John Smith' },
            { id: '3', title: 'Employee Handbook', status: 'active', category: 'HR', updatedAt: '2023-09-20', author: 'Sarah Wilson' },
            { id: '4', title: 'Product Roadmap', status: 'inactive', category: 'Product', updatedAt: '2023-10-12', author: 'Mike Ross' },
          ]);
        }, 800);
      });
      setData(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleAddNew = () => {
    navigate('/d31-list-page-pattern/create');
  };

  const handleView = (id: string) => {
    navigate(`/d31-list-page-pattern/view/${id}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-500">Manage and monitor your project assets and documentation.</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Resource
          </button>
        </div>

        {/* Controls Section */}
        <div className="bg-white p-4 rounded-t-xl border-x border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              Filters
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Resource Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ 
                          item.status === 'active' ? 'bg-green-100 text-green-800' : 
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.category}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.updatedAt}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.author}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleView(item.id)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No resources found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{filteredData.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D31ListPagePattern;