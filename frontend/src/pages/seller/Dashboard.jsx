import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, BookMarked, ShoppingBag, Plus, ArrowRight, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { formatPrice } from '../../utils/formatters';

const SellerDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Earnings', value: formatPrice(12450), icon: IndianRupee, color: 'text-emerald', bg: 'bg-emerald/10' },
    { label: 'Active Listings', value: '24', icon: BookMarked, color: 'text-amber-dark', bg: 'bg-amber-light/20' },
    { label: 'Books Sold', value: '45', icon: ShoppingBag, color: 'text-forest', bg: 'bg-forest/10' },
    { label: 'Monthly Growth', value: '+15%', icon: TrendingUp, color: 'text-emerald-dark', bg: 'bg-emerald-light/20' },
  ];

  const recentListings = [
    { id: '1', title: 'Mathematics Class 12 Part I', price: 150, status: 'Active', views: 45 },
    { id: '2', title: 'Physics Class 11 Part II', price: 180, status: 'Active', views: 32 },
    { id: '3', title: 'Chemistry Class 10', price: 120, status: 'Sold', views: 89 },
  ];

  const recentOrders = [
    { id: 'ORD-1092', book: 'Mathematics Class 12', date: 'Oct 12, 2026', total: 150, status: 'Pending' },
    { id: 'ORD-1085', book: 'Biology Class 11', date: 'Sep 28, 2026', total: 200, status: 'Shipped' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-forest/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-forest text-white flex items-center justify-center font-serif text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest mb-1">
              Store Dashboard
            </h1>
            <p className="text-mutedText">Welcome back, {user?.name}</p>
          </div>
        </div>
        
        <Link to="/seller/add-book" className="relative z-10 btn-amber flex items-center gap-2 whitespace-nowrap shadow-lg">
          <Plus size={18} /> Add New Book
        </Link>
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
              className="bg-white p-6 rounded-3xl shadow-sm border border-forest/5 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-mutedText mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-forest leading-none">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-forest flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber-dark" /> Action Required
            </h2>
            <Link to="/seller/orders" className="text-sm font-semibold text-amber-dark hover:text-forest transition-colors">
              View All Orders
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
            <div className="divide-y divide-forest/5">
              {recentOrders.map((order, i) => (
                <div key={i} className="p-5 hover:bg-warmWhite transition-colors flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-darkText">{order.id}</span>
                      <span className="text-xs text-mutedText">• {order.date}</span>
                    </div>
                    <p className="text-sm font-medium text-forest mb-2">{order.book}</p>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.status === 'Pending' ? 'bg-amber/20 text-amber-dark' : 'bg-emerald/10 text-emerald'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between">
                    <span className="font-bold text-lg text-forest">{formatPrice(order.total)}</span>
                    <button
                      onClick={() => toast.success(`${order.id} status update panel opened`)}
                      className="text-xs font-semibold text-emerald hover:underline"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-forest flex items-center gap-2">
              <BookMarked size={20} className="text-emerald" /> Recent Listings
            </h2>
            <Link to="/seller/listings" className="text-sm font-semibold text-emerald hover:text-forest transition-colors">
              Manage Listings
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
            <div className="divide-y divide-forest/5">
              {recentListings.map((listing, i) => (
                <div key={i} className="p-5 hover:bg-warmWhite transition-colors flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-darkText truncate mb-1">{listing.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-mutedText">
                      <span className="font-bold text-forest">{formatPrice(listing.price)}</span>
                      <span>•</span>
                      <span className={`font-medium ${listing.status === 'Active' ? 'text-emerald' : 'text-error'}`}>
                        {listing.status}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {listing.views} views</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Editing ${listing.title}`)}
                    className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-colors shrink-0"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
