// In dev, Expo connects to the local API
// In production, this would be the deployed API URL
const API_BASE = __DEV__
  ? "http://localhost:3000"
  : "https://api.example.com";

export async function fetchStore(slug: string) {
  const res = await fetch(`${API_BASE}/api/store/${slug}`);
  if (!res.ok) throw new Error("Store not found");
  return res.json() as Promise<{
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
  }>;
}

export async function fetchCategories(slug: string) {
  const res = await fetch(`${API_BASE}/api/store/${slug}/categories`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json() as Promise<
    {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      imageUrl: string | null;
    }[]
  >;
}

export async function fetchProducts(
  slug: string,
  opts?: { categoryId?: string; search?: string; limit?: number }
) {
  const url = new URL(`${API_BASE}/api/store/${slug}/products`);
  if (opts?.categoryId) url.searchParams.set("category", opts.categoryId);
  if (opts?.search) url.searchParams.set("q", opts.search);
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load products");
  return res.json() as Promise<
    {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      images: { url: string; alt?: string }[];
      priceInCents: number;
      compareAtPriceInCents: number | null;
      sku: string | null;
      category: { id: string; name: string } | null;
    }[]
  >;
}

export async function fetchProduct(slug: string, productSlug: string) {
  const res = await fetch(
    `${API_BASE}/api/store/${slug}/products/${productSlug}`
  );
  if (!res.ok) throw new Error("Product not found");
  return res.json() as Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    images: { url: string; alt?: string }[];
    priceInCents: number;
    compareAtPriceInCents: number | null;
    category: { id: string; name: string } | null;
    variants: {
      id: string;
      name: string;
      optionName: string;
      optionValue: string;
      priceInCents: number | null;
    }[];
  }>;
}

export async function fetchHomePage(slug: string) {
  const res = await fetch(`${API_BASE}/api/store/${slug}/pages/home`);
  if (!res.ok) throw new Error("Failed to load home page");
  return res.json() as Promise<{
    sections: import("@repo/validators").ResolvedSection[];
  }>;
}
