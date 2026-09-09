import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Eye, Filter, Search, ShieldAlert, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice, getConditionInfo } from '../../utils/formatters';
import adminService from '../../services/adminService';

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending Review');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admin listings:', err);
      toast.error('Failed to load listings from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleApprove = async (bookId, title) => {
    try {
      setActionLoading(bookId);
      await adminService.reviewListing(bookId, 'approved');
      toast.success(`"${title}" has been Approved and is now Live!`);
      setListings(prev =>
        prev.map(book =>
          (book._id || book.id) === bookId
            ? { ...book, approvalStatus: 'approved' }
            : book
        )
      );
    } catch (err) {
      toast.error(err?.message || 'Failed to approve listing');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookId, title) => {
    const reason = window.prompt(`Enter reason for rejecting "${title}":`, 'Image quality or details need revision');
    if (!reason) return;

    try {
      setActionLoading(bookId);
      await adminService.reviewListing(bookId, 'rejected', reason);
      toast.success(`"${title}" was Rejected`);
      setListings(prev =>
        prev.map(book =>
          (book._id || book.id) === bookId
            ? { ...book, approvalStatus: 'rejected', rejectionReason: reason }
            : book
        )
      );
    } catch (err) {
      toast.error(err?.message || 'Failed to reject listing');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = ['Pending Review', 'Live', 'Rejected', 'All'];

  const filteredListings = listings.filter((book) => {
    const status = book.approvalStatus || 'pending';
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Pending Review' && status === 'pending') ||
      (activeTab === 'Live' && status === 'approved') ||
      (activeTab === 'Rejected' && status === 'rejected');

    const query = searchQuery.toLowerCase();
    const title = (book.title || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const seller = (book.seller?.name || book.seller?.shopName || '').toLowerCase();

    return matchesTab && (title.includes(query) || author.includes(query) || seller.includes(query));
  });

  const pendingCount = listings.filter(b => (b.approvalStatus || 'pending') === 'pending').length;
  const liveCount = listings.filter(b => b.approvalStatus === 'approved').length;
  const rejectedCount = listings.filter(b => b.approvalStatus === 'rejected').length;
  const totalValue = listings.reduce((sum, b) => sum + (b.sellingPrice || 0), 0);

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">Book Moderation Panel</h1>
          <p className="text-mutedText">Review pending seller uploads, approve live listings, and manage catalog quality.</p>
        </div>
        <button onClick={fetchListings} className="btn-secondary flex items-center gap-2 shadow-sm">
          <RotateCcw size={16} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          ['Pending Review', pendingCount, 'bg-amber/10 text-amber-dark'],
          ['Live in Market', liveCount, 'bg-emerald/10 text-emerald'],
          ['Rejected', rejectedCount, 'bg-error/10 text-error'],
          ['Catalog Total Value', formatPrice(totalValue), 'bg-forest/10 text-forest'],
        ].map(([label, value, tone], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-3xl border border-forest/5 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-mutedText">{label}</p>
            <p className={`mt-2 text-2xl font-serif font-bold ${tone.split(' ')[1]}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-forest/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-forest/5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-warmWhite p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab ? 'bg-white text-forest shadow-sm' : 'text-mutedText hover:text-darkText'
                }`}
              >
                {tab} {tab === 'Pending Review' && pendingCount > 0 && `(${pendingCount})`}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, author, seller..."
                className="w-full rounded-lg border border-forest/10 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-emerald"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-mutedText">
              <Loader2 size={36} className="animate-spin text-emerald mb-3" />
              <p>Fetching listings from MongoDB Atlas...</p>
            </div>
          ) : (
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-warmWhite text-xs uppercase tracking-wider text-mutedText">
                <tr>
                  <th className="p-4 pl-6">Book Details</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4 pr-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((book) => {
                  const id = book._id || book.id;
                  const condition = getConditionInfo(book.condition || 'Good');
                  const status = book.approvalStatus || 'pending';
                  const image = (book.images && book.images[0]) || book.image || '/book-images/class-12/04-mathematics-part-i.webp';
                  const isLoading = actionLoading === id;

                  return (
                    <tr key={id} className="border-b border-forest/5 transition-colors hover:bg-forest/5">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={image}
                            alt={book.title}
                            className="h-16 w-12 rounded-lg border border-forest/10 object-cover shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-darkText block">{book.title}</span>
                            <p className="mt-0.5 text-xs text-mutedText">
                              by {book.author} • {condition.label} • Qty: {book.quantity}
                            </p>
                            {book.description && (
                              <p className="text-xs text-mutedText/80 line-clamp-1 mt-1 max-w-md">
                                {book.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-darkText">
                        <span className="font-medium">{book.seller?.shopName || book.seller?.name || 'Verified Seller'}</span>
                        <span className="block text-xs text-mutedText">{book.sellerLocation || 'Delhi, India'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-forest">{formatPrice(book.sellingPrice)}</span>
                        {book.originalPrice > book.sellingPrice && (
                          <span className="block text-xs text-mutedText line-through">{formatPrice(book.originalPrice)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {status === 'approved' && (
                          <span className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase bg-emerald/10 text-emerald inline-flex items-center gap-1">
                            <CheckCircle size={13} /> Live
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase bg-amber/20 text-amber-dark inline-flex items-center gap-1">
                            Pending Review
                          </span>
                        )}
                        {status === 'rejected' && (
                          <div>
                            <span className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase bg-error/10 text-error inline-flex items-center gap-1">
                              <XCircle size={13} /> Rejected
                            </span>
                            {book.rejectionReason && (
                              <p className="text-xs text-error mt-1 max-w-xs">{book.rejectionReason}</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {isLoading ? (
                          <Loader2 size={18} className="animate-spin text-emerald inline-block" />
                        ) : (
                          <div className="flex justify-end gap-2">
                            {status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(id, book.title)}
                                  className="px-3 py-1.5 rounded-lg border border-emerald/30 bg-emerald/10 text-emerald text-xs font-semibold hover:bg-emerald hover:text-white transition-all flex items-center gap-1"
                                  title="Approve Book and Make Live"
                                >
                                  <CheckCircle size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => handleReject(id, book.title)}
                                  className="px-3 py-1.5 rounded-lg border border-error/30 bg-error/10 text-error text-xs font-semibold hover:bg-error hover:text-white transition-all flex items-center gap-1"
                                  title="Reject Book Listing"
                                >
                                  <XCircle size={14} /> Reject
                                </button>
                              </>
                            )}
                            {status === 'rejected' && (
                              <button
                                onClick={() => handleApprove(id, book.title)}
                                className="px-3 py-1.5 rounded-lg border border-forest/20 text-xs font-semibold hover:bg-forest hover:text-white transition-all"
                              >
                                Re-Approve
                              </button>
                            )}
                            {status === 'approved' && (
                              <button
                                onClick={() => handleReject(id, book.title)}
                                className="px-3 py-1.5 rounded-lg border border-error/20 text-xs text-error font-semibold hover:bg-error hover:text-white transition-all"
                              >
                                Un-Approve
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto mb-3 text-emerald" size={36} />
              <h3 className="font-serif text-xl font-bold text-forest">No listings in this view</h3>
              <p className="mt-1 text-mutedText">All pending listings have been reviewed or no listings match your query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminListings;
