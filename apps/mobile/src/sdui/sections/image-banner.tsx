import React from "react";
import { Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { useTheme } from "../../theme";

const { width } = Dimensions.get("window");

type Props = Extract<ResolvedSection, { type: "image-banner" }>;

export function ImageBanner({ imageUrl, alt }: Props) {
  const { global } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { paddingHorizontal: global.contentPadding, paddingVertical: global.sectionSpacing / 2 }]}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: width - global.contentPadding * 2, borderRadius: global.borderRadius }]}
        accessibilityLabel={alt}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: { height: 150 },
});
