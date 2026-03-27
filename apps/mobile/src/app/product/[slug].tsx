import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";
import { fetchProduct } from "../../api";
import { formatPrice } from "../../format";

const { width } = Dimensions.get("window");

type Product = {
  id: string;
  name: string;
  description: string | null;
  images: { url: string; alt?: string }[];
  priceInCents: number;
  compareAtPriceInCents: number | null;
  category: { name: string } | null;
  variants: {
    id: string;
    optionName: string;
    optionValue: string;
    priceInCents: number | null;
  }[];
};

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { store, currency } = useStore();
  const { global: t } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!store || !slug) return;
    setLoading(true);
    fetchProduct(store.slug, slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [store?.slug, slug]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={t.primaryColor} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: t.primaryColor }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Group variants by optionName
  const variantGroups: Record<string, { id: string; value: string; price: number | null }[]> = {};
  product.variants.forEach((v) => {
    if (!variantGroups[v.optionName]) variantGroups[v.optionName] = [];
    variantGroups[v.optionName].push({ id: v.id, value: v.optionValue, price: v.priceInCents });
  });

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <ScrollView>
        {/* Image gallery */}
        {product.images.length > 0 ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const page = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveImage(page);
              }}
              scrollEventThrottle={16}
            >
              {product.images.map((img, i) => (
                <Image key={i} source={{ uri: img.url }} style={styles.heroImage} />
              ))}
            </ScrollView>
            {product.images.length > 1 && (
              <View style={styles.dots}>
                {product.images.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeImage && { backgroundColor: t.primaryColor, width: 20 },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 48, opacity: 0.15 }}>📷</Text>
          </View>
        )}

        <View style={styles.content}>
          {product.category && (
            <Text style={styles.category}>{product.category.name}</Text>
          )}

          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: t.primaryColor }]}>
              {formatPrice(product.priceInCents, currency)}
            </Text>
            {product.compareAtPriceInCents && (
              <Text style={styles.comparePrice}>
                {formatPrice(product.compareAtPriceInCents, currency)}
              </Text>
            )}
          </View>

          {/* Variants */}
          {Object.entries(variantGroups).map(([optionName, options]) => (
            <View key={optionName} style={styles.variantSection}>
              <Text style={styles.variantLabel}>{optionName}</Text>
              <View style={styles.variantOptions}>
                {options.map((opt) => {
                  const isSelected = selectedVariants[optionName] === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.variantChip,
                        isSelected && { borderColor: t.primaryColor, backgroundColor: t.primaryColor + "10" },
                      ]}
                      onPress={() =>
                        setSelectedVariants((prev) => ({ ...prev, [optionName]: opt.value }))
                      }
                    >
                      <Text
                        style={[
                          styles.variantChipText,
                          isSelected && { color: t.primaryColor, fontWeight: "600" },
                        ]}
                      >
                        {opt.value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  errorText: { fontSize: 16, color: "#71717a", marginBottom: 12 },
  backLink: { fontSize: 15, fontWeight: "600" },
  backButton: {
    position: "absolute",
    top: 54,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: { fontSize: 15, fontWeight: "600", color: "#18181b" },
  heroImage: { width, height: width },
  imagePlaceholder: {
    width,
    height: width * 0.7,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#d4d4d8" },
  content: { padding: 20 },
  category: {
    fontSize: 13,
    color: "#71717a",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: { fontSize: 24, fontWeight: "700", color: "#18181b", marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  price: { fontSize: 22, fontWeight: "700" },
  comparePrice: { fontSize: 16, color: "#a1a1aa", textDecorationLine: "line-through" },
  variantSection: { marginTop: 24 },
  variantLabel: { fontSize: 14, fontWeight: "600", color: "#18181b", marginBottom: 10 },
  variantOptions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  variantChip: {
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  variantChipText: { fontSize: 14, fontWeight: "500", color: "#52525b" },
  descriptionSection: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  descriptionLabel: { fontSize: 14, fontWeight: "600", color: "#18181b", marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 24, color: "#52525b" },
});
