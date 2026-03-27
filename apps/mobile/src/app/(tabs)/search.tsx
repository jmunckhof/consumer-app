import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";
import { useSearchProducts } from "../../hooks/use-store-queries";
import { formatPrice } from "../../format";

export default function SearchScreen() {
  const { currency } = useStore();
  const { global: t } = useTheme();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const { data: results, isLoading, isFetching } = useSearchProducts(debouncedQuery);

  function handleSearch(text: string) {
    setQuery(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 300);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search products..."
            placeholderTextColor="#a1a1aa"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {isFetching && (
            <ActivityIndicator
              size="small"
              color={t.primaryColor}
              style={styles.spinner}
            />
          )}
        </View>
      </View>

      <FlatList
        data={results ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          debouncedQuery.length >= 2 && !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No results for "{debouncedQuery}"
              </Text>
            </View>
          ) : debouncedQuery.length < 2 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                Start typing to search products
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const heroImage = item.images?.[0]?.url;
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/product/${item.slug}`)}
              activeOpacity={0.7}
            >
              <View style={styles.rowImage}>
                {heroImage ? (
                  <Image source={{ uri: heroImage }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 18, opacity: 0.2 }}>📷</Text>
                  </View>
                )}
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.category && (
                  <Text style={styles.rowCategory}>{item.category.name}</Text>
                )}
              </View>
              <Text style={styles.rowPrice}>
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
  container: { flex: 1, backgroundColor: "#fff" },
  headerSection: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#18181b",
    marginBottom: 16,
  },
  searchRow: { position: "relative" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#09090b",
    backgroundColor: "#fafafa",
  },
  spinner: { position: "absolute", right: 14, top: 14 },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  rowImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1, marginLeft: 12 },
  rowName: { fontSize: 15, fontWeight: "500", color: "#18181b" },
  rowCategory: { fontSize: 12, color: "#71717a", marginTop: 2 },
  rowPrice: { fontSize: 15, fontWeight: "600", color: "#18181b" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: "#71717a", fontSize: 14 },
});
