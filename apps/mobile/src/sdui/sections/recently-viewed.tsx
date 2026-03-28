import React from "react";
import type { ResolvedSection } from "@repo/validators";
import { useRecentlyViewed } from "../../hooks/use-recently-viewed";
import { RelatedProducts } from "./related-products";

type Props = Extract<ResolvedSection, { type: "recently-viewed" }>;

export function RecentlyViewed({ title }: Props) {
  const products = useRecentlyViewed(10);

  if (products.length === 0) return null;

  return (
    <RelatedProducts
      type="related-hand-picked"
      title={title}
      products={products}
    />
  );
}
