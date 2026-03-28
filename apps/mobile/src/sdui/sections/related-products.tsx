import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ResolvedSection } from "@repo/validators";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";
import { formatPrice } from "../../format";

// Shared component for related-by-category, related-by-tag, related-hand-picked
// They all have the same shape: { title?, products[] }

type RelatedProps =
  | Extract<ResolvedSection, { type: "related-by-category" }>
  | Extract<ResolvedSection, { type: "related-by-tag" }>
  | Extract<ResolvedSection, { type: "related-hand-picked" }>;

export function RelatedProducts({ title, products }: RelatedProps) {
  const { currency } = useStore();
  const { global, productCard } = useTheme();
  const cardRadius = productCard.borderRadius ?? global.borderRadius;

  if (products.length === 0) return null;

  return (
    <View style={[styles.container, { paddingVertical: global.sectionSpacing }]}>
      {title && (
        <Text style={[styles.title, { fontSize: global.headingSize - 4, color: global.textColor, paddingHorizontal: global.contentPadding }]}>
          {title}
        </Text>
      )}
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: global.contentPadding - 4, gap: 10 }}
        renderItem={({ item }) => {
          const heroImage = item.images?.[0]?.url;
          return (
            <TouchableOpacity
              style={[styles.card, { borderRadius: cardRadius, backgroundColor: global.surfaceColor }]}
              onPress={() => router.push(`/product/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.imageContainer, { borderTopLeftRadius: cardRadius, borderTopRightRadius: cardRadius }]}>
                {heroImage ? (
                  <Image source={{ uri: heroImage }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 24, opacity: 0.2 }}>📷</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.productName, { color: global.textColor }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.price, { color: global.textColor }]}>
                {formatPrice(item.priceInCents, currency)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: { fontWeight: "700", marginBottom: 12 },
  card: { width: 140, overflow: "hidden" },
  imageContainer: { width: 140, height: 140, backgroundColor: "#f4f4f5", overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  productName: { fontSize: 13, fontWeight: "500", paddingHorizontal: 8, paddingTop: 8 },
  price: { fontSize: 13, fontWeight: "600", paddingHorizontal: 8, paddingBottom: 10, paddingTop: 4 },
});
