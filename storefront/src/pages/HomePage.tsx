import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Heart, Clock, Package, Percent, Star, ChevronRight } from 'lucide-react';
import { productsApi, testimonialsApi, type ApiProduct, type ApiTestimonial } from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
import { useState, useEffect } from 'react';

const categoryLinks = [
  { category: 'food', label: 'Food & Treats', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop' },
  { category: 'toys', label: 'Toys', image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=300&fit=crop' },
  { category: 'beds', label: 'Beds & Furniture', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop' },
  { category: 'accessories', label: 'Collars & Leashes', image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=300&fit=crop' },
  { category: 'grooming', label: 'Grooming', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop' },
  { category: 'health', label: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop' },
];

const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free standard shipping on orders over $49. Fast, reliable delivery to your doorstep.' },
  { icon: Shield, title: 'Quality Guaranteed', desc: 'Every product is vet-approved and backed by our 30-day satisfaction guarantee.' },
  { icon: Package, title: 'Easy Returns', desc: 'Not the right fit? Return any unopened item within 30 days for a full refund.' },
  { icon: Clock, title: '24/7 Support', desc: 'Our pet care experts are available around the clock to help with product questions.' },
];

const brandLogos = [
  { name: 'NutriPaws', letter: 'NP' },
  { name: 'ToughPup', letter: 'TP' },
  { name: 'SnugglePaws', letter: 'SP' },
  { name: 'VetPro', letter: 'VP' },
  { name: 'WalkRight', letter: 'WR' },
  { name: 'FurFree', letter: 'FF' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<ApiProduct[]>([]);
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    productsApi.featured().then(setFeatured).catch(console.error);
    testimonialsApi.list().then(setTestimonials).catch(console.error);
  }, []);

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-indigo-200 bg-white/10 backdrop-blur rounded-full border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Trusted by 50,000+ pet parents
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] text-balance">
                Everything Your{' '}
                <span className="relative">
                  <span className="text-amber-300">Pet</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none"><path d="M2 6c40-4 100-4 196 0" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" /></svg>
                </span>{' '}
                Needs to Thrive
              </h1>
              <p className="mt-6 text-lg text-indigo-100 max-w-lg leading-relaxed">
                Premium food, toys, beds, grooming supplies, and health products — all curated and approved by veterinarians. Because your pet deserves the very best.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:shadow-indigo-900/25"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  Our Story
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face'].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-indigo-700 object-cover" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-300">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-indigo-200 mt-0.5">4.9/5 from 2,400+ reviews</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=500&fit=crop"
                  alt="Happy dog with pet supplies"
                  className="rounded-3xl shadow-2xl shadow-indigo-900/30 w-full object-cover"
                />
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">2,000+</p>
                      <p className="text-xs text-gray-500">Products Available</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Free Shipping</p>
                      <p className="text-[10px] text-gray-500">Orders $49+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted Brands ─── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-6">Trusted Brands We Carry</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {brandLogos.map(b => (
              <div key={b.name} className="flex items-center gap-2 text-gray-400 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{b.letter}</div>
                <span className="text-sm font-semibold tracking-tight">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Browse by Category ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-gray-500">Browse our full collection</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryLinks.map(c => (
            <Link
              key={c.category}
              to={`/products?category=${c.category}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100"
            >
              <img
                src={c.image}
                alt={c.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-bold text-white text-sm">{c.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="bg-gray-50/80 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Handpicked</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-500">Top picks by our pet care experts</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-indigo-600 font-semibold"
            >
              View All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Shop With Us ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Why Pet Parents Love Us</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">We go above and beyond to make shopping for your pet easy, safe, and affordable</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map(perk => (
            <div key={perk.title} className="text-center group">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <perk.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{perk.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Promo Banner ─── */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-emerald-100 text-sm font-medium mb-4">
                <Percent className="w-4 h-4" /> Limited Time Offer
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Save 20% on Everything</h2>
              <p className="text-lg text-emerald-100 max-w-lg">
                Use code <span className="font-bold bg-white/20 px-2.5 py-1 rounded-lg">SAVE20</span> at checkout. Stock up on your pet's favorites today!
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20 shrink-0"
            >
              Shop the Sale <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">What Pet Parents Say</h2>
            <p className="mt-3 text-gray-500">Real reviews from real customers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <StarRating rating={t.rating} size={14} />
                <p className="mt-4 text-sm text-gray-600 leading-relaxed flex-1">"{t.comment}"</p>
                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">Purchased {t.productType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Newsletter ─── */}
      <section className="bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Stay in the Loop</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Get exclusive deals, new product announcements, and pet care tips delivered to your inbox.</p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-100 text-green-700 font-semibold rounded-xl">
              <Heart className="w-5 h-5" /> Thanks for subscribing! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
              className="max-w-md mx-auto flex gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 text-sm"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
