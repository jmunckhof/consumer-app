import React from "react";
import { Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import type { ResolvedSection } from "@repo/validators";

const { width } = Dimensions.get("window");

type Props = Extract<ResolvedSection, { type: "image-banner" }>;

export function ImageBanner({ imageUrl, alt }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        accessibilityLabel={alt}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8 },
  image: { width: width - 32, height: (width - 32) * 0.4, borderRadius: 12 },
});
