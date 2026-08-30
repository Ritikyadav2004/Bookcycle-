import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, BookOpen, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useUIStore from '../../store/uiStore';
import { NAV_LINKS } from '../../constants';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isAuthenticated, role, user, logout } = useAuthStore();
  const cartCount = useCartStore(state => state.getCount());
  const wishlistCount = useWishlistStore(state => state.getCount());
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsRegisterOpen(false);
    setIsProfileOpen(false);
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'buyer') return '/buyer/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50 group">
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center text-white shadow-card"
          >
            <BookOpen size={22} className="group-hover:animate-pulse-soft" />
          </motion.div>
          <span className="font-serif text-2xl font-bold text-forest tracking-tight">
            Book<span className="text-emerald">Cycle</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-medium transition-colors hover-underline pb-1 ${
                location.pathname === link.path ? 'text-emerald font-semibold' : 'text-darkText hover:text-forest'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={toggleSearch}
            className="p-2 text-darkText hover:text-emerald transition-colors rounded-full hover:bg-forest/5"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          <Link to="/buyer/wishlist" className="p-2 text-darkText hover:text-emerald transition-colors rounded-full hover:bg-forest/5 relative">
            <Heart size={20} />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <Link to="/buyer/cart" className="p-2 text-darkText hover:text-emerald transition-colors rounded-full hover:bg-forest/5 relative">
            <ShoppingCart size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-emerald text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="h-6 w-px bg-forest/20 mx-2"></div>

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 btn-ghost py-1.5 px-3"
              >
                <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm hidden xl:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-modal border border-forest/10 overflow-hidden"
                  >
                    <div className="p-3 border-b border-forest/10 bg-warmWhite">
                      <p className="font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-mutedText truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-2 text-sm text-darkText hover:bg-forest/5 rounded-lg transition-colors">
                        <User size={16} /> Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <div className="relative">
                <button 
                  onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                >
                  Register <ChevronDown size={14} className={`transition-transform ${isRegisterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isRegisterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-modal border border-forest/10 overflow-hidden"
                    >
                      <div className="p-2">
                        <Link to="/buyer/register" className="block px-4 py-2.5 text-sm text-darkText hover:bg-forest/5 rounded-lg transition-colors font-medium">
                          Register as Buyer
                        </Link>
                        <Link to="/seller/register" className="block px-4 py-2.5 text-sm text-emerald hover:bg-emerald/5 rounded-lg transition-colors font-medium">
                          Register as Seller
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-darkText z-50"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 left-0 w-full bg-white z-40 lg:hidden overflow-y-auto pt-24 px-6 pb-8 flex flex-col"
          >
            <div className="flex flex-col gap-6 flex-1">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className={`text-xl font-medium border-b border-forest/5 pb-3 ${
                      location.pathname === link.path ? 'text-emerald' : 'text-darkText'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center gap-6 py-4 border-b border-forest/5">
                <button onClick={() => { closeMobileMenu(); toggleSearch(); }} className="flex items-center gap-2 text-darkText font-medium">
                  <Search size={20} /> Search
                </button>
                <Link to="/buyer/wishlist" className="flex items-center gap-2 text-darkText font-medium">
                  <Heart size={20} /> Wishlist ({wishlistCount})
                </Link>
                <Link to="/buyer/cart" className="flex items-center gap-2 text-darkText font-medium">
                  <ShoppingCart size={20} /> Cart ({cartCount})
                </Link>
              </div>

              <div className="mt-auto pt-8 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-warmWhite rounded-xl mb-2">
                      <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-mutedText capitalize">{role}</p>
                      </div>
                    </div>
                    <Link to={getDashboardLink()} className="btn-primary w-full">Go to Dashboard</Link>
                    <button onClick={handleLogout} className="btn-secondary w-full">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full">Login</Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/buyer/register" className="btn-primary text-sm py-3 px-2">Buyer Register</Link>
                      <Link to="/seller/register" className="btn-amber text-sm py-3 px-2">Seller Register</Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
