import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";
import { fetchProducts, fetchCategories } from "../../api";
import { formatPrice } from "../../format";
import { storeKeys } from "../../hooks/use-store-queries";

export default function CategoryScreen() {
  const { slug: categorySlug } = useLocalSearchParams<{ slug: string }>();
  const { store, currency } = useStore();
  const { global: t, productCard } = useTheme();
  const cardRadius = productCard.borderRadius ?? t.borderRadius;

  // Find the category by slug to get its id and name
  const { data: categories } = useQuery({
    queryKey: storeKeys.categories(store?.slug ?? ""),
    queryFn: () => fetchCategories(store!.slug),
    enabled: !!store,
    staleTime: 5 * 60 * 1000,
  });

  const category = categories?.find((c) => c.slug === categorySlug);

  // Fetch products for this category
  const { data: products, isLoading } = useQuery({
    queryKey: storeKeys.products(store?.slug ?? "", {
      categoryId: category?.id,
    }),
    queryFn: () =>
      fetchProducts(store!.slug, { categoryId: category?.id }),
    enabled: !!store && !!category,
    staleTime: 2 * 60 * 1000,
  });

  const navigation = useNavigation();
  React.useEffect(() => {
    if (category?.name) {
      navigation.setOptions({ headerTitle: category.name });
    }
  }, [category?.name, navigation]);

  if (!store) return null;

  return (
    <View style={[styles.container, { backgroundColor: t.backgroundColor }]}>
      <FlatList
        data={products ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 40 }}
              color={t.primaryColor}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: t.textSecondaryColor }]}>
                No products in this category.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const heroImage = item.images?.[0]?.url;
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  borderRadius: cardRadius,
                  backgroundColor: t.surfaceColor,
                },
                productCard.shadow && styles.shadow,
              ]}
              onPress={() => router.push(`/product/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.imageContainer,
                  {
                    aspectRatio: productCard.imageAspectRatio,
                    borderTopLeftRadius: cardRadius,
                    borderTopRightRadius: cardRadius,
                  },
                ]}
              >
                {heroImage ? (
                  <Image
                    source={{ uri: heroImage }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 32, opacity: 0.2 }}>📷</Text>
                  </View>
                )}
                {item.compareAtPriceInCents && productCard.showBadge && (
                  <View
                    style={[
                      styles.saleBadge,
                      { backgroundColor: t.errorColor },
                    ]}
                  >
                    <Text style={styles.saleBadgeText}>Sale</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.productName,
                  { color: t.textColor, fontSize: t.bodySize - 2 },
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.price,
                    { color: t.textColor, fontSize: t.bodySize - 1 },
                  ]}
                >
                  {formatPrice(item.priceInCents, currency)}
                </Text>
                {item.compareAtPriceInCents && (
                  <Text
                    style={[
                      styles.comparePrice,
                      {
                        color: t.textSecondaryColor,
                        fontSize: t.captionSize,
                      },
                    ]}
                  >
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
  container: { flex: 1 },
  header: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  description: { fontSize: 14, marginTop: 4 },
  count: { fontSize: 13, marginTop: 8 },
  row: { gap: 12, paddingHorizontal: 12 },
  card: { flex: 1, overflow: "hidden", marginBottom: 12 },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: { backgroundColor: "#f4f4f5", overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saleBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleBadgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  productName: { fontWeight: "500", paddingHorizontal: 8, paddingTop: 8 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 4,
  },
  price: { fontWeight: "600" },
  comparePrice: { textDecorationLine: "line-through" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 14 },
});
