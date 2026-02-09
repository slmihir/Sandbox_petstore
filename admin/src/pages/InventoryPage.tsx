import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Loader2, RefreshCw } from 'lucide-react';
import { adminApi, productsApi, type ApiProduct } from '@/utils/api';

const categoryOptions = ['FOOD', 'TOYS', 'BEDS', 'ACCESSORIES', 'GROOMING', 'HEALTH'];
const petTypeOptions = ['DOG', 'CAT', 'BIRD', 'FISH', 'REPTILE', 'ALL'];

export default function InventoryPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editingProduct, setEditingProduct] = useState<Partial<ApiProduct> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productsApi.list({ limit: '200', sort: 'name-asc' });
      setProducts(result.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [products, search, sortField, sortDir]);

  const handleSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const handleSave = async (formData: Record<string, any>, isNew: boolean) => {
    try {
      if (isNew) {
        await adminApi.createProduct(formData);
      } else {
        const { id, ...updateData } = formData;
        await adminApi.updateProduct(id, updateData);
      }
      // Refetch to get updated data
      await fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      throw err; // Let the modal handle the error
    }
  };

  const openAdd = () => {
    setEditingProduct({
      name: '',
      category: 'food',
      petType: 'dog',
      brand: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      images: [],
      description: '',
      features: [],
      weight: '',
      featured: false,
      inStock: true,
      stockCount: 0,
      sku: '',
    });
    setShowModal(true);
  };

  const openEdit = (product: ApiProduct) => {
    setEditingProduct({ ...product });
    setShowModal(true);
  };

  const arrow = (field: string) =>
    sortField === field ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            aria-label="Refresh products"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products, brands, SKU..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search inventory"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-900" onClick={() => handleSort('name')}>
                    Product{arrow('name')}
                  </th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-900" onClick={() => handleSort('category')}>
                    Category{arrow('category')}
                  </th>
                  <th className="px-6 py-3 font-medium">Brand</th>
                  <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-900" onClick={() => handleSort('price')}>
                    Price{arrow('price')}
                  </th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 capitalize">{product.category}</td>
                    <td className="px-6 py-3 text-gray-600">{product.brand}</td>
                    <td className="px-6 py-3 font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.inStock && product.stockCount > 10
                          ? 'bg-green-100 text-green-700'
                          : product.inStock && product.stockCount > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? `${product.stockCount} units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors" aria-label={`Edit ${product.name}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleting === product.id}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                              aria-label="Confirm delete"
                            >
                              {deleting === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100" aria-label="Cancel delete">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" aria-label={`Delete ${product.name}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && editingProduct && (
        <ProductModal
          product={editingProduct}
          isNew={!editingProduct.id}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

/** Generate a simple SKU from brand + category + random suffix */
function generateSku(brand: string, category: string): string {
  const b = brand.trim().substring(0, 3).toUpperCase() || 'PRD';
  const c = category.substring(0, 2).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${b}-${c}-${rand}`;
}

function ProductModal({
  product,
  isNew,
  onSave,
  onClose,
}: {
  product: Partial<ApiProduct>;
  isNew: boolean;
  onSave: (data: Record<string, any>, isNew: boolean) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    id: product.id || '',
    name: product.name || '',
    category: (product.category || 'food').toUpperCase(),
    petType: (product.petType || 'dog').toUpperCase(),
    brand: product.brand || '',
    price: product.price || 0,
    originalPrice: product.originalPrice || undefined,
    image: product.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    images: product.images || [],
    description: product.description || '',
    features: product.features || [],
    weight: product.weight || '',
    dimensions: product.dimensions || '',
    featured: product.featured || false,
    stockCount: product.stockCount || 0,
    sku: product.sku || '',
  });
  const [featuresText, setFeaturesText] = useState((product.features || []).join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate SKU for new products when brand or category changes
  const handleAutoSku = () => {
    if (isNew && !form.sku) {
      setForm(f => ({ ...f, sku: generateSku(f.brand, f.category) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!form.name.trim()) { setError('Product name is required.'); return; }
    if (!form.brand.trim()) { setError('Brand is required.'); return; }
    if (!form.sku.trim()) { setError('SKU is required.'); return; }
    if (form.price <= 0) { setError('Price must be greater than 0.'); return; }
    if (!form.image.trim()) { setError('Image URL is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.weight.trim()) { setError('Weight is required.'); return; }

    setSaving(true);
    try {
      const data: Record<string, any> = {
        name: form.name.trim(),
        category: form.category,
        petType: form.petType,
        brand: form.brand.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        images: form.images.length > 0 ? form.images : [form.image.trim()],
        description: form.description.trim(),
        features: featuresText.split('\n').map(f => f.trim()).filter(Boolean),
        weight: form.weight.trim(),
        featured: form.featured,
        stockCount: Number(form.stockCount),
        sku: form.sku.trim(),
      };
      if (form.originalPrice && Number(form.originalPrice) > 0) {
        data.originalPrice = Number(form.originalPrice);
      }
      if (form.dimensions && form.dimensions.trim()) {
        data.dimensions = form.dimensions.trim();
      }
      if (!isNew) data.id = form.id;

      await onSave(data, isNew);
    } catch (err: any) {
      // Parse Zod validation error messages from backend
      let msg = err.message || 'Failed to save product.';
      if (msg === 'Validation failed.' && err.errors) {
        msg = err.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{isNew ? 'Add New Product' : `Edit ${product.name}`}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Premium Dog Food" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-400">*</span></label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white">
                {categoryOptions.map(c => (
                  <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type <span className="text-red-400">*</span></label>
              <select value={form.petType} onChange={e => setForm({ ...form, petType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white">
                {petTypeOptions.map(p => (
                  <option key={p} value={p}>{p === 'ALL' ? 'All Pets' : p.charAt(0) + p.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand <span className="text-red-400">*</span></label>
              <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} onBlur={handleAutoSku} placeholder="e.g. NutriPaws" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-400">*</span></label>
              <div className="flex gap-1.5">
                <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. NP-DF-001" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                {isNew && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, sku: generateSku(f.brand, f.category) }))} className="px-2.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-500 hover:bg-gray-50 whitespace-nowrap" title="Auto-generate SKU">
                    Auto
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-400">*</span></label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input type="number" min={0} step={0.01} value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="For discount display" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight <span className="text-red-400">*</span></label>
              <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 5 lbs" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
              <input type="number" min={0} value={form.stockCount} onChange={e => setForm({ ...form, stockCount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-red-400">*</span></label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover border border-gray-200" onError={e => (e.currentTarget.style.display = 'none')} onLoad={e => (e.currentTarget.style.display = 'block')} />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-400">*</span></label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea rows={3} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Featured product
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : isNew ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
