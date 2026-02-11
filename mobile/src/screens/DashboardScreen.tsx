import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { adminApi } from '../services/adminApi';
import { productsApi } from '../services/productsApi';
import type { DashboardResponse } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import CategoryBar from '../components/CategoryBar';
import LoadingScreen from '../components/LoadingScreen';
import ErrorState from '../components/ErrorState';
import { useRefresh } from '../hooks/useRefresh';

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setError('');
      const [dashboardData, productList] = await Promise.all([
        adminApi.dashboard(),
        productsApi.list({ limit: '200' }),
      ]);
      setData(dashboardData);

      const catCount: Record<string, number> = {};
      productList.products.forEach((p) => {
        catCount[p.category] = (catCount[p.category] || 0) + 1;
      });
      const entries = Object.entries(catCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
      setCategories(entries);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const [refreshing, onRefresh] = useRefresh(fetchDashboard);

  if (loading) return <LoadingScreen />;
  if (error || !data) {
    return <ErrorState message={error || 'Failed to load dashboard.'} onRetry={fetchDashboard} />;
  }

  const { stats, recentOrders } = data;
  const maxCount = Math.max(...categories.map((e) => e.count), 1);
  const pendingOrders = recentOrders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back! Here is an overview of your store.</Text>

      {/* Stat Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            icon="cube-outline"
            value={stats.totalProducts.toString()}
            label="Total Products"
            subtitle="In inventory"
            iconBg={colors.stat.products.bg}
            iconColor={colors.stat.products.icon}
          />
          <StatCard
            icon="cart-outline"
            value={stats.totalOrders.toString()}
            label="Total Orders"
            subtitle={`${pendingOrders} pending`}
            iconBg={colors.stat.orders.bg}
            iconColor={colors.stat.orders.icon}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="cash-outline"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            label="Revenue"
            subtitle="All time"
            iconBg={colors.stat.revenue.bg}
            iconColor={colors.stat.revenue.icon}
          />
          <StatCard
            icon="people-outline"
            value={stats.totalUsers.toString()}
            label="Total Users"
            subtitle="Registered users"
            iconBg={colors.stat.users.bg}
            iconColor={colors.stat.users.icon}
          />
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {recentOrders.length === 0 ? (
          <Text style={styles.empty}>No orders yet.</Text>
        ) : (
          recentOrders.map((order) => (
            <View key={order.id} style={styles.orderRow}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderMeta}>
                  {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} &middot; {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>${order.total.toLocaleString()}</Text>
                <StatusBadge status={order.status} />
              </View>
            </View>
          ))
        )}
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products by Category</Text>
        {categories.length === 0 ? (
          <Text style={styles.empty}>No product data available.</Text>
        ) : (
          categories.map(({ category, count }, i) => (
            <CategoryBar
              key={category}
              category={category}
              count={count}
              maxCount={maxCount}
              color={colors.barColors[i % colors.barColors.length]}
            />
          ))
        )}
        <View style={styles.categoryFooter}>
          <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.categoryFooterText}>
            {stats.totalProducts} total products in inventory
          </Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  orderLeft: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  orderMeta: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  categoryFooterText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
