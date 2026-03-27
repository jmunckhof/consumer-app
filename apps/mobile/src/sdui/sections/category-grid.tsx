import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ResolvedSection } from "@repo/validators";
import { useStore } from "../../store-context";

type Props = Extract<ResolvedSection, { type: "category-grid" }>;

export function CategoryGrid({ title, categories }: Props) {
  const { primaryColor } = useStore();

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>
              {cat.imageUrl ? (
                <Image source={{ uri: cat.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.placeholder, { backgroundColor: primaryColor + "15" }]}>
                  <Text style={styles.placeholderText}>{cat.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.name} numberOfLines={1}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16, paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#18181b", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47%", alignItems: "center" },
  imageContainer: { width: "100%", aspectRatio: 1.4, borderRadius: 12, overflow: "hidden", backgroundColor: "#f4f4f5" },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  placeholderText: { fontSize: 24, fontWeight: "700", color: "#71717a" },
  name: { fontSize: 13, fontWeight: "600", color: "#18181b", marginTop: 8, textAlign: "center" },
});
