import React from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^\+?\d{10,13}$/, 'Enter a valid phone number'),
  city: z.string().min(2, 'City is required'),
});

const BuyerProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '9999999999',
      city: user?.city || 'New Delhi',
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      updateProfile(response.user || response);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e.message || 'Failed to update profile');
    }
  };

  return (
    <div className="pb-12 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-forest mb-2">My Profile</h1>
      <p className="text-mutedText mb-8">Manage your personal information and preferences.</p>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-forest/5">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-forest/5">
          <div className="w-24 h-24 rounded-full bg-forest text-white flex items-center justify-center text-4xl font-serif font-bold shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkText">{user?.name}</h2>
            <p className="text-mutedText">{user?.email}</p>
            <button
              type="button"
              onClick={() => toast.success('Avatar uploader opened')}
              className="mt-2 text-sm font-semibold text-emerald hover:underline"
            >
              Change Avatar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-darkText mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText" />
                <input type="text" {...register('name')} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-error' : 'border-forest/10'} focus:border-emerald outline-none bg-warmWhite focus:bg-white transition-colors`} />
              </div>
              {errors.name && <p className="input-error">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-darkText mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText" />
                <input type="email" {...register('email')} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-error' : 'border-forest/10'} focus:border-emerald outline-none bg-warmWhite focus:bg-white transition-colors`} />
              </div>
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-darkText mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText" />
                <input type="tel" {...register('phone')} placeholder="+91" className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-error' : 'border-forest/10'} focus:border-emerald outline-none bg-warmWhite focus:bg-white transition-colors`} />
              </div>
              {errors.phone && <p className="input-error">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-darkText mb-2">Primary City</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText" />
                <input type="text" {...register('city')} placeholder="New Delhi" className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.city ? 'border-error' : 'border-forest/10'} focus:border-emerald outline-none bg-warmWhite focus:bg-white transition-colors`} />
              </div>
              {errors.city && <p className="input-error">{errors.city.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
              <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerProfile;
