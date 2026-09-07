import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Eye, Filter, Search, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockBooks } from '../../data/mockBooks';
import { formatPrice, getConditionInfo } from '../../utils/formatters';

const statusByIndex = ['Pending Review', 'Live', 'Flagged', 'Live', 'Rejected'];

const AdminListings = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const listings = useMemo(() => mockBooks.slice(0, 12).map((book, index) => ({
    ...book,
    status: statusByIndex[index % statusByIndex.length],
    reportCount: index % 3,
  })), []);

  const tabs = ['All', 'Pending Review', 'Live', 'Flagged', 'Rejected'];
  const filteredListings = listings.filter((book) => {
    const matchesTab = activeTab === 'All' || book.status === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(query) || book.subject.toLowerCase().includes(query) || book.seller?.name?.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">Book Listings</h1>
          <p className="text-mutedText">Approve new uploads, inspect reported books, and keep marketplace quality high.</p>
        </div>
        <button onClick={() => toast.success('Listing report export prepared')} className="btn-primary shadow-lg">
          Export Listing Report
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          ['Pending', listings.filter((book) => book.status === 'Pending Review').length, 'bg-amber/10 text-amber-dark'],
          ['Live Listings', listings.filter((book) => book.status === 'Live').length, 'bg-emerald/10 text-emerald'],
          ['Flagged', listings.filter((book) => book.status === 'Flagged').length, 'bg-error/10 text-error'],
          ['Total Value', formatPrice(listings.reduce((sum, book) => sum + book.sellingPrice, 0)), 'bg-forest/10 text-forest'],
        ].map(([label, value, tone], index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-3xl border border-forest/5 bg-white p-5 shadow-sm">
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
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-forest shadow-sm' : 'text-mutedText hover:text-darkText'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search listings..." className="w-full rounded-lg border border-forest/10 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-emerald" />
            </div>
            <button onClick={() => toast.success(`${activeTab} listing filters opened`)} className="rounded-lg border border-forest/10 p-2 text-forest transition-colors hover:bg-forest/5">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-warmWhite text-xs uppercase tracking-wider text-mutedText">
              <tr>
                <th className="p-4 pl-6">Book</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reports</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((book) => {
                const condition = getConditionInfo(book.condition);
                return (
                  <tr key={book.id} className="border-b border-forest/5 transition-colors hover:bg-forest/5">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <img src={book.image} alt={book.title} className="h-16 w-12 rounded-lg border border-forest/10 object-cover" />
                        <div>
                          <Link to={`/book/${book.id}`} className="font-semibold text-darkText hover:text-emerald">{book.title}</Link>
                          <p className="mt-1 text-xs text-mutedText">Class {book.class} | {book.subject} | {condition.label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-darkText">{book.seller?.name || 'Verified Seller'}</td>
                    <td className="p-4 font-semibold text-forest">{formatPrice(book.sellingPrice)}</td>
                    <td className="p-4">
                      <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${book.status === 'Live' ? 'bg-emerald/10 text-emerald' : book.status === 'Flagged' ? 'bg-error/10 text-error' : book.status === 'Rejected' ? 'bg-gray-200 text-gray-500' : 'bg-amber/20 text-amber-dark'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${book.reportCount > 0 ? 'text-error' : 'text-emerald'}`}>
                        <ShieldAlert size={15} /> {book.reportCount}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <Link to={`/book/${book.id}`} className="rounded-lg border border-forest/10 bg-white p-2 text-mutedText transition-colors hover:bg-forest/10 hover:text-forest" title="View listing">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => toast.success(`${book.title} approved`)} className="rounded-lg border border-forest/10 bg-white p-2 text-mutedText transition-colors hover:bg-emerald/10 hover:text-emerald" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => toast.success(`${book.title} rejected`)} className="rounded-lg border border-forest/10 bg-white p-2 text-mutedText transition-colors hover:bg-error/10 hover:text-error" title="Reject">
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => toast.success(`${book.title} removal queued`)} className="rounded-lg border border-forest/10 bg-white p-2 text-mutedText transition-colors hover:bg-error/10 hover:text-error" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto mb-3 text-emerald" size={36} />
              <h3 className="font-serif text-xl font-bold text-forest">No listings need attention</h3>
              <p className="mt-1 text-mutedText">Try a different search or status filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminListings;
