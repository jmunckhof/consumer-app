import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useStore } from "../../store-context";
import { fetchCategories, fetchProducts, fetchHomePage } from "../../api";
import { formatPrice } from "../../format";
import { SDUIRenderer } from "../../sdui/renderer";
import type { ResolvedSection } from "@repo/validators";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  images: { url: string }[];
  priceInCents: number;
  compareAtPriceInCents: number | null;
};

export default function HomeScreen() {
  const { store, primaryColor, currency } = useStore();
  const [sduiSections, setSduiSections] = useState<ResolvedSection[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to load SDUI page first
  useEffect(() => {
    if (!store) return;
    fetchHomePage(store.slug)
      .then((page) => {
        if (page.sections.length > 0) {
          setSduiSections(page.sections);
          setLoading(false);
        }
      })
      .catch(() => {
        // No SDUI configured, fall through to legacy
      });
  }, [store?.slug]);

  useEffect(() => {
    if (!store || sduiSections) return;
    fetchCategories(store.slug).then(setCategories);
  }, [store?.slug, sduiSections]);

  useEffect(() => {
    if (!store) return;
    setLoading(true);
    fetchProducts(store.slug, selectedCategory ?? undefined)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [store?.slug, selectedCategory]);

  if (!store) return null;

  // Render SDUI if available
  if (sduiSections) {
    return (
      <View style={styles.container}>
        <SDUIRenderer
          sections={sduiSections}
          header={
            <View style={[styles.header, { backgroundColor: primaryColor }]}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeTagline}>Browse our collection</Text>
            </View>
          }
        />
      </View>
    );
  }

  // Legacy fallback — hardcoded UI
  const header = (
    <>
      {/* Store name header */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeTagline}>Browse our collection</Text>
      </View>

      {/* Category chips */}
      {categories.length > 0 && (
        <FlatList
          horizontal
          data={[{ id: null as any, name: "All" }, ...categories]}
          keyExtractor={(item) => item.id ?? "all"}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryContent}
          renderItem={({ item }) => {
            const isActive =
              selectedCategory === item.id ||
              (item.id === null && selectedCategory === null);
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  isActive && { backgroundColor: primaryColor },
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {header}
        <ActivityIndicator style={{ marginTop: 40 }} color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={header}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const heroImage = item.images?.[0]?.url;
          return (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push(`/product/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View style={styles.productImageContainer}>
                {heroImage ? (
                  <Image source={{ uri: heroImage }} style={styles.productImage} />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Text style={{ fontSize: 32, opacity: 0.2 }}>📷</Text>
                  </View>
                )}
                {item.compareAtPriceInCents && (
                  <View style={styles.saleBadge}>
                    <Text style={styles.saleBadgeText}>Sale</Text>
                  </View>
                )}
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>
                  {formatPrice(item.priceInCents, currency)}
                </Text>
                {item.compareAtPriceInCents && (
                  <Text style={styles.comparePrice}>
                    {formatPrice(item.compareAtPriceInCents, currency)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  storeName: { fontSize: 24, fontWeight: "700", color: "#fff" },
  storeTagline: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  categoryList: { flexGrow: 0, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f4f4f5" },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f4f4f5", marginRight: 8 },
  categoryChipText: { fontSize: 13, fontWeight: "500", color: "#52525b" },
  categoryChipTextActive: { color: "#fff" },
  productGrid: { paddingBottom: 20 },
  productRow: { gap: 12, paddingHorizontal: 12 },
  productCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 12 },
  productImageContainer: { aspectRatio: 1, backgroundColor: "#f4f4f5" },
  productImage: { width: "100%", height: "100%" },
  productImagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  saleBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "#dc2626", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  saleBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  productName: { fontSize: 14, fontWeight: "500", color: "#18181b", paddingHorizontal: 12, paddingTop: 10 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4 },
  productPrice: { fontSize: 15, fontWeight: "600", color: "#18181b" },
  comparePrice: { fontSize: 13, color: "#a1a1aa", textDecorationLine: "line-through" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { color: "#71717a", fontSize: 14 },
});
