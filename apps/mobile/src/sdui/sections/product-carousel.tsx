import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ResolvedSection } from "@repo/validators";
import { useStore } from "../../store-context";
import { formatPrice } from "../../format";

type Props = Extract<ResolvedSection, { type: "product-carousel" }>;

export function ProductCarousel({ title, products }: Props) {
  const { currency } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const heroImage = item.images?.[0]?.url;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                {heroImage ? (
                  <Image source={{ uri: heroImage }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 24, opacity: 0.2 }}>📷</Text>
                  </View>
                )}
                {item.compareAtPriceInCents && (
                  <View style={styles.saleBadge}>
                    <Text style={styles.saleBadgeText}>Sale</Text>
                  </View>
                )}
              </View>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatPrice(item.priceInCents, currency)}</Text>
                {item.compareAtPriceInCents && (
                  <Text style={styles.comparePrice}>{formatPrice(item.compareAtPriceInCents, currency)}</Text>
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
  container: { paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#18181b", paddingHorizontal: 16, marginBottom: 12 },
  list: { paddingHorizontal: 12, gap: 10 },
  card: { width: 150, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  imageContainer: { width: 150, height: 150, backgroundColor: "#f4f4f5" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  saleBadge: { position: "absolute", top: 6, left: 6, backgroundColor: "#dc2626", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  saleBadgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  productName: { fontSize: 13, fontWeight: "500", color: "#18181b", paddingHorizontal: 8, paddingTop: 8 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingBottom: 10, paddingTop: 4 },
  price: { fontSize: 14, fontWeight: "600", color: "#18181b" },
  comparePrice: { fontSize: 12, color: "#a1a1aa", textDecorationLine: "line-through" },
});
