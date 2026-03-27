import { Slot } from "expo-router";
import { StoreProvider } from "../store-context";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Slot />
    </StoreProvider>
  );
}
