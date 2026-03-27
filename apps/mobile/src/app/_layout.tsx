import { Slot } from "expo-router";
import { StoreProvider } from "../store-context";
import { ThemeProvider } from "../theme";

export default function RootLayout() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </StoreProvider>
  );
}
