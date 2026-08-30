import React, { useState, useEffect } from 'react';
import { Package, MapPin, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import orderService from '../../services/orderService';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.list();
        const formatted = data.map(o => ({
          id: o.orderNumber || o._id || o.id,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
          total: o.totalAmount || o.subtotal || 0,
          status: o.orderStatus || 'Placed',
          items: (o.items || []).map(i => ({
            title: i.book?.title || 'Unknown Book',
            author: i.book?.author || 'Unknown Author',
            price: i.price || i.book?.sellingPrice || 0
          }))
        }));
        setOrders(formatted);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-forest" />
        <p className="mt-4 text-mutedText font-semibold">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <h1 className="text-3xl font-serif font-bold text-forest mb-2">My Orders</h1>
      <p className="text-mutedText mb-8">View and track your previous purchases.</p>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-forest/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-forest/5 pb-4 mb-4 gap-4">
              <div>
                <h3 className="font-bold text-darkText">Order #{order.id}</h3>
                <p className="text-sm text-mutedText">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-forest">{formatPrice(order.total)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Delivered' ? 'bg-emerald/10 text-emerald' : 'bg-amber/20 text-amber-dark'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-warmWhite p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-forest/5">
                      <Package size={16} className="text-mutedText" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-darkText">{item.title}</h4>
                      <p className="text-xs text-mutedText">by {item.author}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-forest">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-forest/5 flex justify-end gap-3">
              <button
                onClick={() => toast.success(`Invoice ready for ${order.id}`)}
                className="px-4 py-2 text-sm font-semibold text-forest border border-forest/20 rounded-lg hover:bg-forest/5 transition-colors"
              >
                View Invoice
              </button>
              {order.status === 'Delivered' && (
                <button
                  onClick={() => toast.success(`Review form opened for ${order.id}`)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-forest rounded-lg hover:bg-forest-dark transition-colors"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerOrders;
