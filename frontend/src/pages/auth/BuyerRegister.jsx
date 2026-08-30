import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const BuyerRegister = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      const user = await authService.registerBuyer(registerData);
      login(user, 'buyer', user.token);
      toast.success('Account created successfully!');
      navigate('/buyer/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-serif font-bold text-forest mb-2">Create Account</h2>
        <p className="text-mutedText">Join BookCycle to buy affordable books</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className={errors.name ? "text-error" : "text-mutedText"} />
            </div>
            <input
              type="text"
              {...register('name')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-emerald focus:ring-emerald'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-error font-medium">{errors.name.message}</p>}
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
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-emerald focus:ring-emerald'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-error font-medium">{errors.email.message}</p>}
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
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-emerald focus:ring-emerald'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-error font-medium">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-darkText mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className={errors.confirmPassword ? "text-error" : "text-mutedText"} />
            </div>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-error focus:ring-error' : 'border-forest/10 focus:border-emerald focus:ring-emerald'} bg-white focus:outline-none focus:ring-1 transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-error font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 group shadow-md mt-6"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Create Account <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-mutedText">
          Already have an account?{' '}
          <Link to="/buyer/login" className="font-semibold text-forest hover:text-emerald transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BuyerRegister;
