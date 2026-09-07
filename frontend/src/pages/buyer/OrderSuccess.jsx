import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Download } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state || { 
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000), 
    total: 0, 
    method: 'card' 
  };

  useEffect(() => {
    // Only show if came from checkout
    if (!location.state) {
      navigate('/buyer/dashboard', { replace: true });
      return;
    }
    
    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#163D2A', '#22A06B', '#F19A2B']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#163D2A', '#22A06B', '#F19A2B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [location.state, navigate]);

  if (!location.state) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-card max-w-2xl w-full border border-forest/10 text-center relative overflow-hidden"
      >
        {/* Decorative background circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald/30">
            <CheckCircle size={48} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-mutedText text-lg mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="bg-warmWhite rounded-2xl p-6 w-full max-w-md mb-8 text-left border border-forest/5">
            <div className="flex justify-between border-b border-forest/10 pb-3 mb-3">
              <span className="text-mutedText font-medium">Order ID</span>
              <span className="font-bold text-forest">{state.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-forest/10 pb-3 mb-3">
              <span className="text-mutedText font-medium">Payment Method</span>
              <span className="font-bold text-forest uppercase">{state.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedText font-medium">Total Paid</span>
              <span className="font-bold text-emerald text-xl">{formatPrice(state.total)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link to="/buyer/dashboard" className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2">
              <Package size={18} /> View Order Status
            </Link>
            <button
              onClick={() => toast.success(`Invoice downloaded for ${state.orderId}`)}
              className="flex-1 btn-secondary bg-warmWhite border-forest/20 text-forest py-3.5 flex items-center justify-center gap-2"
            >
              <Download size={18} /> Invoice
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-forest/10 w-full text-sm">
            <Link to="/browse" className="font-semibold text-emerald hover:text-forest transition-colors inline-flex items-center gap-1">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
