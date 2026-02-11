import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { adminApi } from '../services/adminApi';
import { productsApi } from '../services/productsApi';
import type { ApiProduct } from '../types';
import SearchBar from '../components/SearchBar';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';

export default function InventoryScreen({ navigation }: any) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const result = await productsApi.list({ limit: '200', sort: 'name-asc' });
      setProducts(result.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filtered = useMemo(() => {
    let result = products.filter(
      (p) =>
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
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return result;
  }, [products, search, sortField, sortDir]);

  const handleSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(id);
          try {
            await adminApi.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete product.');
          } finally {
            setDeleting(null);
          }
        },
      },
    ]);
  };

  const arrow = (field: string) =>
    sortField === field ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  const getStockStyle = (product: ApiProduct) => {
    if (!product.inStock || product.stockCount === 0) return colors.stock.out;
    if (product.stockCount <= 10) return colors.stock.low;
    return colors.stock.high;
  };

  const renderProduct = ({ item: product }: { item: ApiProduct }) => {
    const stockColor = getStockStyle(product);
    return (
      <View style={styles.productCard}>
        <View style={styles.productMain}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            defaultSource={require('../../assets/icon.png')}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.productSku}>{product.sku}</Text>
            <View style={styles.productMeta}>
              <Text style={styles.productCategory}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Text>
              <Text style={styles.productDot}>&middot;</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
            </View>
          </View>
        </View>
        <View style={styles.productBottom}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          <View style={[styles.stockBadge, { backgroundColor: stockColor.bg }]}>
            <Text style={[styles.stockText, { color: stockColor.text }]}>
              {product.inStock ? `${product.stockCount} units` : 'Out of Stock'}
            </Text>
          </View>
          <View style={styles.productActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('ProductForm', { product })}
            >
              <Ionicons name="pencil-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
            {deleting === product.id ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(product.id, product.name)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>{products.length} products total</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('ProductForm', {})}
          >
            <Ionicons name="add" size={20} color={colors.textWhite} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search products, brands, SKU..." />
      </View>

      {/* Sort Buttons */}
      <View style={styles.sortRow}>
        {(['name', 'price', 'category'] as const).map((field) => (
          <TouchableOpacity
            key={field}
            style={[styles.sortBtn, sortField === field && styles.sortBtnActive]}
            onPress={() => handleSort(field)}
          >
            <Text style={[styles.sortBtnText, sortField === field && styles.sortBtnTextActive]}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {arrow(field)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={<EmptyState icon="cube-outline" message="No products found." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  addBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  sortBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortBtnTextActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 14,
    marginBottom: 10,
  },
  productMain: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surfaceBorder,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  productSku: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productDot: {
    color: colors.textTertiary,
  },
  productBrand: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 10,
    gap: 10,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 6,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceBorder,
  },
});
