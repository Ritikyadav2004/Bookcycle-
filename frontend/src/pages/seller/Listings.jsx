import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Trash2, Eye, AlertCircle, CheckCircle, Clock, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice, getConditionInfo } from '../../utils/formatters';
import sellerService from '../../services/sellerService';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Pending', 'Live', 'Rejected'];

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getBooks();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load listings:', err);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await sellerService.deleteListing(bookId);
      toast.success(`Listing "${title}" deleted`);
      setListings(prev => prev.filter(b => (b._id || b.id) !== bookId));
    } catch (err) {
      toast.error(err?.message || 'Failed to delete listing');
    }
  };

  const handleResubmit = async (bookId, title) => {
    try {
      await sellerService.resubmitListing(bookId);
      toast.success(`Listing "${title}" resubmitted for Admin review!`);
      fetchListings();
    } catch (err) {
      toast.error(err?.message || 'Failed to resubmit listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    const status = listing.approvalStatus || 'pending';
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Pending' && status === 'pending') ||
      (activeTab === 'Live' && status === 'approved') ||
      (activeTab === 'Rejected' && status === 'rejected');

    const query = searchQuery.toLowerCase();
    const title = (listing.title || '').toLowerCase();
    const author = (listing.author || '').toLowerCase();
    const genre = (listing.genre || '').toLowerCase();

    const matchesSearch = title.includes(query) || author.includes(query) || genre.includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">My Listings</h1>
          <p className="text-mutedText">Manage your book inventory, track real-time admin approvals, and view buyer demand.</p>
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
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-mutedText">
              <Loader2 size={36} className="animate-spin text-emerald mb-3" />
              <p>Loading your book listings from database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-warmWhite border-b border-forest/5 text-xs text-mutedText uppercase tracking-wider">
                  <th className="p-4 pl-6 font-semibold w-2/5">Book Details</th>
                  <th className="p-4 font-semibold">Pricing</th>
                  <th className="p-4 font-semibold">Approval Status</th>
                  <th className="p-4 font-semibold">Stats</th>
                  <th className="p-4 font-semibold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => {
                      const id = listing._id || listing.id;
                      const condition = getConditionInfo(listing.condition || 'Good');
                      const status = listing.approvalStatus || 'pending';
                      const image = (listing.images && listing.images[0]) || listing.image || '/book-images/class-12/04-mathematics-part-i.webp';

                      return (
                        <motion.tr
                          key={id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-forest/5 hover:bg-forest/5 transition-colors group"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-white rounded shadow-sm border border-forest/10 overflow-hidden shrink-0 p-1">
                                <img src={image} alt={listing.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-darkText line-clamp-1">{listing.title}</h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-mutedText">
                                  <span>{listing.author}</span>
                                  <span>•</span>
                                  <span className="capitalize">{condition.label}</span>
                                </div>
                                <div className="text-xs text-mutedText mt-1">
                                  Qty: <span className="font-semibold text-darkText">{listing.quantity}</span> in stock
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-forest">{formatPrice(listing.sellingPrice)}</span>
                              {listing.originalPrice > listing.sellingPrice && (
                                <span className="text-xs text-mutedText line-through">{formatPrice(listing.originalPrice)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald/10 text-emerald">
                                <CheckCircle size={13} /> Live in Market
                              </span>
                            )}
                            {status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-amber/20 text-amber-dark">
                                <Clock size={13} /> Pending Review
                              </span>
                            )}
                            {status === 'rejected' && (
                              <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-error/10 text-error">
                                  <AlertCircle size={13} /> Rejected
                                </span>
                                {listing.rejectionReason && (
                                  <p className="text-xs text-error mt-1 max-w-xs line-clamp-2">
                                    Reason: {listing.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm font-medium text-darkText">
                              <Eye size={14} className="text-emerald" /> {listing.views || 0}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex justify-end gap-2">
                              {status === 'approved' && (
                                <Link
                                  to={`/book/${id}`}
                                  className="p-2 text-mutedText hover:text-emerald bg-white hover:bg-emerald/10 border border-forest/10 rounded-lg transition-colors"
                                  title="View in Marketplace"
                                >
                                  <Eye size={16} />
                                </Link>
                              )}
                              {status === 'rejected' && (
                                <button
                                  onClick={() => handleResubmit(id, listing.title)}
                                  className="p-2 text-amber-dark hover:text-white bg-amber/10 hover:bg-amber-dark border border-amber/20 rounded-lg transition-colors"
                                  title="Resubmit for Review"
                                >
                                  <RotateCcw size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(id, listing.title)}
                                className="p-2 text-mutedText hover:text-error bg-white hover:bg-error/10 border border-forest/10 rounded-lg transition-colors"
                                title="Delete Listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-mutedText">
                        No book listings found in this category.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
