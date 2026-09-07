// GSAP animation utilities for BookCycle
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/helpers';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize scroll-triggered text reveal
 */
export const initTextReveal = (selector, options = {}) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
        ...options,
      }
    );
  });
};

/**
 * Initialize parallax effect on elements
 */
export const initParallax = (selector, speed = 0.3) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    gsap.to(el, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
};

/**
 * Initialize staggered card entrance
 */
export const initStaggerCards = (containerSelector, cardSelector, options = {}) => {
  if (prefersReducedMotion()) return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(cardSelector);
  gsap.fromTo(cards,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      ...options,
    }
  );
};

/**
 * Initialize animated counter
 */
export const initCounter = (element, endValue, options = {}) => {
  if (prefersReducedMotion()) {
    if (element) element.textContent = endValue.toLocaleString('en-IN');
    return;
  }

  const obj = { value: 0 };
  gsap.to(obj, {
    value: endValue,
    duration: options.duration || 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      if (element) {
        element.textContent = Math.floor(obj.value).toLocaleString('en-IN');
      }
    },
    ...options,
  });
};

/**
 * Initialize progress bar animation
 */
export const initProgressBar = (element, targetWidth) => {
  if (prefersReducedMotion()) {
    if (element) element.style.width = `${targetWidth}%`;
    return;
  }

  gsap.fromTo(element,
    { width: '0%' },
    {
      width: `${targetWidth}%`,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  );
};

/**
 * Horizontal scroll section
 */
export const initHorizontalScroll = (containerSelector, innerSelector) => {
  if (prefersReducedMotion()) return;

  const container = document.querySelector(containerSelector);
  const inner = document.querySelector(innerSelector);
  if (!container || !inner) return;

  const scrollWidth = inner.scrollWidth - container.clientWidth;

  gsap.to(inner, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    },
  });
};

/**
 * Kill all ScrollTrigger instances (cleanup)
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Refresh ScrollTrigger (call after DOM changes)
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };
