import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { useTheme } from "../../theme";

type Props = Extract<ResolvedSection, { type: "text-block" }>;

export function TextBlock({ title, body }: Props) {
  const { global } = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: global.contentPadding, paddingVertical: global.sectionSpacing }]}>
      {title && (
        <Text style={{ fontSize: global.headingSize - 4, fontWeight: "700", color: global.textColor, marginBottom: 8 }}>
          {title}
        </Text>
      )}
      <Text style={{ fontSize: global.bodySize, lineHeight: global.bodySize * 1.6, color: global.textSecondaryColor }}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
