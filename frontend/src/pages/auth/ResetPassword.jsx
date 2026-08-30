import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string().min(8, 'Confirm your password'),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success('Password updated');
  };

  return (
    <div className="grid min-h-screen bg-gradient-cream lg:grid-cols-2">
      <div className="hidden items-center justify-center bg-gradient-hero p-12 text-white lg:flex">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <ShieldCheck className="mb-6 text-amber" size={52} />
          <h1 className="mb-4 text-5xl font-serif font-bold text-white">Secure your BookCycle account</h1>
          <p className="text-cream/80">Create a fresh password and return to your buyer or seller dashboard.</p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
            <LockKeyhole size={24} />
          </div>
          <h2 className="mb-2 text-3xl font-serif font-bold">Reset Password</h2>
          <p className="mb-8 text-mutedText">Enter and confirm your new password.</p>
          <label className="input-label" htmlFor="password">New password</label>
          <input id="password" type="password" {...register('password')} className={`input-field ${errors.password ? 'border-error' : ''}`} placeholder="Minimum 8 characters" />
          {errors.password && <p className="input-error mb-4">{errors.password.message}</p>}
          <label className="input-label" htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" {...register('confirm')} className={`input-field ${errors.confirm ? 'border-error' : ''}`} placeholder="Re-enter password" />
          {errors.confirm && <p className="input-error mb-4">{errors.confirm.message}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Updating...' : 'Update password'}</button>
          <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-emerald">Back to login</Link>
        </motion.form>
      </div>
    </div>
  );
};

export default ResetPassword;
