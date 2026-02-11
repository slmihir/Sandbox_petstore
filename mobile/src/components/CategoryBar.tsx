import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface CategoryBarProps {
  category: string;
  count: number;
  maxCount: number;
  color: string;
}

export default function CategoryBar({ category, count, maxCount, color }: CategoryBarProps) {
  const width = maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: width as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  count: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  track: {
    height: 10,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 999,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 999,
  },
});
