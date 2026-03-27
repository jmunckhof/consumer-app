import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { fetchStore } from "../api";
import { useStore } from "../store-context";

export default function SelectStoreScreen() {
  const { setStore } = useStore();
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!slug.trim()) return;
    setLoading(true);
    setError("");
    try {
      const store = await fetchStore(slug.trim().toLowerCase());
      setStore(store);
      router.replace("/(tabs)");
    } catch {
      setError("Store not found. Check the slug and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🏪</Text>
        </View>
        <Text style={styles.title}>Enter Store</Text>
        <Text style={styles.subtitle}>
          Enter the organization slug to load the store.
        </Text>

        <TextInput
          style={styles.input}
          value={slug}
          onChangeText={setSlug}
          placeholder="e.g. my-store"
          placeholderTextColor="#a1a1aa"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Open Store</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  logo: { alignSelf: "center", marginBottom: 24 },
  logoText: { fontSize: 48 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#09090b",
  },
  subtitle: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#09090b",
    backgroundColor: "#fafafa",
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
