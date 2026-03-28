import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useStore } from "../store-context";
import {
  fetchCategories,
  fetchProducts,
  fetchProduct,
  fetchHomePage,
  fetchProductPage,
} from "../api";

// Query key factory
export const storeKeys = {
  all: (slug: string) => ["store", slug] as const,
  categories: (slug: string) => [...storeKeys.all(slug), "categories"] as const,
  products: (slug: string, opts?: { categoryId?: string; search?: string }) =>
    [...storeKeys.all(slug), "products", opts?.categoryId ?? "all", opts?.search ?? ""] as const,
  product: (slug: string, productSlug: string) =>
    [...storeKeys.all(slug), "product", productSlug] as const,
  productPage: (slug: string, productSlug: string) =>
    [...storeKeys.all(slug), "pages", "product", productSlug] as const,
  homePage: (slug: string) => [...storeKeys.all(slug), "pages", "home"] as const,
};

export function useCategories() {
  const { store } = useStore();
  return useQuery({
    queryKey: storeKeys.categories(store?.slug ?? ""),
    queryFn: () => fetchCategories(store!.slug),
    enabled: !!store,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(opts?: {
  categoryId?: string | null;
  search?: string;
  limit?: number;
}) {
  const { store } = useStore();
  const categoryId = opts?.categoryId ?? undefined;
  const search = opts?.search;
  const limit = opts?.limit;

  return useQuery({
    queryKey: storeKeys.products(store?.slug ?? "", {
      categoryId,
      search,
    }),
    queryFn: () =>
      fetchProducts(store!.slug, { categoryId, search, limit }),
    enabled: !!store,
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSearchProducts(query: string) {
  const { store } = useStore();
  return useQuery({
    queryKey: storeKeys.products(store?.slug ?? "", { search: query }),
    queryFn: () =>
      fetchProducts(store!.slug, { search: query, limit: 30 }),
    enabled: !!store && query.length >= 2,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(productSlug: string) {
  const { store } = useStore();
  return useQuery({
    queryKey: storeKeys.product(store?.slug ?? "", productSlug),
    queryFn: () => fetchProduct(store!.slug, productSlug),
    enabled: !!store && !!productSlug,
    staleTime: 2 * 60 * 1000,
  });
}

export function useHomePage() {
  const { store } = useStore();
  return useQuery({
    queryKey: storeKeys.homePage(store?.slug ?? ""),
    queryFn: () => fetchHomePage(store!.slug),
    enabled: !!store,
    staleTime: 60 * 1000,
  });
}

export function useProductPage(productSlug: string) {
  const { store } = useStore();
  return useQuery({
    queryKey: storeKeys.productPage(store?.slug ?? "", productSlug),
    queryFn: () => fetchProductPage(store!.slug, productSlug),
    enabled: !!store && !!productSlug,
    staleTime: 2 * 60 * 1000,
  });
}
