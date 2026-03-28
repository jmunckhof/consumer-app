import React from "react";
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
import { useTheme } from "../../theme";
import { useCategories } from "../../hooks/use-store-queries";

export default function CategoriesScreen() {
  const { global: t } = useTheme();
  const { data: categories, isLoading } = useCategories();

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse by category</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={t.primaryColor} />
      ) : (
        <FlatList
          data={categories ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No categories yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push(`/category/${item.slug}`)}
            >
              <View style={styles.cardImage}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                ) : (
                  <View
                    style={[
                      styles.imagePlaceholder,
                      { backgroundColor: t.primaryColor + "15" },
                    ]}
                  >
                    <Text style={styles.placeholderEmoji}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerSection: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#18181b" },
  subtitle: { fontSize: 14, color: "#71717a", marginTop: 4 },
  list: { paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    marginBottom: 8,
  },
  cardImage: { width: 56, height: 56, borderRadius: 12, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  placeholderEmoji: { fontSize: 22, fontWeight: "700", color: "#71717a" },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#18181b" },
  cardDescription: { fontSize: 13, color: "#71717a", marginTop: 2 },
  chevron: { fontSize: 24, color: "#d4d4d8", marginLeft: 8 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { color: "#71717a", fontSize: 14 },
});
