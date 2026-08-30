import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, AlertTriangle, IndianRupee, TrendingUp, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: formatPrice(1245000), icon: IndianRupee, color: 'text-emerald', bg: 'bg-emerald/10', trend: '+12.5%' },
    { label: 'Active Users', value: '12,450', icon: Users, color: 'text-amber-dark', bg: 'bg-amber-light/20', trend: '+5.2%' },
    { label: 'Total Listings', value: '8,234', icon: BookOpen, color: 'text-forest', bg: 'bg-forest/10', trend: '+18.1%' },
    { label: 'Reported Items', value: '42', icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10', trend: '-2.4%' },
  ];

  const recentTransactions = [
    { id: 'TXN-001', user: 'Rahul Sharma', amount: 450, status: 'Completed', date: 'Just now' },
    { id: 'TXN-002', user: 'Priya Patel', amount: 1200, status: 'Completed', date: '2 mins ago' },
    { id: 'TXN-003', user: 'Amit Kumar', amount: 350, status: 'Pending', date: '15 mins ago' },
    { id: 'TXN-004', user: 'Sneha Gupta', amount: 890, status: 'Completed', date: '1 hour ago' },
    { id: 'TXN-005', user: 'Vikram Singh', amount: 150, status: 'Failed', date: '2 hours ago' },
  ];

  const pendingApprovals = [
    { id: 'SELLER-092', name: 'BookWorm Store', type: 'Seller Verification', date: 'Today, 10:30 AM' },
    { id: 'SELLER-091', name: 'Knowledge Hub', type: 'Seller Verification', date: 'Yesterday, 04:15 PM' },
    { id: 'BOOK-442', name: 'Advanced Physics (Class 12)', type: 'Listing Flagged', date: 'Yesterday, 02:00 PM' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-1">Platform Overview</h1>
          <p className="text-mutedText">Monitor activity, revenue, and system health.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald"></span>
          </span>
          <span className="text-sm font-semibold text-emerald">System Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-forest/5 relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-emerald/10 text-emerald' : 'bg-error/10 text-error'}`}>
                  {stat.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-forest leading-none mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-mutedText">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
            <div className="p-6 border-b border-forest/5 flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-forest">Recent Transactions</h2>
              <Link to="/admin/transactions" className="text-sm font-semibold text-emerald hover:text-forest transition-colors">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-warmWhite border-b border-forest/5 text-xs text-mutedText uppercase tracking-wider">
                    <th className="p-4 pl-6 font-semibold">Transaction ID</th>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right pr-6">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn, i) => (
                    <tr key={i} className="border-b border-forest/5 hover:bg-forest/5 transition-colors">
                      <td className="p-4 pl-6 font-medium text-darkText text-sm">{txn.id}</td>
                      <td className="p-4 text-darkText text-sm">{txn.user}</td>
                      <td className="p-4 font-semibold text-forest text-sm">{formatPrice(txn.amount)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          txn.status === 'Completed' ? 'bg-emerald/10 text-emerald' : 
                          txn.status === 'Pending' ? 'bg-amber/20 text-amber-dark' : 
                          'bg-error/10 text-error'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-mutedText text-sm">{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
            <div className="p-6 border-b border-forest/5 flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-forest">Requires Action</h2>
              <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </div>
            <div className="divide-y divide-forest/5">
              {pendingApprovals.map((item, i) => (
                <div key={i} className="p-5 hover:bg-warmWhite transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-dark uppercase tracking-wider">{item.type}</span>
                    <span className="text-xs text-mutedText">{item.date}</span>
                  </div>
                  <h4 className="font-semibold text-darkText mb-1">{item.name}</h4>
                  <p className="text-xs text-mutedText mb-4">ID: {item.id}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.success(`${item.id} approved`)}
                      className="flex-1 py-1.5 bg-emerald/10 hover:bg-emerald/20 text-emerald text-sm font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => toast.success(`${item.id} rejected`)}
                      className="flex-1 py-1.5 bg-error/10 hover:bg-error/20 text-error text-sm font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-forest/5">
              <Link to="/admin/reports" className="block w-full text-center text-sm font-semibold text-mutedText hover:text-forest transition-colors">
                View all pending actions
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
