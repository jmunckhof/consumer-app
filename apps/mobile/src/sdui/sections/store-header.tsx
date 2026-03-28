import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ResolvedSection } from "@repo/validators";
import { useStore } from "../../store-context";
import { useTheme } from "../../theme";

type Props = Extract<ResolvedSection, { type: "store-header" }>;

function getOpenStatus(
  openingHours: { day: string; open: string; close: string; closed?: boolean }[]
): { isOpen: boolean; label: string } {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const now = new Date();
  const dayName = days[now.getDay()];
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = openingHours.find((h) => h.day === dayName);
  if (!today || today.closed) return { isOpen: false, label: "Closed today" };
  if (time >= today.open && time < today.close) return { isOpen: true, label: `Closes ${today.close}` };
  if (time < today.open) return { isOpen: false, label: `Opens ${today.open}` };
  return { isOpen: false, label: "Closed" };
}

export function StoreHeader({ storeName, subtitle, showSearch }: Props) {
  const { global } = useTheme();
  const { selectedLocation } = useStore();

  const openStatus = selectedLocation?.openingHours?.length
    ? getOpenStatus(selectedLocation.openingHours)
    : null;

  const displayName = selectedLocation?.name ?? storeName;

  return (
    <View style={[styles.container, { backgroundColor: global.primaryColor }]}>
      {subtitle && (
        <Text style={styles.contextLine}>{subtitle}</Text>
      )}

      <TouchableOpacity
        style={styles.nameRow}
        onPress={() => router.push("/location-picker" as any)}
        activeOpacity={0.7}
      >
        <Text style={styles.storeName} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      {selectedLocation && openStatus ? (
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: openStatus.isOpen ? "#4ade80" : "#f87171" }]} />
          <Text style={styles.statusText}>{openStatus.label}</Text>
        </View>
      ) : !selectedLocation ? (
        <TouchableOpacity onPress={() => router.push("/location-picker" as any)}>
          <Text style={styles.selectHint}>Tap to select your store ›</Text>
        </TouchableOpacity>
      ) : null}

      {showSearch && (
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={[styles.searchInput, { borderRadius: global.borderRadius }]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 64, paddingBottom: 24, paddingHorizontal: 20 },
  contextLine: { fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.7)", marginBottom: 2 },
  nameRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  storeName: { fontSize: 28, fontWeight: "800", color: "#fff", flexShrink: 1 },
  chevron: { fontSize: 16, color: "rgba(255,255,255,0.5)" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: "500", color: "rgba(255,255,255,0.85)" },
  selectHint: { fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.5)", marginTop: 4 },
  searchWrap: { marginTop: 18 },
  searchInput: { backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: "#1A1A1A" },
});
