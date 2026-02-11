import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { adminApi } from '../services/adminApi';
import type { AdminOrder } from '../types';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';

const STATUS_FILTERS = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        const params: Record<string, string> = {
          page: String(pageNum),
          limit: '20',
        };
        if (filterStatus !== 'ALL') params.status = filterStatus;

        const result = await adminApi.orders(params);
        if (append) {
          setOrders((prev) => [...prev, ...result.orders]);
        } else {
          setOrders(result.orders);
        }
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setPage(pageNum);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [filterStatus]
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchOrders(1);
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(1);
  };

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      setLoadingMore(true);
      fetchOrders(page + 1, true);
    }
  };

  const filtered = search
    ? orders.filter((o) => {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.items.some((i) => i.productName.toLowerCase().includes(q))
        );
      })
    : orders;

  const renderOrder = ({ item: order }: { item: AdminOrder }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { order })}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <View style={styles.orderBody}>
        <View style={styles.orderInfo}>
          <Ionicons name="person-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.orderCustomer}>{order.customer}</Text>
        </View>
        <View style={styles.orderInfo}>
          <Ionicons name="cube-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.orderItems}>
            {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>${order.total.toLocaleString()}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>{total} total order{total !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search orders..." />
      </View>

      {/* Status Filter Chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={STATUS_FILTERS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chips}
        style={styles.chipsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, filterStatus === item && styles.chipActive]}
            onPress={() => setFilterStatus(item)}
          >
            <Text style={[styles.chipText, filterStatus === item && styles.chipTextActive]}>
              {item === 'ALL' ? 'All' : item.charAt(0) + item.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Orders List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<EmptyState icon="receipt-outline" message="No orders found." />}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
          ) : null
        }
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
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chipsList: {
    flexGrow: 0,
  },
  chips: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textWhite,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  orderBody: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderCustomer: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderItems: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 10,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
