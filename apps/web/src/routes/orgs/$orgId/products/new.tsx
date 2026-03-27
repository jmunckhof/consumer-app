import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../../../utils/trpc";
import { formatPrice, getCurrencySymbol } from "../../../../utils/format";
import { PageHeader } from "../../../../components/page";
import { Field, FieldGroup } from "../../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(
    trpc.category.list.queryOptions({ orgId })
  );
  const { data: org } = useQuery(trpc.org.byId.queryOptions({ orgId }));
  const currency = org?.currency ?? "EUR";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const createProduct = useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.list.queryKey(),
        });
        navigate({ to: "/orgs/$orgId/products", params: { orgId } });
      },
    })
  );

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  return (
    <>
      <PageHeader
        title="Add Product"
        description="Create a new product in your catalog."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const images = imageUrl ? [{ url: imageUrl }] : [];
          createProduct.mutate({
            orgId,
            data: {
              name,
              slug: slug || autoSlug(name),
              description: description || undefined,
              categoryId: categoryId || undefined,
              priceInCents: Math.round(parseFloat(price) * 100),
              compareAtPriceInCents: comparePrice
                ? Math.round(parseFloat(comparePrice) * 100)
                : undefined,
              sku: sku || undefined,
              images,
            },
          });
        }}
        className="mt-8 max-w-2xl"
      >
        <FieldGroup>
          <Field label="Product Name">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) {
                  setSlug(autoSlug(e.target.value));
                }
              }}
              required
              placeholder="Classic T-Shirt"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>

          <Field label="Slug" description="URL-friendly identifier. Auto-generated from name.">
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              required
              placeholder="classic-t-shirt"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>

          <Field label="Description" description="Shown on the product detail page in the consumer app.">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="A comfortable cotton t-shirt perfect for everyday wear..."
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>

          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            >
              <option value="">No category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-500">
                  {getCurrencySymbol(currency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="29.99"
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent py-2 pl-7 pr-3 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </div>
            </Field>
            <Field
              label="Compare at Price"
              description="Show as original price with a strikethrough."
            >
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-500">
                  {getCurrencySymbol(currency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="39.99"
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent py-2 pl-7 pr-3 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </div>
            </Field>
          </div>

          <Field label="SKU" description="Optional stock keeping unit identifier.">
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="TSH-BLK-001"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>

          <Field label="Image URL" description="Main product image. You can add more images later.">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
            {imageUrl && (
              <div className="mt-2 size-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </Field>
        </FieldGroup>

        {createProduct.isError && (
          <p className="mt-4 text-sm text-red-600">
            Failed to create product. Check that the slug is unique.
          </p>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-950/5 pt-6 dark:border-white/5">
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/orgs/$orgId/products", params: { orgId } })
            }
            className="rounded-lg border border-zinc-950/10 px-3 py-2 text-sm/6 font-semibold text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {createProduct.isPending ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </>
  );
}
