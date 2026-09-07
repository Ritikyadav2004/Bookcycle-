import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { pageTransition } from '../../animations/variants';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message.');
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-paper-bg py-12 lg:py-20"
    >
      <div className="section-container max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-mutedText">
            Have questions about buying, selling, or our platform? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-forest/5">
              <h3 className="text-xl font-bold text-forest mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald/10 text-emerald rounded-full flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkText mb-1">Email Us</h4>
                    <a href="mailto:support@bookcycle.in" className="text-mutedText hover:text-emerald transition-colors">support@bookcycle.in</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber/10 text-amber-dark rounded-full flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkText mb-1">Call Us</h4>
                    <p className="text-mutedText">+91 1800 123 4567</p>
                    <p className="text-xs text-mutedText mt-1">Mon-Fri, 9am to 6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest/10 text-forest rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkText mb-1">Headquarters</h4>
                    <p className="text-mutedText leading-relaxed">
                      123 Education Hub, Sector 62,<br />
                      Noida, UP 201309<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-forest/5">
            <h3 className="text-2xl font-bold text-forest mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-darkText mb-2">Your Name</label>
                  <input 
                    type="text" 
                    {...register('name', { required: 'Name is required' })} 
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-error' : 'border-forest/20'} focus:border-emerald focus:ring-1 focus:ring-emerald outline-none bg-warmWhite focus:bg-white transition-colors`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-darkText mb-2">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })} 
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-error' : 'border-forest/20'} focus:border-emerald focus:ring-1 focus:ring-emerald outline-none bg-warmWhite focus:bg-white transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-darkText mb-2">Subject</label>
                <select 
                  {...register('subject', { required: 'Please select a subject' })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-error' : 'border-forest/20'} focus:border-emerald focus:ring-1 focus:ring-emerald outline-none bg-warmWhite focus:bg-white transition-colors appearance-none`}
                >
                  <option value="">Select a topic</option>
                  <option value="buy">Buying a Book</option>
                  <option value="sell">Selling on BookCycle</option>
                  <option value="order">Order Tracking/Issue</option>
                  <option value="other">Other Inquiry</option>
                </select>
                {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-darkText mb-2">Message</label>
                <textarea 
                  {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message too short' } })}
                  rows="5"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-error' : 'border-forest/20'} focus:border-emerald focus:ring-1 focus:ring-emerald outline-none bg-warmWhite focus:bg-white transition-colors resize-none`}
                  placeholder="How can we help you?"
                ></textarea>
                {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary py-3 px-8 flex items-center gap-2 shadow-md"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
