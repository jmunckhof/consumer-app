import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { useTheme } from "../../theme";

type Props = Extract<ResolvedSection, { type: "category-grid" }>;

export function CategoryGrid({ title, categories }: Props) {
  const { global, categoryCard, sectionHeader } = useTheme();

  const imageRadius =
    categoryCard.shape === "circle"
      ? 999
      : categoryCard.shape === "square"
        ? 0
        : categoryCard.borderRadius ?? global.borderRadius;

  return (
    <View style={[styles.container, { paddingHorizontal: global.contentPadding }]}>
      {title && (
        <Text style={[styles.title, { fontSize: sectionHeader.fontSize, color: global.textColor }]}>
          {title}
        </Text>
      )}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.card} activeOpacity={0.7}>
            <View style={[styles.imageContainer, { borderRadius: imageRadius }]}>
              {cat.imageUrl ? (
                <Image source={{ uri: cat.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.placeholder, { backgroundColor: global.primaryColor + "15" }]}>
                  <Text style={[styles.placeholderText, { color: global.textSecondaryColor }]}>
                    {cat.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            {categoryCard.showLabel && (
              <Text style={[styles.name, { color: global.textColor, fontSize: global.captionSize + 1 }]} numberOfLines={1}>
                {cat.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  title: { fontWeight: "700", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47%", alignItems: "center" },
  imageContainer: { width: "100%", aspectRatio: 1.4, overflow: "hidden", backgroundColor: "#f4f4f5" },
  image: { width: "100%", height: "100%" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderText: { fontSize: 24, fontWeight: "700" },
  name: { fontWeight: "600", marginTop: 8, textAlign: "center" },
});
