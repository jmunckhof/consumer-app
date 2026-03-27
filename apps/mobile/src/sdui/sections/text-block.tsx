import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ResolvedSection } from "@repo/validators";

type Props = Extract<ResolvedSection, { type: "text-block" }>;

export function TextBlock({ title, body }: Props) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16, paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#18181b", marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 24, color: "#52525b" },
});
