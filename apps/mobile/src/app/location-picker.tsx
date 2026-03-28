import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store-context";
import { useTheme } from "../theme";
import { fetchStoreLocations } from "../api";

export default function LocationPickerScreen() {
  const { store, selectedLocation, setSelectedLocation } = useStore();
  const { global: t } = useTheme();

  const { data: locations, isLoading } = useQuery({
    queryKey: ["store", store?.slug, "locations"],
    queryFn: () => fetchStoreLocations(store!.slug),
    enabled: !!store,
  });

  function selectLocation(loc: (typeof locations)[0]) {
    setSelectedLocation({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      address: loc.address,
      city: loc.city,
      postalCode: loc.postalCode,
      country: loc.country,
      phone: loc.phone,
      openingHours: loc.openingHours as any,
    });
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a store</Text>
        <Text style={styles.subtitle}>
          Select your nearest store location
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={t.primaryColor} />
      ) : (
        <FlatList
          data={locations ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No store locations available.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSelected = selectedLocation?.id === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.card,
                  isSelected && { borderColor: t.primaryColor, borderWidth: 2 },
                ]}
                onPress={() => selectLocation(item)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardAddress}>
                    {item.address}
                  </Text>
                  <Text style={styles.cardCity}>
                    {item.postalCode} {item.city}
                  </Text>
                  {item.phone && (
                    <Text style={styles.cardPhone}>{item.phone}</Text>
                  )}
                </View>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: t.primaryColor }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selectedLocation && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.back()}
        >
          <Text style={styles.skipText}>Keep current selection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#18181b" },
  subtitle: { fontSize: 14, color: "#71717a", marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    marginBottom: 8,
  },
  cardContent: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "600", color: "#18181b" },
  cardAddress: { fontSize: 14, color: "#71717a", marginTop: 2 },
  cardCity: { fontSize: 14, color: "#71717a" },
  cardPhone: { fontSize: 13, color: "#a1a1aa", marginTop: 4 },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  checkmarkText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { color: "#71717a", fontSize: 14 },
  skipButton: { position: "absolute", bottom: 40, left: 20, right: 20 },
  skipText: { textAlign: "center", fontSize: 15, color: "#71717a" },
});
