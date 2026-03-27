import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { useTheme } from "../../theme";

const { width } = Dimensions.get("window");

type Props = Extract<ResolvedSection, { type: "hero-banner" }>;

export function HeroBanner({ imageUrl, title, subtitle }: Props) {
  const { global, heroBanner } = useTheme();

  return (
    <View style={[styles.container, { height: heroBanner.height }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {(title || subtitle) && (
        <View
          style={[
            styles.overlay,
            heroBanner.overlayGradient && styles.gradient,
          ]}
        >
          {title && (
            <Text
              style={[
                styles.title,
                {
                  fontSize: global.headingSize,
                  color: global.textOnPrimary,
                  textAlign: heroBanner.textAlign,
                },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: global.bodySize,
                  color: global.textOnPrimary,
                  textAlign: heroBanner.textAlign,
                  opacity: 0.8,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, backgroundColor: "#f4f4f5" },
  image: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  gradient: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: { fontWeight: "700" },
  subtitle: { marginTop: 4 },
});
