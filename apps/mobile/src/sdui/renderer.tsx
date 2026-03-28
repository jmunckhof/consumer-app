import React from "react";
import { FlatList, View } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { StoreHeader } from "./sections/store-header";
import { HeroBanner } from "./sections/hero-banner";
import { CategoryGrid } from "./sections/category-grid";
import { ProductCarousel } from "./sections/product-carousel";
import { ProductGrid } from "./sections/product-grid";
import { TextBlock } from "./sections/text-block";
import { ImageBanner } from "./sections/image-banner";
import { RelatedProducts } from "./sections/related-products";
import { RecentlyViewed } from "./sections/recently-viewed";

// Exhaustive component map — adding a new section type without a component is a compile error
const SECTION_COMPONENTS: {
  [K in ResolvedSection["type"]]: React.ComponentType<
    Extract<ResolvedSection, { type: K }>
  >;
} = {
  "store-header": StoreHeader,
  "hero-banner": HeroBanner,
  "category-grid": CategoryGrid,
  "product-carousel": ProductCarousel,
  "product-grid": ProductGrid,
  "text-block": TextBlock,
  "image-banner": ImageBanner,
  "related-by-category": RelatedProducts,
  "related-by-tag": RelatedProducts,
  "related-hand-picked": RelatedProducts,
  "recently-viewed": RecentlyViewed,
};

function renderSection(item: ResolvedSection, index: number) {
  const Component = SECTION_COMPONENTS[item.type] as React.ComponentType<typeof item>;
  return <Component key={index} {...item} />;
}

type Props = {
  sections: ResolvedSection[];
  header?: React.ReactElement;
};

/**
 * Renders as a FlatList (scrollable, virtualized).
 * Use for top-level page rendering (home screen).
 */
export function SDUIRenderer({ sections, header }: Props) {
  return (
    <FlatList
      data={sections}
      keyExtractor={(_, index) => String(index)}
      ListHeaderComponent={header}
      renderItem={({ item, index }) => renderSection(item, index)}
      ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
    />
  );
}

/**
 * Renders inline (no FlatList). Use when embedding inside a ScrollView.
 */
export function SDUISections({ sections }: { sections: ResolvedSection[] }) {
  return (
    <View style={{ gap: 4 }}>
      {sections.map((section, i) => renderSection(section, i))}
    </View>
  );
}
