import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/authService';

const schema = z.object({
  email: z.string().email('Enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@bookcycle.com', password: 'adminpassword123' },
  });

  const onSubmit = async (data) => {
    try {
      const user = await authService.loginAdmin(data);
      login(user);
      toast.success('Admin signed in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Admin login failed');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest/5 text-forest">
          <ShieldCheck size={24} />
        </div>
        <h2 className="mb-2 text-3xl font-serif font-bold text-forest">Admin Login</h2>
        <p className="text-mutedText">Protected panel access for approvals, reports, users, and transactions.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="input-label" htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" className="input-field" {...register('email')} />
          {errors.email && <p className="input-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="input-label" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" className="input-field" {...register('password')} />
          {errors.password && <p className="input-error">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Enter Admin Panel'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
