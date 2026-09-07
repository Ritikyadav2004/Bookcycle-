import React from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, CalendarDays, CheckCircle2, Download, Eye, Filter, MessageCircle, Package, Receipt, Search, Settings, Star, TrendingUp, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const configs = {
  'buyer-recently-viewed': { title: 'Recently Viewed', icon: Eye, stats: ['12 books viewed', '4 price drops', '3 available now'], actions: ['Reopen book', 'Move to wishlist', 'Clear history'] },
  'buyer-recommendations': { title: 'Recommendations', icon: Star, stats: ['18 curated picks', '6 academic matches', '5 best discounts'], actions: ['Tune interests', 'Add to cart', 'Hide suggestion'] },
  'buyer-reviews': { title: 'My Reviews', icon: MessageCircle, stats: ['7 reviews posted', '2 pending ratings', '4.8 average rating'], actions: ['Rate delivered order', 'Edit review', 'View public profile'] },
  'buyer-notifications': { title: 'Notifications', icon: Bell, stats: ['5 unread', '2 order updates', '3 wishlist alerts'], actions: ['Mark all read', 'Open order', 'Manage alerts'] },
  'seller-orders': { title: 'Orders Received', icon: Package, stats: ['9 new orders', '14 packed', '6 shipped'], actions: ['Confirm order', 'Add tracking', 'Contact buyer'] },
  'seller-sales': { title: 'Sales', icon: TrendingUp, stats: ['₹42,860 revenue', '86 sold books', '18% growth'], actions: ['Filter by date', 'Download report', 'View chart'] },
  'seller-transactions': { title: 'Transactions', icon: Receipt, stats: ['31 completed', '4 pending payouts', '₹8,200 this week'], actions: ['Export CSV', 'View payout', 'Open invoice'] },
  'seller-reviews': { title: 'Reviews', icon: Star, stats: ['4.7 seller rating', '42 reviews', '3 awaiting reply'], actions: ['Reply to review', 'Flag issue', 'Sort by rating'] },
  'seller-notifications': { title: 'Notifications', icon: Bell, stats: ['6 unread', '3 approval updates', '2 order reminders'], actions: ['Mark all read', 'Open listing', 'Manage alerts'] },
  'seller-profile': { title: 'Seller Profile', icon: User, stats: ['Verified seller', '245 total sales', 'Delhi service area'], actions: ['Edit profile', 'Update address', 'Change password'] },
  'seller-settings': { title: 'Settings', icon: Settings, stats: ['COD enabled', 'Express delivery on', 'Email alerts active'], actions: ['Delivery methods', 'Notification preferences', 'Account security'] },
  'admin-categories': { title: 'Categories', icon: BookOpen, stats: ['10 categories', '86 academic listings', '14 pending edits'], actions: ['Add category', 'Reorder category', 'Feature category'] },
  'admin-orders': { title: 'Orders', icon: Package, stats: ['524 total orders', '41 in transit', '27 support flags'], actions: ['Update status', 'View details', 'Export orders'] },
  'admin-transactions': { title: 'Transactions', icon: Receipt, stats: ['₹8.4L volume', '318 completed', '12 under review'], actions: ['Date range', 'Export report', 'Open transaction'] },
  'admin-reports': { title: 'Reports', icon: Filter, stats: ['13 reported books', '5 seller issues', '8 dismissed'], actions: ['Dismiss report', 'Remove listing', 'Block seller'] },
  'admin-reviews': { title: 'Reviews', icon: Star, stats: ['928 reviews', '17 flagged', '4.6 marketplace rating'], actions: ['Moderate review', 'Contact user', 'Export list'] },
  'admin-notifications': { title: 'Notifications', icon: Bell, stats: ['11 unread', '5 approvals due', '3 account alerts'], actions: ['Broadcast update', 'Mark resolved', 'Open queue'] },
  'admin-settings': { title: 'Settings', icon: Settings, stats: ['Role guards on', 'Moderation active', 'Mock API mode'], actions: ['Admin roles', 'Marketplace rules', 'API settings'] },
};

const rows = ['Pending review', 'Ready for action', 'Recently updated', 'Needs attention'];

const PortalPage = ({ type }) => {
  const config = configs[type] || configs['buyer-notifications'];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald">
            <Icon size={16} />
            <span>BookCycle workspace</span>
          </div>
          <h1 className="section-heading">{config.title}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success(`${config.title} search opened`)} className="btn-secondary py-2.5"><Search size={18} /> Search</button>
          <button onClick={() => toast.success(`${config.title} export prepared`)} className="btn-primary py-2.5"><Download size={18} /> Export</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {config.stats.map((stat, index) => (
          <motion.div key={stat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="card p-5">
            <p className="text-sm text-mutedText">Metric {index + 1}</p>
            <p className="mt-2 text-2xl font-serif font-bold text-forest">{stat}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card overflow-hidden">
          <div className="border-b border-forest/10 p-5">
            <h2 className="text-xl font-serif font-bold">Activity Queue</h2>
          </div>
          <div className="divide-y divide-forest/10">
            {rows.map((row, index) => (
              <div key={row} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-darkText">{row}</p>
                    <p className="text-sm text-mutedText">#{1024 + index} - updated today</p>
                  </div>
                </div>
                <span className="badge-info w-fit">Active</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="card p-5">
          <h2 className="mb-4 text-xl font-serif font-bold">Quick Actions</h2>
          <div className="space-y-3">
            {config.actions.map((action) => (
              <button
                key={action}
                onClick={() => toast.success(`${action} workflow opened`)}
                className="flex w-full items-center justify-between rounded-xl border border-forest/10 bg-warmWhite px-4 py-3 text-left font-semibold text-darkText transition hover:border-emerald/30 hover:bg-white"
              >
                {action}
                <CheckCircle2 size={18} className="text-emerald" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PortalPage;
