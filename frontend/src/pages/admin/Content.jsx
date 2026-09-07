import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, Eye, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockReports = [
  { id: 'REP-001', type: 'Listing', target: 'Biology Class 11 (Fake Edition)', reporter: 'Rahul S.', reason: 'Counterfeit product', status: 'Pending', date: '2 hours ago' },
  { id: 'REP-002', type: 'User', target: 'BookWorm Store', reporter: 'Priya P.', reason: 'Abusive language in messages', status: 'Pending', date: '5 hours ago' },
  { id: 'REP-003', type: 'Review', target: 'Review on Physics Class 12', reporter: 'Amit K.', reason: 'Spam/Irrelevant', status: 'Resolved', date: 'Yesterday' },
  { id: 'REP-004', type: 'Listing', target: 'Chemistry Lab Manual', reporter: 'System AI', reason: 'Suspiciously low price', status: 'Pending', date: 'Yesterday' },
];

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  
  const filteredReports = mockReports.filter(report => report.status === activeTab);

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">Content Moderation</h1>
          <p className="text-mutedText">Review flagged listings, users, and reports.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-error text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-error/30">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-error leading-none mb-1">24</h3>
            <p className="text-sm font-semibold text-error/80">Pending Reports</p>
          </div>
        </div>
        
        <div className="bg-amber/10 border border-amber/20 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-dark text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber/30">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-dark leading-none mb-1">12</h3>
            <p className="text-sm font-semibold text-amber-dark/80">AI Flagged Items</p>
          </div>
        </div>
        
        <div className="bg-emerald/10 border border-emerald/20 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald/30">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald leading-none mb-1">156</h3>
            <p className="text-sm font-semibold text-emerald/80">Resolved This Week</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-forest/5 flex justify-between items-center">
          <div className="flex space-x-1 bg-warmWhite p-1 rounded-xl">
            {['Pending', 'Resolved', 'Dismissed'].map(tab => (
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
        </div>

        {/* Reports List */}
        <div className="divide-y divide-forest/5">
          <AnimatePresence mode="wait">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 hover:bg-warmWhite transition-colors flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        report.type === 'Listing' ? 'bg-emerald/10 text-emerald' : 
                        report.type === 'User' ? 'bg-amber/20 text-amber-dark' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {report.type}
                      </span>
                      <span className="text-xs font-mono text-mutedText">{report.id}</span>
                      <span className="text-xs text-mutedText">• {report.date}</span>
                    </div>
                    
                    <h3 className="font-bold text-darkText text-lg mb-1">{report.target}</h3>
                    
                    <div className="bg-error/5 border border-error/10 rounded-lg p-3 mb-3 inline-block">
                      <span className="text-xs font-semibold text-error uppercase tracking-wider block mb-1">Report Reason</span>
                      <span className="text-sm font-medium text-darkText">{report.reason}</span>
                    </div>
                    
                    <div className="text-sm text-mutedText flex items-center gap-2">
                      <MessageSquare size={14} /> Reported by <span className="font-semibold">{report.reporter}</span>
                    </div>
                  </div>
                  
                  {activeTab === 'Pending' && (
                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                      <button
                        onClick={() => toast.success(`Reviewing ${report.id}`)}
                        className="flex-1 md:flex-none py-2 px-4 bg-forest text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-forest-dark transition-colors shadow-sm"
                      >
                        <Eye size={16} /> Review
                      </button>
                      <button
                        onClick={() => toast.success(`${report.id} dismissed`)}
                        className="flex-1 md:flex-none py-2 px-4 bg-emerald/10 text-emerald text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald/20 transition-colors"
                      >
                        <CheckCircle size={16} /> Dismiss
                      </button>
                      <button
                        onClick={() => toast.success(`Action workflow opened for ${report.id}`)}
                        className="flex-1 md:flex-none py-2 px-4 bg-error/10 text-error text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-error/20 transition-colors"
                      >
                        <XCircle size={16} /> Take Action
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-forest mb-1">All caught up!</h3>
                <p className="text-mutedText">There are no {activeTab.toLowerCase()} reports at the moment.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ContentModeration;
