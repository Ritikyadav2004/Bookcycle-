import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, LogIn, ArrowRight, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SellerLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/seller/dashboard';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await authService.loginSeller(data);
      login(user, 'seller', user.token);
      toast.success('Welcome back to Seller Central!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber/20 text-amber-dark mb-4">
          <Store size={24} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-2">Seller Central</h2>
        <p className="text-mutedText">Manage your listings and track sales.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">Seller Email</label>
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-darkText">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-amber-dark hover:text-forest transition-colors">
              Forgot password?
            </Link>
          </div>
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
          className="w-full btn-amber py-3.5 flex items-center justify-center gap-2 group shadow-md"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Access Dashboard <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-mutedText">
          Want to sell books?{' '}
          <Link to="/seller/register" className="font-semibold text-amber-dark hover:text-forest transition-colors inline-flex items-center gap-1">
            Apply now <ArrowRight size={14} />
          </Link>
        </p>
      </div>
      
      <div className="mt-12 pt-8 border-t border-forest/10">
        <Link to="/buyer/login" className="w-full btn-ghost border border-forest/20 flex justify-center">
          Switch to Buyer Login
        </Link>
      </div>
    </div>
  );
};

export default SellerLogin;
