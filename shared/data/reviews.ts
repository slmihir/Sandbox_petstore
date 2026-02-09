import type { Review } from '../types';

export const reviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'food-001',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 5,
    comment: 'My Golden Retriever absolutely loves this food! His coat is shinier than ever and he cleans his bowl every single time. Great quality ingredients and well worth the price.',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'rev-002',
    productId: 'food-001',
    userId: 'user-003',
    userName: 'John Doe',
    rating: 4,
    comment: 'Good quality dog food. My picky eater actually likes it. Only wish the bag had a resealable zipper. Would definitely repurchase.',
    createdAt: '2025-12-15T14:30:00Z',
  },
  {
    id: 'rev-003',
    productId: 'bed-001',
    userId: 'user-003',
    userName: 'John Doe',
    rating: 5,
    comment: 'Our senior Lab has been sleeping so much better on this bed. The memory foam is thick and supportive. The washable cover is a huge plus since he drools a lot.',
    createdAt: '2026-01-10T09:15:00Z',
  },
  {
    id: 'rev-004',
    productId: 'toy-002',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 5,
    comment: 'Best cat toy we have ever purchased! Our cat goes absolutely crazy for this feather wand. She gets so much exercise now. The extra refills are a nice touch.',
    createdAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'rev-005',
    productId: 'acc-001',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great harness! Our dog stopped pulling almost immediately. The front clip really works. Took a little while to adjust all the straps but now it fits perfectly.',
    createdAt: '2026-02-01T08:45:00Z',
  },
  {
    id: 'rev-006',
    productId: 'groom-001',
    userId: 'user-003',
    userName: 'John Doe',
    rating: 5,
    comment: 'This brush is incredible. The amount of fur it removes is unbelievable. Our house is so much cleaner now. My Husky actually seems to enjoy being brushed with it.',
    createdAt: '2026-02-05T16:20:00Z',
  },
  {
    id: 'rev-007',
    productId: 'health-001',
    userId: 'user-003',
    userName: 'John Doe',
    rating: 5,
    comment: 'Noticed a real improvement in our senior dog\'s mobility after just two weeks. He is back to going on longer walks. The chicken flavor means he thinks they are treats!',
    createdAt: '2026-02-03T13:00:00Z',
  },
  {
    id: 'rev-008',
    productId: 'toy-001',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Finally a toy our power chewer has not destroyed in a week! He has had this bone for over a month and it is still going strong. The bacon flavor keeps him busy for hours.',
    createdAt: '2026-02-07T10:30:00Z',
  },
];

export const getReviewsByProductId = (productId: string): Review[] =>
  reviews.filter(r => r.productId === productId);

export const getAverageRating = (productId: string): number => {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;
  return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
};
