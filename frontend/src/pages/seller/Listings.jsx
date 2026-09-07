import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice, getConditionInfo } from '../../utils/formatters';

const mockListings = [
  { id: '1', title: 'Mathematics Class 12 Part I', category: 'class-12', subject: 'Mathematics', condition: 'like-new', originalPrice: 150, sellingPrice: 120, status: 'Active', views: 45, date: 'Oct 15, 2026', image: '/book-images/class-12/04-mathematics-part-i.webp' },
  { id: '2', title: 'Physics Class 11 Part II', category: 'class-11', subject: 'Physics', condition: 'good', originalPrice: 180, sellingPrice: 140, status: 'Active', views: 32, date: 'Oct 12, 2026', image: '/book-images/class-11/06-physics-part-ii.webp' },
  { id: '3', title: 'Chemistry Class 10', category: 'class-10', subject: 'Chemistry', condition: 'fair', originalPrice: 120, sellingPrice: 60, status: 'Sold', views: 89, date: 'Sep 28, 2026', image: '/book-images/class-10/05-science.webp' },
  { id: '4', title: 'Beehive Class 9', category: 'class-9', subject: 'English', condition: 'good', originalPrice: 85, sellingPrice: 50, status: 'Inactive', views: 12, date: 'Sep 15, 2026', image: '/book-images/class-9/01-beehive.webp' },
];

const Listings = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['All', 'Active', 'Sold', 'Inactive'];

  const filteredListings = mockListings.filter(listing => {
    const matchesTab = activeTab === 'All' || listing.status === activeTab;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || listing.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">My Listings</h1>
          <p className="text-mutedText">Manage your book inventory and track performance.</p>
        </div>
        <Link to="/seller/add-book" className="btn-amber shadow-lg flex items-center gap-2">
          <Plus size={18} /> Add New Book
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-forest/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 bg-warmWhite p-1 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
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
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-forest/10 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber bg-white text-sm"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" />
            </div>
            <button
              onClick={() => toast.success(`${activeTab} listing filters opened`)}
              className="p-2 border border-forest/10 rounded-lg text-forest hover:bg-forest/5 transition-colors"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-warmWhite border-b border-forest/5 text-xs text-mutedText uppercase tracking-wider">
                <th className="p-4 pl-6 font-semibold w-2/5">Book Details</th>
                <th className="p-4 font-semibold">Pricing</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Stats</th>
                <th className="p-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => {
                    const condition = getConditionInfo(listing.condition);
                    return (
                      <motion.tr 
                        key={listing.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-forest/5 hover:bg-forest/5 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-white rounded shadow-sm border border-forest/10 overflow-hidden shrink-0 p-1">
                              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-darkText line-clamp-1">{listing.title}</h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-mutedText">
                                <span className="uppercase">{listing.subject}</span>
                                <span>•</span>
                                <span className="capitalize">{condition.label}</span>
                              </div>
                              <div className="text-xs text-mutedText mt-1">Listed: {listing.date}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-forest">{formatPrice(listing.sellingPrice)}</span>
                            <span className="text-xs text-mutedText line-through">{formatPrice(listing.originalPrice)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            listing.status === 'Active' ? 'bg-emerald/10 text-emerald' : 
                            listing.status === 'Sold' ? 'bg-amber/20 text-amber-dark' : 
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm font-medium text-darkText">
                            <Eye size={14} className="text-emerald" /> {listing.views}
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toast.success(`Editing ${listing.title}`)}
                              className="p-2 text-mutedText hover:text-amber-dark bg-white hover:bg-amber/10 border border-forest/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => toast.success(`${listing.title} moved to inactive listings`)}
                              className="p-2 text-mutedText hover:text-error bg-white hover:bg-error/10 border border-forest/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => toast.success(`${listing.views} buyer views for this listing`)}
                              className="p-2 text-mutedText hover:text-forest bg-white hover:bg-forest/10 border border-forest/10 rounded-lg transition-colors lg:hidden"
                              title="More"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-mutedText">
                      No listings found matching your criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listings;
