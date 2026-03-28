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

export type StoreLocation = {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string | null;
  country: string;
  phone: string | null;
  openingHours: { day: string; open: string; close: string; closed?: boolean }[];
};

type StoreContextType = {
  store: StoreConfig | null;
  setStore: (store: StoreConfig | null) => void;
  currency: string;
  selectedLocation: StoreLocation | null;
  setSelectedLocation: (location: StoreLocation | null) => void;
};

const StoreContext = createContext<StoreContextType>({
  store: null,
  setStore: () => {},
  currency: "EUR",
  selectedLocation: null,
  setSelectedLocation: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreConfig | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const currency = store?.currency ?? "EUR";

  return (
    <StoreContext.Provider
      value={{ store, setStore, currency, selectedLocation, setSelectedLocation }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
