import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { getIcon } from '../../utils/iconMaps';

const pickLinks = (links, labels) => labels
  .map((label) => links.find((link) => link.label === label))
  .filter(Boolean);

const MobileBottomNav = ({ links, variant = 'buyer' }) => {
  const labelsByVariant = {
    buyer: ['Dashboard', 'Browse Books', 'Cart', 'Wishlist', 'My Orders'],
    seller: ['Dashboard', 'Add New Book', 'My Listings', 'Orders Received', 'Sales'],
    admin: ['Dashboard', 'Buyers', 'Book Listings', 'Orders', 'Reports'],
  };

  const visibleLinks = pickLinks(links, labelsByVariant[variant] || labelsByVariant.buyer);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-forest/10 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(22,61,42,0.08)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {visibleLinks.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                'flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition',
                isActive ? 'bg-emerald/10 text-emerald' : 'text-mutedText hover:bg-forest/5 hover:text-forest'
              )}
            >
              <Icon size={19} />
              <span className="max-w-full truncate">{link.label.replace(' Books', '').replace(' Received', '')}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
