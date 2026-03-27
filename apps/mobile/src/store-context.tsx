import React, { createContext, useContext, useState } from "react";

type StoreConfig = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  currency: string;
  config: {
    theme?: {
      primaryColor?: string;
      accentColor?: string;
      darkMode?: boolean;
    };
    features?: {
      cart?: boolean;
      wishlist?: boolean;
      reviews?: boolean;
    };
  };
};

type StoreContextType = {
  store: StoreConfig | null;
  setStore: (store: StoreConfig | null) => void;
  primaryColor: string;
  accentColor: string;
  currency: string;
};

const StoreContext = createContext<StoreContextType>({
  store: null,
  setStore: () => {},
  primaryColor: "#000000",
  accentColor: "#3b82f6",
  currency: "EUR",
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreConfig | null>(null);

  const primaryColor = store?.config?.theme?.primaryColor ?? "#000000";
  const accentColor = store?.config?.theme?.accentColor ?? "#3b82f6";
  const currency = store?.currency ?? "EUR";

  return (
    <StoreContext.Provider
      value={{ store, setStore, primaryColor, accentColor, currency }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
