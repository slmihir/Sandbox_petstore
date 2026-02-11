import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { adminApi } from '../services/adminApi';
import { productsApi } from '../services/productsApi';
import type { ApiProduct } from '../types';
import FormField from '../components/FormField';
import FormPicker from '../components/FormPicker';

const categoryOptions = [
  { label: 'Food', value: 'FOOD' },
  { label: 'Toys', value: 'TOYS' },
  { label: 'Beds', value: 'BEDS' },
  { label: 'Accessories', value: 'ACCESSORIES' },
  { label: 'Grooming', value: 'GROOMING' },
  { label: 'Health', value: 'HEALTH' },
];

const petTypeOptions = [
  { label: 'Dog', value: 'DOG' },
  { label: 'Cat', value: 'CAT' },
  { label: 'Bird', value: 'BIRD' },
  { label: 'Fish', value: 'FISH' },
  { label: 'Reptile', value: 'REPTILE' },
  { label: 'All Pets', value: 'ALL' },
];

function generateSku(brand: string, category: string): string {
  const b = brand.trim().substring(0, 3).toUpperCase() || 'PRD';
  const c = category.substring(0, 2).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${b}-${c}-${rand}`;
}

export default function ProductFormScreen({ route, navigation }: any) {
  const product: Partial<ApiProduct> | undefined = route.params?.product;
  const isNew = !product?.id;

  const [form, setForm] = useState({
    name: product?.name || '',
    category: (product?.category || 'food').toUpperCase(),
    petType: (product?.petType || 'dog').toUpperCase(),
    brand: product?.brand || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    image: product?.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    description: product?.description || '',
    featuresText: (product?.features || []).join('\n'),
    weight: product?.weight || '',
    dimensions: product?.dimensions || '',
    featured: product?.featured || false,
    stockCount: product?.stockCount?.toString() || '0',
    sku: product?.sku || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setError('');

    if (!form.name.trim()) { setError('Product name is required.'); return; }
    if (!form.brand.trim()) { setError('Brand is required.'); return; }
    if (!form.sku.trim()) { setError('SKU is required.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }
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
        images: [form.image.trim()],
        description: form.description.trim(),
        features: form.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
        weight: form.weight.trim(),
        featured: form.featured,
        stockCount: Number(form.stockCount) || 0,
        sku: form.sku.trim(),
      };
      if (form.originalPrice && Number(form.originalPrice) > 0) {
        data.originalPrice = Number(form.originalPrice);
      }
      if (form.dimensions?.trim()) {
        data.dimensions = form.dimensions.trim();
      }

      if (isNew) {
        await adminApi.createProduct(data);
      } else {
        await adminApi.updateProduct(product!.id!, data);
      }
      navigation.goBack();
    } catch (err: any) {
      let msg = err.message || 'Failed to save product.';
      if (msg === 'Validation failed.' && err.errors) {
        msg = err.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <FormField
          label="Product Name"
          required
          value={form.name}
          onChangeText={(v) => update('name', v)}
          placeholder="e.g. Premium Dog Food"
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormPicker
              label="Category"
              required
              options={categoryOptions}
              selectedValue={form.category}
              onValueChange={(v) => update('category', v)}
            />
          </View>
          <View style={styles.halfField}>
            <FormPicker
              label="Pet Type"
              required
              options={petTypeOptions}
              selectedValue={form.petType}
              onValueChange={(v) => update('petType', v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Brand"
              required
              value={form.brand}
              onChangeText={(v) => update('brand', v)}
              placeholder="e.g. NutriPaws"
            />
          </View>
          <View style={styles.halfField}>
            <View>
              <FormField
                label="SKU"
                required
                value={form.sku}
                onChangeText={(v) => update('sku', v)}
                placeholder="e.g. NP-DF-001"
              />
              {isNew && (
                <TouchableOpacity
                  style={styles.autoBtn}
                  onPress={() => update('sku', generateSku(form.brand, form.category))}
                >
                  <Text style={styles.autoBtnText}>Auto</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Price ($)"
              required
              value={form.price}
              onChangeText={(v) => update('price', v)}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Original Price ($)"
              value={form.originalPrice}
              onChangeText={(v) => update('originalPrice', v)}
              keyboardType="decimal-pad"
              placeholder="For discount display"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Weight"
              required
              value={form.weight}
              onChangeText={(v) => update('weight', v)}
              placeholder="e.g. 5 lbs"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Stock Count"
              value={form.stockCount}
              onChangeText={(v) => update('stockCount', v)}
              keyboardType="number-pad"
              placeholder="0"
            />
          </View>
        </View>

        <FormField
          label="Image URL"
          required
          value={form.image}
          onChangeText={(v) => update('image', v)}
          placeholder="https://images.unsplash.com/..."
          autoCapitalize="none"
        />
        {form.image ? (
          <Image
            source={{ uri: form.image }}
            style={styles.imagePreview}
            defaultSource={require('../../assets/icon.png')}
          />
        ) : null}

        <FormField
          label="Description"
          required
          value={form.description}
          onChangeText={(v) => update('description', v)}
          placeholder="Describe the product..."
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
        />

        <FormField
          label="Features (one per line)"
          value={form.featuresText}
          onChangeText={(v) => update('featuresText', v)}
          placeholder={"Feature 1\nFeature 2\nFeature 3"}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
        />

        <FormField
          label="Dimensions"
          value={form.dimensions}
          onChangeText={(v) => update('dimensions', v)}
          placeholder="e.g. 24 x 18 x 6 in"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Featured product</Text>
          <Switch
            value={form.featured}
            onValueChange={(v) => update('featured', v)}
            trackColor={{ false: colors.inputBorder, true: colors.primaryLight }}
            thumbColor={form.featured ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.saveBtnText}>{isNew ? 'Add Product' : 'Save Changes'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  autoBtn: {
    position: 'absolute',
    right: 8,
    top: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
  },
  autoBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: -8,
    backgroundColor: colors.surfaceBorder,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
