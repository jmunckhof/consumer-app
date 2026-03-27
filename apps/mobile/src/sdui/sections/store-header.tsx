import React from "react";
import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { useTheme } from "../../theme";

type Props = Extract<ResolvedSection, { type: "store-header" }>;

export function StoreHeader({
  storeName,
  logoUrl,
  subtitle,
  showSearch,
  showLogo,
}: Props) {
  const { global } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: global.primaryColor }]}>
      <View style={styles.row}>
        {showLogo && logoUrl && (
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        )}
        {showLogo && !logoUrl && (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{storeName.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.storeName,
              {
                fontSize: global.headingSize,
                color: global.textOnPrimary,
              },
            ]}
          >
            {storeName}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: global.bodySize - 1,
                  color: global.textOnPrimary,
                  opacity: 0.8,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            style={[styles.searchInput, { borderRadius: global.borderRadius }]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  textContainer: {
    flex: 1,
  },
  storeName: {
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
  },
  searchContainer: {
    marginTop: 14,
  },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1A1A",
  },
});
