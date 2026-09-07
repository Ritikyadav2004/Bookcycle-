import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';

const Cart = () => {
  const { items, removeItem, clearCart, getSubtotal, getTax, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-32 h-32 bg-warmWhite rounded-full flex items-center justify-center mb-8 shadow-inner border border-forest/5">
          <ShoppingBag size={48} className="text-emerald" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-4">Your cart is empty</h2>
        <p className="text-mutedText max-w-md mb-8">
          Looks like you haven't added any books to your cart yet. Explore our marketplace to find your next great read.
        </p>
        <Link to="/browse" className="btn-primary py-4 px-8 inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">Shopping Cart</h1>
          <p className="text-mutedText">You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart.</p>
        </div>
        <button 
          onClick={clearCart}
          className="text-sm font-semibold text-error hover:underline flex items-center gap-1"
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                layout
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-forest/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start group relative overflow-hidden"
              >
                {/* Decorative hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald/0 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <Link to={`/book/${item.id}`} className="w-32 sm:w-24 shrink-0 aspect-[3/4] bg-warmWhite rounded-xl overflow-hidden relative z-10">
                  <img src={item.images?.[0] || item.image} alt={item.title} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-emerald uppercase tracking-wider mb-1">
                      {item.category}
                    </div>
                    <Link to={`/book/${item.id}`}>
                      <h3 className="font-serif font-bold text-lg text-darkText group-hover:text-forest transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-mutedText mb-3">by {item.author}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-mutedText">
                      <span className="flex items-center gap-1 bg-warmWhite px-2 py-1 rounded-md">
                        <MapPin size={12} className="text-emerald" /> {item.seller?.city}
                      </span>
                      <span className="capitalize border border-forest/10 px-2 py-1 rounded-md">
                        Condition: {item.condition.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 border-forest/5 pt-4 sm:pt-0 shrink-0">
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-forest">
                        {formatPrice(item.sellingPrice)}
                      </span>
                      {item.discount > 0 && (
                        <span className="block text-sm text-mutedText line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-mutedText hover:text-error hover:bg-error/10 rounded-full transition-colors mt-auto sm:mt-4"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-forest text-white rounded-3xl p-6 md:p-8 sticky top-24 shadow-card">
            <h3 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-cream/80">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-cream/80">
                <span>Shipping Fee</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-cream/80">
                <span>Estimated Tax (18% GST)</span>
                <span>{formatPrice(getTax())}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="text-3xl font-bold text-emerald-light">{formatPrice(getTotal())}</span>
              </div>
              <p className="text-xs text-cream/60 mt-2 text-right">
                Standard shipping charges apply.
              </p>
            </div>

            <Link to="/buyer/checkout" className="btn-amber w-full py-4 text-lg font-bold shadow-lg flex justify-center mb-4">
              Proceed to Checkout
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-cream/70">
              <ShieldCheck size={16} className="text-emerald-300" />
              Secure Checkout via Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
