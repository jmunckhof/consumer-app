import React, { createContext, useContext, useState } from "react";
import type { AppTheme } from "@repo/validators";

type StoreConfig = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  currency: string;
  config: {
    theme?: AppTheme;
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
  currency: string;
};

const StoreContext = createContext<StoreContextType>({
  store: null,
  setStore: () => {},
  currency: "EUR",
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreConfig | null>(null);
  const currency = store?.currency ?? "EUR";

  return (
    <StoreContext.Provider value={{ store, setStore, currency }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
