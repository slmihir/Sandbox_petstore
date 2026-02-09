import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Check, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Shield, Loader2 } from 'lucide-react';
import { productsApi, reviewsApi, type ApiProduct, type ApiReview } from '@/utils/api';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setCurrentImage(0);

    productsApi.getById(id)
      .then(p => {
        setProduct(p);
        // Fetch related & reviews in parallel
        return Promise.all([
          productsApi.related(p.id).catch(() => []),
          reviewsApi.getByProduct(p.id).catch(() => []),
        ]);
      })
      .then(([rel, rev]) => {
        setRelated(rel);
        setReviews(rev);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">Sorry, we could not find that product.</p>
        <Link to="/products" className="text-indigo-600 font-medium hover:text-indigo-700">
          Browse All Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(i => (i === 0 ? product.images.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i === product.images.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {hasDiscount && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                Save {formatCurrency(product.originalPrice! - product.price)}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImage === i ? 'border-indigo-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>
            <button
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold text-indigo-600">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(product.originalPrice!)}</span>
            )}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Attributes */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Category</p>
              <p className="font-medium text-gray-900 mt-0.5 capitalize">{product.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">For</p>
              <p className="font-medium text-gray-900 mt-0.5 capitalize">{product.petType === 'all' ? 'All Pets' : `${product.petType}s`}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Weight</p>
              <p className="font-medium text-gray-900 mt-0.5">{product.weight}</p>
            </div>
            {product.dimensions && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Dimensions</p>
                <p className="font-medium text-gray-900 mt-0.5">{product.dimensions}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">SKU</p>
              <p className="font-medium text-gray-900 mt-0.5">{product.sku}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Availability</p>
              <p className={`font-medium mt-0.5 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Features</p>
              <ul className="space-y-1.5">
                {product.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks */}
          <div className="flex gap-4 mt-6">
            {[
              { icon: Truck, text: 'Free shipping over $49' },
              { icon: RotateCcw, text: '30-day returns' },
              { icon: Shield, text: 'Quality guaranteed' },
            ].map(perk => (
              <div key={perk.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                <perk.icon className="w-3.5 h-3.5 text-indigo-500" />
                {perk.text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={added || !product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : product.inStock
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <Link
              to="/cart"
              className="px-6 py-3.5 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {r.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{r.userName}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
