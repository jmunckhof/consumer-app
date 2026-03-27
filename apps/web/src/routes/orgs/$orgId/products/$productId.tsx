import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTRPC } from "../../../../utils/trpc";
import { formatPrice, getCurrencySymbol } from "../../../../utils/format";
import { PageHeader } from "../../../../components/page";
import { Field, FieldGroup } from "../../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/products/$productId")({
  component: EditProductPage,
});

function EditProductPage() {
  const { orgId, productId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery(
    trpc.product.byId.queryOptions({ orgId, productId })
  );
  const { data: categories } = useQuery(
    trpc.category.list.queryOptions({ orgId })
  );
  const { data: org } = useQuery(trpc.org.byId.queryOptions({ orgId }));
  const currency = org?.currency ?? "EUR";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description ?? "");
      setCategoryId(product.categoryId ?? "");
      setPrice((product.priceInCents / 100).toFixed(2));
      setComparePrice(
        product.compareAtPriceInCents
          ? (product.compareAtPriceInCents / 100).toFixed(2)
          : ""
      );
      setSku(product.sku ?? "");
      const images = (product.images as { url: string }[]) ?? [];
      setImageUrl(images[0]?.url ?? "");
      setIsActive(product.isActive);
    }
  }, [product]);

  const updateProduct = useMutation(
    trpc.product.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.byId.queryKey({ orgId, productId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.product.list.queryKey(),
        });
        navigate({ to: "/orgs/$orgId/products", params: { orgId } });
      },
    })
  );

  const deleteProduct = useMutation(
    trpc.product.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.list.queryKey(),
        });
        navigate({ to: "/orgs/$orgId/products", params: { orgId } });
      },
    })
  );

  // Variant mutations
  const addVariant = useMutation(
    trpc.product.addVariant.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.byId.queryKey({ orgId, productId }),
        });
      },
    })
  );

  const deleteVariant = useMutation(
    trpc.product.deleteVariant.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.byId.queryKey({ orgId, productId }),
        });
      },
    })
  );

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }
  if (!product) {
    return <p className="text-sm text-red-500">Product not found.</p>;
  }

  return (
    <>
      <PageHeader
        title={`Edit: ${product.name}`}
        description="Update product details, pricing, and variants."
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                  deleteProduct.mutate({ orgId, productId });
                }
              }}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm/6 font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Delete
            </button>
            <button
              onClick={() => {
                const images = imageUrl ? [{ url: imageUrl }] : [];
                updateProduct.mutate({
                  orgId,
                  productId,
                  data: {
                    name,
                    slug,
                    description: description || undefined,
                    categoryId: categoryId || undefined,
                    priceInCents: Math.round(parseFloat(price) * 100),
                    compareAtPriceInCents: comparePrice
                      ? Math.round(parseFloat(comparePrice) * 100)
                      : undefined,
                    sku: sku || undefined,
                    images,
                    isActive,
                  },
                });
              }}
              disabled={updateProduct.isPending}
              className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              {updateProduct.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <div>
          <FieldGroup>
            <Field label="Product Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>

            <Field label="Slug">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Price">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-500">{getCurrencySymbol(currency)}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-950/10 bg-transparent py-2 pl-7 pr-3 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                  />
                </div>
              </Field>
              <Field label="Compare at Price">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-500">{getCurrencySymbol(currency)}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    className="w-full rounded-lg border border-zinc-950/10 bg-transparent py-2 pl-7 pr-3 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                  />
                </div>
              </Field>
            </div>

            <Field label="SKU">
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>

            <Field label="Image URL">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
              {imageUrl && (
                <div className="mt-2 size-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <img src={imageUrl} alt="Preview" className="size-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </Field>

            {/* Variants */}
            <div className="border-t border-zinc-950/5 pt-6 dark:border-white/5">
              <VariantEditor
                variants={product.variants ?? []}
                productId={productId}
                addVariant={addVariant}
                deleteVariant={deleteVariant}
              />
            </div>
          </FieldGroup>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">Status</h3>
            <label className="mt-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
              />
              <span className="text-sm/6 text-zinc-950 dark:text-white">Active</span>
            </label>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Inactive products are hidden from the consumer app.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">Category</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-3 w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            >
              <option value="">No category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">Info</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Created</dt>
                <dd className="text-zinc-950 dark:text-white">
                  {new Date(product.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Updated</dt>
                <dd className="text-zinc-950 dark:text-white">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">ID</dt>
                <dd className="font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
                  {product.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

function VariantEditor({
  variants,
  productId,
  addVariant,
  deleteVariant,
}: {
  variants: any[];
  productId: string;
  addVariant: any;
  deleteVariant: any;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [optionName, setOptionName] = useState("Size");
  const [optionValue, setOptionValue] = useState("");
  const [variantPrice, setVariantPrice] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">
          Variants ({variants.length})
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {showAdd ? "Cancel" : "+ Add Variant"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addVariant.mutate({
              productId,
              data: {
                name: `${optionName}: ${optionValue}`,
                optionName,
                optionValue,
                priceInCents: variantPrice
                  ? Math.round(parseFloat(variantPrice) * 100)
                  : undefined,
              },
            });
            setOptionValue("");
            setVariantPrice("");
            setShowAdd(false);
          }}
          className="mt-3 flex items-end gap-2"
        >
          <div>
            <label className="block text-xs text-zinc-500">Type</label>
            <select
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              className="mt-1 rounded-md border border-zinc-950/10 bg-transparent px-2 py-1.5 text-xs dark:border-white/10 dark:text-white"
            >
              <option>Size</option>
              <option>Color</option>
              <option>Material</option>
              <option>Style</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500">Value</label>
            <input
              value={optionValue}
              onChange={(e) => setOptionValue(e.target.value)}
              required
              placeholder="M"
              className="mt-1 w-24 rounded-md border border-zinc-950/10 bg-transparent px-2 py-1.5 text-xs dark:border-white/10 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500">Price override</label>
            <input
              value={variantPrice}
              onChange={(e) => setVariantPrice(e.target.value)}
              placeholder="$"
              type="number"
              step="0.01"
              className="mt-1 w-20 rounded-md border border-zinc-950/10 bg-transparent px-2 py-1.5 text-xs dark:border-white/10 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={addVariant.isPending}
            className="rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}

      {variants.length > 0 ? (
        <div className="mt-3">
          <table className="min-w-full text-left text-sm/6">
            <thead>
              <tr className="text-xs text-zinc-500 dark:text-zinc-400">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-950/5 dark:divide-white/5">
              {variants.map((v: any) => (
                <tr key={v.id}>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded-md bg-zinc-600/10 px-1.5 py-0.5 text-xs/5 font-medium text-zinc-700 dark:bg-white/5 dark:text-zinc-400">
                      {v.optionName}
                    </span>
                  </td>
                  <td className="py-2 text-zinc-950 dark:text-white">
                    {v.optionValue}
                  </td>
                  <td className="py-2 text-right text-zinc-500 dark:text-zinc-400">
                    {v.priceInCents != null
                      ? formatPrice(v.priceInCents, currency)
                      : "—"}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => deleteVariant.mutate({ variantId: v.id })}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          No variants. Add sizes, colors, or other options.
        </p>
      )}
    </div>
  );
}
