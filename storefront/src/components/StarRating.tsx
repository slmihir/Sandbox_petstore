import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({ rating, max = 5, size = 16, showValue = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`shrink-0 ${
            i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
          }`}
          style={{ width: size, height: size }}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
