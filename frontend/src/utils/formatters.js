// Utility formatters for BookCycle

/**
 * Format price in INR
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate discount percentage
 */
export const calcDiscount = (original, selling) => {
  if (!original || !selling || original <= selling) return 0;
  return Math.round(((original - selling) / original) * 100);
};

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

/**
 * Format large numbers
 */
export const formatNumber = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() || '0';
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Slugify text
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate order ID
 */
export const generateOrderId = () => {
  const prefix = 'BC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

/**
 * Condition label with color
 */
export const getConditionInfo = (condition) => {
  const conditions = {
    'like-new': { label: 'Like New', color: 'text-success', bg: 'bg-success/10' },
    'good': { label: 'Good', color: 'text-emerald', bg: 'bg-emerald/10' },
    'fair': { label: 'Fair', color: 'text-amber-dark', bg: 'bg-amber/10' },
    'acceptable': { label: 'Acceptable', color: 'text-mutedText', bg: 'bg-gray-100' },
  };
  return conditions[condition] || conditions['good'];
};
