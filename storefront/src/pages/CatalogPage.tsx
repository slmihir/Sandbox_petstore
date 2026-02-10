import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { productsApi, type ApiProduct } from '@/utils/api';
import ProductCard from '@/components/ProductCard';

const ITEMS_PER_PAGE = 9;

const categoryOptions = [
  { value: 'food', label: 'Food' },
  { value: 'toys', label: 'Toys' },
  { value: 'beds', label: 'Beds' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'health', label: 'Health' },
];

const petTypeOptions = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'bird', label: 'Birds' },
  { value: 'fish', label: 'Fish' },
  { value: 'reptile', label: 'Reptiles' },
  { value: 'all', label: 'All Pets' },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [petType, setPetType] = useState(searchParams.get('petType') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [loading, setLoading] = useState(true);

  // Fetch brands and price range on mount
  useEffect(() => {
    productsApi.brands().then(setAllBrands).catch(console.error);
    productsApi.priceRange().then(range => {
      setPriceRange(range);
      setMaxPrice(range.max);
    }).catch(console.error);
  }, []);

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        sort,
      };
      if (search) params.search = search;
      if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
      if (petType) params.petType = petType;
      if (brand) params.brand = brand;
      if (minPrice > 0) params.minPrice = String(minPrice);
      if (maxPrice < priceRange.max) params.maxPrice = String(maxPrice);

      const result = await productsApi.list(params);
      setProducts(result.products);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, petType, brand, sort, minPrice, maxPrice, page, priceRange.max]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (c: string) => {
    const updated = selectedCategories.includes(c)
      ? selectedCategories.filter(x => x !== c)
      : [...selectedCategories, c];
    setSelectedCategories(updated);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (updated.length) params.set('category', updated.join(','));
    else params.delete('category');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPetType('');
    setBrand('');
    setMinPrice(0);
    setMaxPrice(priceRange.max);
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || petType || brand || minPrice > 0 || maxPrice < priceRange.max;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop Pet Products</h1>
        <p className="mt-2 text-gray-500">
          {total} product{total !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products, brands..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            aria-label="Search products"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          aria-label="Sort products"
        >
          <option value="newest">Newest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 bg-indigo-600 rounded-full" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 shrink-0 space-y-6`}
        >
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map(c => (
                  <button
                    key={c.value}
                    onClick={() => toggleCategory(c.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      selectedCategories.includes(c.value)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Type */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Pet Type</h4>
              <select
                value={petType}
                onChange={e => { setPetType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter by pet type"
              >
                <option value="">All Pet Types</option>
                {petTypeOptions.map(pt => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Brand</h4>
              <select
                value={brand}
                onChange={e => { setBrand(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter by brand"
              >
                <option value="">All Brands</option>
                {allBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={e => { setMinPrice(Number(e.target.value)); setPage(1); }}
                  placeholder="Min"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Minimum price"
                />
                <span className="text-gray-300 self-center">-</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                  placeholder="Max"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-indigo-600 font-medium hover:text-indigo-700">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
