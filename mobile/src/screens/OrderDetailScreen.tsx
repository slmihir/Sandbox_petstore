import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { adminApi } from '../services/adminApi';
import type { AdminOrder } from '../types';
import StatusBadge from '../components/StatusBadge';

export default function OrderDetailScreen({ route, navigation }: any) {
  const [order, setOrder] = useState<AdminOrder>(route.params.order);
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const result = await adminApi.updateOrderStatus(order.id, newStatus);
      setOrder((prev) => ({ ...prev, status: result.status }));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const confirmUpdate = (status: string, label: string) => {
    Alert.alert(
      'Update Order',
      `Are you sure you want to mark this order as "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: label, onPress: () => updateStatus(status) },
      ]
    );
  };

  const status = order.status.toLowerCase();
  const addr = order.shippingAddress;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Order Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderId}>{order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
      </View>

      {/* Customer */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={colors.textTertiary} />
          <Text style={styles.infoText}>{order.customer}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color={colors.textTertiary} />
          <Text style={styles.infoText}>{order.email}</Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Items ({order.itemCount})
        </Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${order.total.toLocaleString()}</Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {addr ? (
          <View>
            <Text style={styles.addressText}>
              {addr.firstName} {addr.lastName}
            </Text>
            <Text style={styles.addressText}>{addr.address}</Text>
            <Text style={styles.addressText}>
              {addr.city}, {addr.state} {addr.zipCode}
            </Text>
            <Text style={styles.addressText}>{addr.phone}</Text>
          </View>
        ) : (
          <Text style={styles.noData}>No address data</Text>
        )}
      </View>

      {/* Status Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        {updating ? (
          <ActivityIndicator color={colors.primary} style={{ paddingVertical: 16 }} />
        ) : (
          <View style={styles.actions}>
            {status === 'pending' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#DBEAFE' }]}
                  onPress={() => confirmUpdate('PROCESSING', 'Confirm')}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#1D4ED8" />
                  <Text style={[styles.actionText, { color: '#1D4ED8' }]}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.errorBg }]}
                  onPress={() => confirmUpdate('CANCELLED', 'Cancel')}
                >
                  <Ionicons name="close-circle-outline" size={18} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            {status === 'processing' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#F3E8FF' }]}
                  onPress={() => confirmUpdate('SHIPPED', 'Ship')}
                >
                  <Ionicons name="airplane-outline" size={18} color="#7C3AED" />
                  <Text style={[styles.actionText, { color: '#7C3AED' }]}>Ship Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.errorBg }]}
                  onPress={() => confirmUpdate('CANCELLED', 'Cancel')}
                >
                  <Ionicons name="close-circle-outline" size={18} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            {status === 'shipped' && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#D1FAE5' }]}
                onPress={() => confirmUpdate('DELIVERED', 'Mark Delivered')}
              >
                <Ionicons name="checkmark-done-outline" size={18} color="#047857" />
                <Text style={[styles.actionText, { color: '#047857' }]}>Mark Delivered</Text>
              </TouchableOpacity>
            )}
            {(status === 'delivered' || status === 'cancelled') && (
              <Text style={styles.noActions}>
                {status === 'delivered'
                  ? 'This order has been delivered.'
                  : 'This order has been cancelled.'}
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  itemQty: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noData: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minWidth: 120,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noActions: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
