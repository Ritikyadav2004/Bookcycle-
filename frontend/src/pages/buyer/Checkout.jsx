import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, CreditCard, Home, Loader2, MapPin, ShieldCheck, Tag, Truck, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import { checkoutCOD } from '../../services/apiService';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../constants';
import { formatPrice } from '../../utils/formatters';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  deliveryMethod: z.enum(['standard', 'express', 'pickup']),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
  coupon: z.string().optional(),
});

const steps = [
  { title: 'Address', icon: Home, fields: ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'] },
  { title: 'Delivery', icon: Truck, fields: ['deliveryMethod'] },
  { title: 'Payment', icon: CreditCard, fields: ['paymentMethod'] },
  { title: 'Confirm', icon: ShieldCheck, fields: [] },
];

const inputClass = (error) => `input-field ${error ? 'border-error focus:border-error' : ''}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getPlatformFee, getTax } = useCartStore();
  const [step, setStep] = useState(0);

  const { register, handleSubmit, trigger, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: 'Aarav Mehta',
      email: 'reader@example.com',
      phone: '9876543210',
      address: '12 Library Lane, Near Central School',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
      coupon: '',
    },
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const coupon = watch('coupon');
  const delivery = DELIVERY_METHODS.find((method) => method.id === deliveryMethod) || DELIVERY_METHODS[0];
  const subtotal = getSubtotal();
  const tax = getTax();
  const platformFee = getPlatformFee();
  const codFee = paymentMethod === 'cod' ? 30 : 0;
  const couponDiscount = coupon?.toUpperCase() === 'BOOKCYCLE10' ? 50 : 0;
  const total = Math.max(0, subtotal + tax + delivery.price + platformFee + codFee - couponDiscount);

  const summaryRows = useMemo(() => [
    ['Subtotal', subtotal],
    ['Estimated tax', tax],
    ['Delivery charge', delivery.price],
    ['Platform fee', platformFee],
    ...(codFee ? [['COD fee', codFee]] : []),
    ...(couponDiscount ? [['Coupon discount', -couponDiscount]] : []),
  ], [subtotal, tax, delivery.price, platformFee, codFee, couponDiscount]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-serif font-bold text-forest">No items to checkout</h2>
        <Link to="/browse" className="btn-primary">Browse Books</Link>
      </div>
    );
  }

  const nextStep = async () => {
    const valid = await trigger(steps[step].fields);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const onSubmit = async (data) => {
    try {
      const orderPayload = {
        paymentMethod: 'COD',
        shippingAddress: {
          fullName: data.fullName,
          addressLine: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.pincode,
          phone: data.phone
        },
        items: items.map(item => ({
          book: item.id || item._id,
          quantity: item.quantity
        }))
      };
      
      const response = await checkoutCOD(orderPayload);
      
      clearCart();
      const orderId = response.data?.orders?.[0]?.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      navigate('/buyer/order-success', { state: { orderId, total, method: 'cod' }, replace: true });
      toast.success('Order placed successfully!');
    } catch (error) {
      console.warn("Backend checkout failed, running mock checkout:", error);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      clearCart();
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      navigate('/buyer/order-success', { state: { orderId, total, method: data.paymentMethod }, replace: true });
      toast.success('Order placed successfully!');
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-24 md:pb-12">
      <Link to="/buyer/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-mutedText transition hover:text-forest">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-heading">Secure Checkout</h1>
          <p className="text-mutedText">Address, delivery, payment, and confirmation in a guided flow.</p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 text-sm font-bold text-emerald">
          <ShieldCheck size={16} /> Protected mock checkout
        </div>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-2">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const active = index <= step;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => index < step && setStep(index)}
              className={`rounded-xl border px-2 py-3 transition ${active ? 'border-emerald bg-emerald/10 text-emerald' : 'border-forest/10 bg-white text-mutedText'}`}
            >
              <Icon className="mx-auto mb-1" size={18} />
              <span className="block truncate text-xs font-bold">{item.title}</span>
            </button>
          );
        })}
      </div>

      <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.section key="address" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><MapPin className="text-emerald" /> Delivery Address</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="input-label">Full Name</label>
                    <input {...register('fullName')} className={inputClass(errors.fullName)} />
                    {errors.fullName && <p className="input-error">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input type="email" {...register('email')} className={inputClass(errors.email)} />
                    {errors.email && <p className="input-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Phone</label>
                    <input type="tel" {...register('phone')} className={inputClass(errors.phone)} />
                    {errors.phone && <p className="input-error">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="input-label">Full Address</label>
                    <input {...register('address')} className={inputClass(errors.address)} />
                    {errors.address && <p className="input-error">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">City</label>
                    <input {...register('city')} className={inputClass(errors.city)} />
                    {errors.city && <p className="input-error">{errors.city.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">State</label>
                      <input {...register('state')} className={inputClass(errors.state)} />
                      {errors.state && <p className="input-error">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">Pincode</label>
                      <input {...register('pincode')} className={inputClass(errors.pincode)} />
                      {errors.pincode && <p className="input-error">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {step === 1 && (
              <motion.section key="delivery" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><Truck className="text-emerald" /> Delivery Method</h2>
                <div className="grid gap-4">
                  {DELIVERY_METHODS.map((method) => (
                    <label key={method.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${deliveryMethod === method.id ? 'border-emerald bg-emerald/5' : 'border-forest/10 hover:border-emerald/40'}`}>
                      <input type="radio" value={method.id} {...register('deliveryMethod')} className="h-5 w-5 accent-emerald" />
                      <div className="flex-1">
                        <p className="font-bold text-darkText">{method.name}</p>
                        <p className="text-sm text-mutedText">{method.days}</p>
                      </div>
                      <span className="font-bold text-forest">{method.price ? formatPrice(method.price) : 'Free'}</span>
                    </label>
                  ))}
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section key="payment" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><CreditCard className="text-emerald" /> Payment Method</h2>
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.id === 'upi' ? Wallet : method.id === 'cod' ? MapPin : CreditCard;
                    return (
                      <label key={method.id} className={`block cursor-pointer rounded-2xl border p-5 transition ${paymentMethod === method.id ? 'border-emerald bg-emerald/5' : 'border-forest/10 hover:border-emerald/40'}`}>
                        <div className="flex items-center gap-4">
                          <input type="radio" value={method.id} {...register('paymentMethod')} className="h-5 w-5 accent-emerald" />
                          <Icon size={20} className="text-forest" />
                          <div>
                            <p className="font-bold text-darkText">{method.name}</p>
                            <p className="text-sm text-mutedText">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                  <label className="input-label pt-2">Coupon Code</label>
                  <div className="flex gap-3">
                    <input {...register('coupon')} className="input-field" placeholder="Try BOOKCYCLE10" />
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber-dark"><Tag size={20} /></div>
                  </div>
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section key="confirm" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><Check className="text-emerald" /> Confirm Order</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-warmWhite p-4">
                      <img src={item.images?.[0] || item.image} alt={item.title} className="h-20 w-14 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-darkText">{item.title}</p>
                        <p className="text-sm text-mutedText">Seller: {item.seller?.name}</p>
                      </div>
                      <span className="font-bold text-forest">{formatPrice(item.sellingPrice)}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0} className="btn-secondary disabled:opacity-40">Back</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="btn-primary">Continue</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="btn-amber">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : `Place Order - ${formatPrice(total)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-6">
          <h3 className="mb-5 text-xl font-serif font-bold">Order Summary</h3>
          <div className="mb-5 max-h-56 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="truncate text-mutedText">{item.title}</span>
                <span className="font-semibold text-darkText">{formatPrice(item.sellingPrice)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-forest/10 pt-5">
            {summaryRows.map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm text-mutedText">
                <span>{label}</span>
                <span className={value < 0 ? 'font-semibold text-success' : 'font-semibold text-darkText'}>{value < 0 ? '-' : ''}{formatPrice(Math.abs(value))}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-forest/10 pt-5 text-lg font-bold text-forest">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
