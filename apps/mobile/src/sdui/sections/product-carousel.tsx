import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ResolvedSection } from "@repo/validators";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";
import { formatPrice } from "../../format";

type Props = Extract<ResolvedSection, { type: "product-carousel" }>;

export function ProductCarousel({ title, products }: Props) {
  const { currency } = useStore();
  const { global, productCard, sectionHeader } = useTheme();
  const cardRadius = productCard.borderRadius ?? global.borderRadius;

  return (
    <View style={[styles.container, { paddingVertical: global.sectionSpacing }]}>
      <View style={[styles.header, { paddingHorizontal: global.contentPadding }]}>
        <Text style={[styles.title, { fontSize: sectionHeader.fontSize, color: global.textColor }]}>
          {title}
        </Text>
        {sectionHeader.showViewAll && (
          <Text style={[styles.viewAll, { color: global.accentColor }]}>
            {sectionHeader.viewAllLabel}
          </Text>
        )}
      </View>
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
              style={[
                styles.card,
                {
                  borderRadius: cardRadius,
                  backgroundColor: global.surfaceColor,
                },
                productCard.shadow && styles.shadow,
              ]}
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
                {productCard.showBadge && item.compareAtPriceInCents && (
                  <View style={[styles.saleBadge, { backgroundColor: global.errorColor }]}>
                    <Text style={[styles.saleBadgeText, { color: global.textOnPrimary }]}>Sale</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.productName, { color: global.textColor, fontSize: global.bodySize - 2 }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: global.textColor, fontSize: global.bodySize - 1 }]}>
                  {formatPrice(item.priceInCents, currency)}
                </Text>
                {item.compareAtPriceInCents && (
                  <Text style={[styles.comparePrice, { color: global.textSecondaryColor, fontSize: global.captionSize }]}>
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
  container: {},
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontWeight: "700" },
  viewAll: { fontWeight: "600", fontSize: 14 },
  card: { width: 150, overflow: "hidden" },
  shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  imageContainer: { width: 150, height: 150, backgroundColor: "#f4f4f5", overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  saleBadge: { position: "absolute", top: 6, left: 6, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  saleBadgeText: { fontSize: 10, fontWeight: "600" },
  productName: { fontWeight: "500", paddingHorizontal: 8, paddingTop: 8 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingBottom: 10, paddingTop: 4 },
  price: { fontWeight: "600" },
  comparePrice: { textDecorationLine: "line-through" },
});
