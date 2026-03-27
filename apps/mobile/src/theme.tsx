import React, { createContext, useContext, useMemo } from "react";
import { useStore } from "./store-context";
import type {
  GlobalTheme,
  ComponentTheme,
  ProductCardTheme,
  SectionHeaderTheme,
  CategoryCardTheme,
  HeroBannerTheme,
  ButtonTheme,
} from "@repo/validators";
import {
  DEFAULT_GLOBAL_THEME,
  DEFAULT_COMPONENT_THEME,
} from "@repo/validators";

// ---------------------------------------------------------------------------
// Resolved theme — all defaults merged with overrides
// ---------------------------------------------------------------------------

export type ResolvedTheme = {
  global: GlobalTheme;
  productCard: Required<ProductCardTheme>;
  sectionHeader: Required<SectionHeaderTheme>;
  categoryCard: Required<CategoryCardTheme>;
  heroBanner: Required<HeroBannerTheme>;
  button: Required<ButtonTheme>;
};

const ThemeContext = createContext<ResolvedTheme>({
  global: DEFAULT_GLOBAL_THEME,
  ...DEFAULT_COMPONENT_THEME,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { store } = useStore();

  const theme = useMemo((): ResolvedTheme => {
    const themeConfig = store?.config?.theme;
    const globalOverrides = themeConfig?.global ?? {};
    const componentOverrides = themeConfig?.components ?? {};

    // Merge global: defaults ← overrides
    const global: GlobalTheme = {
      ...DEFAULT_GLOBAL_THEME,
      ...stripUndefined(globalOverrides),
    };

    // Merge each component: defaults ← global fallbacks ← component overrides
    const productCard: Required<ProductCardTheme> = {
      ...DEFAULT_COMPONENT_THEME.productCard,
      borderRadius: global.borderRadius,
      ...stripUndefined(componentOverrides.productCard ?? {}),
    };

    const sectionHeader: Required<SectionHeaderTheme> = {
      ...DEFAULT_COMPONENT_THEME.sectionHeader,
      fontSize: global.headingSize - 4,
      ...stripUndefined(componentOverrides.sectionHeader ?? {}),
    };

    const categoryCard: Required<CategoryCardTheme> = {
      ...DEFAULT_COMPONENT_THEME.categoryCard,
      borderRadius: global.borderRadius,
      ...stripUndefined(componentOverrides.categoryCard ?? {}),
    };

    const heroBanner: Required<HeroBannerTheme> = {
      ...DEFAULT_COMPONENT_THEME.heroBanner,
      ...stripUndefined(componentOverrides.heroBanner ?? {}),
    };

    const button: Required<ButtonTheme> = {
      ...DEFAULT_COMPONENT_THEME.button,
      borderRadius: global.borderRadius + 4,
      ...stripUndefined(componentOverrides.button ?? {}),
    };

    return { global, productCard, sectionHeader, categoryCard, heroBanner, button };
  }, [store?.config?.theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ResolvedTheme {
  return useContext(ThemeContext);
}

// Strip undefined values so they don't override defaults during spread
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key] = value;
  }
  return result as Partial<T>;
}
