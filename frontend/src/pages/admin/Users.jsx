import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, User, Edit, Trash2, Ban } from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockUsers = [
  { id: 'USR-001', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Buyer', status: 'Active', joined: 'Oct 10, 2026' },
  { id: 'USR-002', name: 'BookWorm Store', email: 'store@bookworm.com', role: 'Seller', status: 'Active', joined: 'Sep 15, 2026' },
  { id: 'USR-003', name: 'Amit Kumar', email: 'amit@example.com', role: 'Admin', status: 'Active', joined: 'Jan 01, 2026' },
  { id: 'USR-004', name: 'Priya Patel', email: 'priya@example.com', role: 'Buyer', status: 'Suspended', joined: 'Aug 20, 2026' },
  { id: 'USR-005', name: 'Knowledge Hub', email: 'contact@khub.in', role: 'Seller', status: 'Pending', joined: 'Oct 14, 2026' },
];

const UsersManagement = ({ initialRole = 'All' }) => {
  const [activeTab, setActiveTab] = useState(initialRole);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['All', 'Buyers', 'Sellers', 'Admins'];

  useEffect(() => {
    setActiveTab(initialRole);
  }, [initialRole]);

  const filteredUsers = mockUsers.filter(user => {
    const matchesTab = activeTab === 'All' || user.role + 's' === activeTab || user.role === activeTab.slice(0,-1); // Simple plural matching
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">
            {activeTab === 'All' ? 'User Management' : `${activeTab} Management`}
          </h1>
          <p className="text-mutedText">
            {activeTab === 'All'
              ? 'Manage buyers, sellers, and system administrators.'
              : `Review, search, export, and moderate ${activeTab.toLowerCase()} accounts.`}
          </p>
        </div>
        <button onClick={() => toast.success('User export prepared')} className="btn-primary shadow-lg">
          Export Users
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-forest/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 bg-warmWhite p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab ? 'bg-white text-forest shadow-sm' : 'text-mutedText hover:text-darkText'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest/10 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald bg-white text-sm"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" />
            </div>
            <button
              onClick={() => toast.success(`${activeTab} filter controls opened`)}
              className="p-2 border border-forest/10 rounded-lg text-forest hover:bg-forest/5 transition-colors shrink-0"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-warmWhite border-b border-forest/5 text-xs text-mutedText uppercase tracking-wider">
                <th className="p-4 pl-6 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-forest/5 hover:bg-forest/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-darkText text-sm">{user.name}</h4>
                          <div className="text-xs text-mutedText">{user.email}</div>
                          <div className="text-[10px] text-mutedText mt-0.5 font-mono">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-darkText">
                        {user.role === 'Admin' ? <Shield size={14} className="text-error" /> : <User size={14} className="text-emerald" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        user.status === 'Active' ? 'bg-emerald/10 text-emerald' : 
                        user.status === 'Suspended' ? 'bg-error/10 text-error' : 
                        'bg-amber/20 text-amber-dark'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-mutedText">
                      {user.joined}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toast.success(`Editing ${user.name}`)}
                          className="p-2 text-mutedText hover:text-emerald bg-white hover:bg-emerald/10 border border-forest/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {user.status === 'Suspended' ? (
                          <button
                            onClick={() => toast.success(`${user.name} marked for unsuspension`)}
                            className="p-2 text-mutedText hover:text-emerald bg-white hover:bg-emerald/10 border border-forest/10 rounded-lg transition-colors"
                            title="Unsuspend"
                          >
                            <Shield size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => toast.success(`${user.name} marked for suspension review`)}
                            className="p-2 text-mutedText hover:text-amber-dark bg-white hover:bg-amber/10 border border-forest/10 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`${user.name} delete request queued`)}
                          className="p-2 text-mutedText hover:text-error bg-white hover:bg-error/10 border border-forest/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-mutedText">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-forest/5 flex items-center justify-between text-sm text-mutedText">
          <span>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-forest/10 rounded-md disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-forest text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-forest/10 rounded-md disabled:opacity-50" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UsersManagement;
