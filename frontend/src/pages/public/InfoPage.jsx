import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, Recycle, ShieldCheck, Truck } from 'lucide-react';
import FAQ from '../../components/home/FAQ';
import { HOW_IT_WORKS_STEPS } from '../../constants';

const pageContent = {
  '/how-it-works': {
    eyebrow: 'Simple reuse journey',
    title: 'How BookCycle Works',
    description: 'Find affordable books, place a clear order, receive them safely, and list them again when you are done.',
    icon: Recycle,
    points: HOW_IT_WORKS_STEPS.map((step) => `${step.title}: ${step.description}`),
  },
  '/privacy-policy': {
    eyebrow: 'Privacy first',
    title: 'Privacy Policy',
    description: 'BookCycle is structured to collect only the account, order, listing, and support information needed for a trusted marketplace.',
    icon: ShieldCheck,
    points: ['Profile and address data is shown only where needed for orders.', 'Seller verification details are prepared for protected admin review.', 'Notification preferences can be changed from the buyer or seller profile.'],
  },
  '/privacy': {
    eyebrow: 'Privacy first',
    title: 'Privacy Policy',
    description: 'BookCycle is structured to collect only the account, order, listing, and support information needed for a trusted marketplace.',
    icon: ShieldCheck,
    points: ['Profile and address data is shown only where needed for orders.', 'Seller verification details are prepared for protected admin review.', 'Notification preferences can be changed from the buyer or seller profile.'],
  },
  '/terms': {
    eyebrow: 'Marketplace rules',
    title: 'Terms and Conditions',
    description: 'These frontend terms explain expected buyer, seller, and admin responsibilities for a safe second-hand book portal.',
    icon: BookOpen,
    points: ['Listings must describe condition honestly.', 'Orders can move through pending, confirmed, packed, shipped, delivered, or cancelled states.', 'Admin moderation can remove unsafe or inaccurate listings.'],
  },
  '/shipping-policy': {
    eyebrow: 'Delivery choices',
    title: 'Shipping Policy',
    description: 'The checkout UI supports standard delivery, express delivery, and self pickup so backend delivery partners can be integrated later.',
    icon: Truck,
    points: ['Standard delivery is shown as 5-7 days.', 'Express delivery is shown as 2-3 days.', 'Self pickup can be coordinated with the seller.'],
  },
  '/shipping': {
    eyebrow: 'Delivery choices',
    title: 'Shipping Policy',
    description: 'The checkout UI supports standard delivery, express delivery, and self pickup so backend delivery partners can be integrated later.',
    icon: Truck,
    points: ['Standard delivery is shown as 5-7 days.', 'Express delivery is shown as 2-3 days.', 'Self pickup can be coordinated with the seller.'],
  },
  '/refund-policy': {
    eyebrow: 'Buyer confidence',
    title: 'Refund Policy',
    description: 'Refund and cancellation screens are prepared for damaged, unavailable, or incorrectly described books.',
    icon: CheckCircle2,
    points: ['Buyers can contact support from order cards.', 'Cancelled orders keep a visible status trail.', 'Admins can review reports and transaction details.'],
  },
  '/refund': {
    eyebrow: 'Buyer confidence',
    title: 'Refund Policy',
    description: 'Refund and cancellation screens are prepared for damaged, unavailable, or incorrectly described books.',
    icon: CheckCircle2,
    points: ['Buyers can contact support from order cards.', 'Cancelled orders keep a visible status trail.', 'Admins can review reports and transaction details.'],
  },
  '/seller-guidelines': {
    eyebrow: 'Seller quality',
    title: 'Seller Guidelines',
    description: 'Sellers get a structured listing flow covering book details, condition, pricing, images, delivery, and review before submission.',
    icon: BookOpen,
    points: ['Upload clear images from multiple angles.', 'Mention marks, torn pages, or missing inserts.', 'Set a fair second-hand price and keep stock updated.'],
  },
};

const InfoPage = () => {
  const { pathname } = useLocation();
  const content = pageContent[pathname] || pageContent['/how-it-works'];
  const Icon = content.icon;

  if (pathname === '/faq') {
    return <FAQ />;
  }

  return (
    <section className="bg-paper-bg py-20 md:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-emerald">
              <Icon size={16} />
              <span>{content.eyebrow}</span>
            </div>
            <h1 className="section-heading mb-5">{content.title}</h1>
            <p className="section-subheading mb-8">{content.description}</p>
            <Link to="/browse" className="btn-primary">
              Browse books
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4">
            {content.points.map((point, index) => (
              <motion.article
                key={point}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="card p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                    {index + 1}
                  </div>
                  <p className="text-mutedText">{point}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoPage;
