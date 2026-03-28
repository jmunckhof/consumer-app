import { useState } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "../store-context";
import { ThemeProvider } from "../theme";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="location-picker"
              options={{
                headerShown: true,
                headerTitle: "Select Store",
                headerBackTitle: "Back",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="category/[slug]"
              options={{
                headerShown: true,
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="product/[slug]"
              options={{
                headerShown: true,
                headerTitle: "",
                headerBackTitle: "Back",
                headerTransparent: true,
              }}
            />
          </Stack>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
