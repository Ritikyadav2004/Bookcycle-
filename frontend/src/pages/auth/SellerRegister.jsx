import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, User, Store, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SellerRegister = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await authService.registerSeller(data);
      login(user, 'seller', user.token);
      toast.success('Seller account created successfully!');
      navigate('/seller/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber/20 text-amber-dark mb-4">
          <Store size={24} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-2">Become a Seller</h2>
        <p className="text-mutedText">Reach thousands of readers and earn from your old books.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-darkText mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className={errors.name ? "text-error" : "text-mutedText"} />
              </div>
              <input
                type="text"
                {...register('name')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-amber focus:ring-amber'} bg-white focus:outline-none focus:ring-1 transition-all`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-error font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-darkText mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone size={18} className={errors.phone ? "text-error" : "text-mutedText"} />
              </div>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-amber focus:ring-amber'} bg-white focus:outline-none focus:ring-1 transition-all`}
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-error font-medium">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} className={errors.email ? "text-error" : "text-mutedText"} />
            </div>
            <input
              type="email"
              {...register('email')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-amber focus:ring-amber'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="store@example.com"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-error font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">City/Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin size={18} className={errors.city ? "text-error" : "text-mutedText"} />
            </div>
            <input
              type="text"
              {...register('city')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.city ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-amber focus:ring-amber'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="New Delhi, Delhi"
            />
          </div>
          {errors.city && <p className="mt-1.5 text-xs text-error font-medium">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className={errors.password ? "text-error" : "text-mutedText"} />
            </div>
            <input
              type="password"
              {...register('password')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-amber focus:ring-amber'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-error font-medium">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-amber py-3.5 flex items-center justify-center gap-2 group shadow-md mt-6"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Apply to Sell <Store size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-mutedText">
          Already a seller?{' '}
          <Link to="/seller/login" className="font-semibold text-amber-dark hover:text-forest transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegister;
