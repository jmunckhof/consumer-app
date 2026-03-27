import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import type { ResolvedSection } from "@repo/validators";

const { width } = Dimensions.get("window");

type Props = Extract<ResolvedSection, { type: "hero-banner" }>;

export function HeroBanner({ imageUrl, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {(title || subtitle) && (
        <View style={styles.overlay}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, aspectRatio: 16 / 9, backgroundColor: "#f4f4f5" },
  image: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },
});
