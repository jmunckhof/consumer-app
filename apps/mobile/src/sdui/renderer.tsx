import React from "react";
import { FlatList, View } from "react-native";
import type { ResolvedSection } from "@repo/validators";
import { HeroBanner } from "./sections/hero-banner";
import { CategoryGrid } from "./sections/category-grid";
import { ProductCarousel } from "./sections/product-carousel";
import { ProductGrid } from "./sections/product-grid";
import { TextBlock } from "./sections/text-block";
import { ImageBanner } from "./sections/image-banner";

// Exhaustive component map — adding a new section type without a component is a compile error
const SECTION_COMPONENTS: {
  [K in ResolvedSection["type"]]: React.ComponentType<
    Extract<ResolvedSection, { type: K }>
  >;
} = {
  "hero-banner": HeroBanner,
  "category-grid": CategoryGrid,
  "product-carousel": ProductCarousel,
  "product-grid": ProductGrid,
  "text-block": TextBlock,
  "image-banner": ImageBanner,
};

type Props = {
  sections: ResolvedSection[];
  header?: React.ReactElement;
};

export function SDUIRenderer({ sections, header }: Props) {
  return (
    <FlatList
      data={sections}
      keyExtractor={(_, index) => String(index)}
      ListHeaderComponent={header}
      renderItem={({ item }) => {
        const Component = SECTION_COMPONENTS[item.type] as React.ComponentType<typeof item>;
        return <Component {...item} />;
      }}
      ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
    />
  );
}
