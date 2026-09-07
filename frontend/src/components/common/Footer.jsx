import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, Send, Camera, BriefcaseBusiness, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { FOOTER_LINKS, SITE_TAGLINE, SITE_DESCRIPTION } from '../../constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest pt-16 pb-8 text-cream-dark overflow-hidden relative">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-4 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-forest border border-emerald/30 flex items-center justify-center text-white">
                <BookOpen size={22} />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Book<span className="text-emerald">Cycle</span>
              </span>
            </Link>
            <p className="text-lg font-serif font-medium text-amber mb-3">{SITE_TAGLINE}</p>
            <p className="text-sm text-cream-dark/80 mb-6 max-w-sm">
              {SITE_DESCRIPTION}
            </p>
            
            <div className="flex items-center gap-4">
              <a href="https://facebook.com/bookcycle" aria-label="BookCycle on Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="https://x.com/bookcycle" aria-label="BookCycle on X" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald hover:text-white transition-colors">
                <Send size={18} />
              </a>
              <a href="https://instagram.com/bookcycle" aria-label="BookCycle on Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald hover:text-white transition-colors">
                <Camera size={18} />
              </a>
              <a href="https://linkedin.com/company/bookcycle" aria-label="BookCycle on LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald hover:text-white transition-colors">
                <BriefcaseBusiness size={18} />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5 font-sans">Company</h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-emerald transition-colors hover:pl-1 duration-300 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5 font-sans">Support</h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-emerald transition-colors hover:pl-1 duration-300 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5 font-sans">Legal</h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-emerald transition-colors hover:pl-1 duration-300 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5 font-sans">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald shrink-0 mt-0.5" />
                <span className="text-sm text-cream-dark/80">123 Book Street, Reading District, New Delhi, 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald shrink-0" />
                <a href="tel:+919876543210" className="text-sm hover:text-emerald transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald shrink-0" />
                <a href="mailto:hello@bookcycle.in" className="text-sm hover:text-emerald transition-colors">hello@bookcycle.in</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-cream-dark/60">
            &copy; {currentYear} BookCycle. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-cream-dark/60">
            <span>Made with</span>
            <Heart size={14} className="text-error fill-error" />
            <span>for readers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
