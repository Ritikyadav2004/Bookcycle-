import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, BookOpen, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import BookCard from '../../components/cards/BookCard';
import { getRecommendedBooks } from '../../data/mockBooks';

const BuyerDashboard = () => {
  const { user } = useAuthStore();
  const recommended = getRecommendedBooks().slice(0, 4);

  const stats = [
    { label: 'Books Purchased', value: '12', icon: Package, color: 'text-emerald', bg: 'bg-emerald/10' },
    { label: 'Saved Items', value: '8', icon: BookOpen, color: 'text-amber-dark', bg: 'bg-amber-light/20' },
    { label: 'Reviews Given', value: '5', icon: Star, color: 'text-forest', bg: 'bg-forest/10' },
    { label: 'Total Saved', value: '₹1,240', icon: TrendingUp, color: 'text-emerald-dark', bg: 'bg-emerald-light/20' },
  ];

  const recentOrders = [
    { id: 'ORD-1092', date: 'Oct 12, 2026', total: 450, status: 'Delivered', items: 2 },
    { id: 'ORD-1085', date: 'Sep 28, 2026', total: 320, status: 'Processing', items: 1 },
    { id: 'ORD-1042', date: 'Aug 15, 2026', total: 890, status: 'Delivered', items: 4 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-forest/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-forest text-white flex items-center justify-center font-serif text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest mb-1">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-mutedText">Ready to discover your next great read?</p>
          </div>
        </div>
        
        <Link to="/browse" className="relative z-10 btn-primary whitespace-nowrap">
          Browse Books
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-forest flex items-center gap-2">
              <Clock size={20} className="text-emerald" /> Recent Orders
            </h2>
            <Link to="/buyer/orders" className="text-sm font-semibold text-emerald hover:text-forest transition-colors">
              View All
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-warmWhite border-b border-forest/5 text-sm text-mutedText uppercase tracking-wider">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-forest/5 hover:bg-forest/5 transition-colors group">
                      <td className="p-4 font-medium text-darkText">{order.id}</td>
                      <td className="p-4 text-mutedText text-sm">{order.date}</td>
                      <td className="p-4 text-mutedText text-sm">{order.items} items</td>
                      <td className="p-4 font-semibold text-forest">₹{order.total}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald/10 text-emerald' : 'bg-amber/20 text-amber-dark'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/buyer/order/${order.id}`}
                          className="inline-flex p-2 text-mutedText hover:text-emerald rounded-full hover:bg-emerald/10 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label={`View ${order.id}`}
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          <div className="bg-forest text-white rounded-3xl p-6 relative overflow-hidden shadow-card">
            <div className="absolute -right-4 -top-4 text-white/10">
              <BookOpen size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-bold mb-2">Have old books?</h3>
              <p className="text-cream/80 text-sm mb-6 max-w-[80%]">
                Turn your finished textbooks into cash by selling them on BookCycle.
              </p>
              <Link to="/seller/register" className="btn-secondary bg-white/10 hover:bg-white/20 border-white/20 text-white w-full">
                Become a Seller
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-forest/5">
            <h3 className="font-bold text-forest mb-4">Account Quick Links</h3>
            <div className="space-y-3">
              <Link to="/buyer/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-warmWhite text-darkText font-medium transition-colors">
                Edit Profile <ChevronRight size={16} className="text-mutedText" />
              </Link>
              <Link to="/buyer/settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-warmWhite text-darkText font-medium transition-colors">
                Payment Methods <ChevronRight size={16} className="text-mutedText" />
              </Link>
              <Link to="/buyer/settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-warmWhite text-darkText font-medium transition-colors">
                Address Book <ChevronRight size={16} className="text-mutedText" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-forest">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {recommended.map((book) => (
             <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
