import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  if (isSent) {
    return (
      <div className="w-full text-center">
        <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-4">Check your email</h2>
        <p className="text-mutedText mb-8 max-w-sm mx-auto">
          We've sent password reset instructions to your email address.
        </p>
        <Link to="/login" className="btn-primary w-full inline-flex justify-center">
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-forest/5 text-forest mb-4">
          <KeyRound size={24} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-2">Forgot Password?</h2>
        <p className="text-mutedText">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 shadow-md"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link to="/login" className="font-semibold text-mutedText hover:text-forest transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
