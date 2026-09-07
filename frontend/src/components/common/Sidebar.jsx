import React, { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, BookOpen, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { cn } from '../../utils/helpers';
import { getIcon } from '../../utils/iconMaps';

const Sidebar = ({ links, basePath = '' }) => {
  const location = useLocation();
  const { user, logout, role } = useAuthStore();
  const { isSidebarCollapsed, collapseSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isSidebarCollapsed ? '80px' : '260px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-forest text-white shadow-xl relative z-40 shrink-0 sticky top-0"
    >
      {/* Collapse Toggle */}
      <button
        onClick={collapseSidebar}
        className="absolute -right-3 top-8 w-6 h-6 bg-emerald text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand */}
      <div className={cn(
        "flex items-center h-20 px-6 border-b border-white/10",
        isSidebarCollapsed ? "justify-center px-0" : "gap-3"
      )}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald/20 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-white transition-colors">
            <BookOpen size={18} />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-serif text-xl font-bold tracking-tight">
              Book<span className="text-emerald">Cycle</span>
            </span>
          )}
        </Link>
      </div>

      {/* User Info (Collapsed) */}
      {isSidebarCollapsed && (
        <div className="py-4 flex justify-center border-b border-white/10 mb-4">
           <div className="w-10 h-10 rounded-full bg-emerald/20 text-emerald flex items-center justify-center font-bold" title={user?.name}>
              {user?.name?.charAt(0) || 'U'}
            </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto no-scrollbar flex flex-col gap-1.5 px-3">
        {!isSidebarCollapsed && (
          <div className="px-3 text-xs font-semibold text-emerald uppercase tracking-wider mb-2">
            Main Menu
          </div>
        )}
        
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          const isActive = location.pathname === link.path;
          
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
                isSidebarCollapsed ? "justify-center p-3" : "px-4 py-3",
                isActive 
                  ? "bg-emerald text-white shadow-md font-medium" 
                  : "text-cream-dark/70 hover:bg-white/5 hover:text-white"
              )}
              title={isSidebarCollapsed ? link.label : undefined}
            >
              {Icon && <Icon size={20} className={cn("shrink-0", isActive ? "text-white" : "text-emerald group-hover:text-white transition-colors")} />}
              
              {!isSidebarCollapsed && (
                <span className="truncate">{link.label}</span>
              )}

              {/* Active Indicator for collapsed state */}
              {isSidebarCollapsed && isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/10 mt-auto">
        {!isSidebarCollapsed ? (
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-emerald text-white flex items-center justify-center font-bold shrink-0 shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-emerald capitalize truncate">{role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-cream-dark/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button 
              onClick={handleLogout}
              className="p-3 text-cream-dark/60 hover:text-error hover:bg-error/10 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
