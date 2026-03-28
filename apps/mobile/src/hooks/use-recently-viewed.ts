import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../store-context";
import { fetchProduct } from "../api";
import type { ResolvedProduct } from "@repo/validators";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 20;

type StoredItem = { slug: string; timestamp: number };

export function useRecentlyViewed(maxItems = 10) {
  const { store } = useStore();
  const [products, setProducts] = useState<ResolvedProduct[]>([]);

  const load = useCallback(async () => {
    if (!store) return;
    try {
      const raw = await AsyncStorage.getItem(`${STORAGE_KEY}:${store.slug}`);
      if (!raw) return;
      const items: StoredItem[] = JSON.parse(raw);
      const slugs = items
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxItems)
        .map((i) => i.slug);

      if (slugs.length === 0) return;

      // Fetch product details for each slug
      const results = await Promise.allSettled(
        slugs.map((slug) => fetchProduct(store.slug, slug))
      );

      const resolved: ResolvedProduct[] = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => ({
          id: r.value.id,
          name: r.value.name,
          slug: r.value.slug,
          images: (r.value.images as { url: string; alt?: string }[]) ?? [],
          priceInCents: r.value.priceInCents,
          compareAtPriceInCents: r.value.compareAtPriceInCents,
        }));

      setProducts(resolved);
    } catch {
      // Ignore storage errors
    }
  }, [store?.slug, maxItems]);

  useEffect(() => {
    load();
  }, [load]);

  return products;
}

export async function addToRecentlyViewed(storeSlug: string, productSlug: string) {
  try {
    const key = `${STORAGE_KEY}:${storeSlug}`;
    const raw = await AsyncStorage.getItem(key);
    let items: StoredItem[] = raw ? JSON.parse(raw) : [];

    // Remove existing entry for this slug
    items = items.filter((i) => i.slug !== productSlug);

    // Add to front
    items.unshift({ slug: productSlug, timestamp: Date.now() });

    // Trim to max
    items = items.slice(0, MAX_ITEMS);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}
