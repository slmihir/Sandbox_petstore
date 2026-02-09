import type { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    comment: 'PawParadise has the best selection of premium pet food I have found online. The prices are fair, shipping is fast, and my dog absolutely loves the NutriPaws chicken formula!',
    rating: 5,
    productType: 'Dog Food',
  },
  {
    id: 'test-002',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    comment: 'The orthopedic dog bed from SnugglePaws changed our senior pup\'s life. He sleeps through the night now and his joints seem so much better. Five stars, no question.',
    rating: 5,
    productType: 'Dog Beds',
  },
  {
    id: 'test-003',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    comment: 'I order all my cat supplies from PawParadise. The interactive toys keep my two cats entertained for hours, and the grain-free food has really helped with their digestion.',
    rating: 5,
    productType: 'Cat Supplies',
  },
  {
    id: 'test-004',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    comment: 'Great customer service and the grooming tools are professional quality. The deshedding brush is a game changer. Our house has never been this fur-free!',
    rating: 4,
    productType: 'Grooming',
  },
];
