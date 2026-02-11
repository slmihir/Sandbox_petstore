export const colors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceBorder: '#F3F4F6',
  dark: '#111827',
  darkSecondary: '#1F2937',

  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primaryLight: '#E0E7FF',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textWhite: '#FFFFFF',

  status: {
    pending: { bg: '#FEF3C7', text: '#B45309' },
    processing: { bg: '#DBEAFE', text: '#1D4ED8' },
    shipped: { bg: '#F3E8FF', text: '#7C3AED' },
    delivered: { bg: '#D1FAE5', text: '#047857' },
    cancelled: { bg: '#FEE2E2', text: '#B91C1C' },
  } as Record<string, { bg: string; text: string }>,

  stock: {
    high: { bg: '#D1FAE5', text: '#047857' },
    low: { bg: '#FEF3C7', text: '#B45309' },
    out: { bg: '#FEE2E2', text: '#B91C1C' },
  },

  stat: {
    products: { bg: '#E0E7FF', icon: '#4F46E5' },
    orders: { bg: '#FEF3C7', icon: '#D97706' },
    revenue: { bg: '#D1FAE5', icon: '#059669' },
    users: { bg: '#F3E8FF', icon: '#7C3AED' },
  },

  barColors: ['#6366F1', '#8B5CF6', '#F59E0B', '#14B8A6', '#F43F5E', '#06B6D4'],

  error: '#DC2626',
  errorBg: '#FEE2E2',
  separator: '#E5E7EB',
  inputBorder: '#E5E7EB',
  inputFocusBorder: '#6366F1',
};
