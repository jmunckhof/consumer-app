import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../../../utils/trpc";
import { formatPrice } from "../../../../utils/format";
import { PageHeader, EmptyState } from "../../../../components/page";

export const Route = createFileRoute("/orgs/$orgId/products/")({
  component: ProductsPage,
});

function ProductsPage() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const pageSize = 25;

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  function handleSearch(value: string) {
    setSearch(value);
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, 300)
    );
  }

  const { data, isLoading } = useQuery({
    ...trpc.product.list.queryOptions({
      orgId,
      page,
      pageSize,
      search: debouncedSearch || undefined,
      categoryId: categoryFilter || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const { data: categories } = useQuery(
    trpc.category.list.queryOptions({ orgId })
  );

  const { data: org } = useQuery(trpc.org.byId.queryOptions({ orgId }));
  const currency = org?.currency ?? "EUR";

  const deleteProduct = useMutation(
    trpc.product.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.list.queryKey(),
        });
      },
    })
  );

  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <PageHeader
        title="Products"
        description={`${total.toLocaleString()} products in catalog.`}
        actions={
          <Link
            to="/orgs/$orgId/products/new"
            params={{ orgId }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            Add Product
          </Link>
        }
      />

      {/* Search + Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products by name, SKU, or slug..."
            className="w-full rounded-lg border border-zinc-950/10 bg-transparent py-2 pl-9 pr-3 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mt-4">
        {isLoading && products.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading...</p>
        ) : products.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-8">
                <path
                  fillRule="evenodd"
                  d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            title={
              debouncedSearch
                ? "No products match your search"
                : "No products yet"
            }
            description={
              debouncedSearch
                ? "Try a different search term."
                : "Add your first product to the catalog."
            }
            action={
              !debouncedSearch ? (
                <Link
                  to="/orgs/$orgId/products/new"
                  params={{ orgId }}
                  className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800"
                >
                  Add Product
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm/6">
                <thead className="text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                      Product
                    </th>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                      Category
                    </th>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                      SKU
                    </th>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium text-right dark:border-white/10">
                      Price
                    </th>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                      Status
                    </th>
                    <th className="border-b border-zinc-950/10 px-4 py-2 font-medium text-right dark:border-white/10 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const images =
                      (product.images as { url: string; alt?: string }[]) ?? [];
                    const heroImage = images[0]?.url;

                    return (
                      <tr
                        key={product.id}
                        onClick={() =>
                          navigate({
                            to: "/orgs/$orgId/products/$productId",
                            params: { orgId, productId: product.id },
                          })
                        }
                        className="cursor-pointer hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]"
                      >
                        <td className="border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                              {heroImage ? (
                                <img
                                  src={heroImage}
                                  alt={product.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <svg
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="size-4 text-zinc-300 dark:text-zinc-600"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-zinc-950 dark:text-white">
                                {product.name}
                              </div>
                              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                                {product.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-zinc-950/5 px-4 py-3 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                          {product.category?.name ?? "—"}
                        </td>
                        <td className="border-b border-zinc-950/5 px-4 py-3 font-mono text-xs text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                          {product.sku ?? "—"}
                        </td>
                        <td className="border-b border-zinc-950/5 px-4 py-3 text-right dark:border-white/5">
                          <div className="font-medium text-zinc-950 dark:text-white">
                            {formatPrice(product.priceInCents, currency)}
                          </div>
                          {product.compareAtPriceInCents && (
                            <div className="text-xs text-zinc-400 line-through">
                              {formatPrice(product.compareAtPriceInCents, currency)}
                            </div>
                          )}
                        </td>
                        <td className="border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs/5 font-medium ${
                              product.isActive
                                ? "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400"
                            }`}
                          >
                            {product.isActive ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="border-b border-zinc-950/5 px-4 py-3 text-right dark:border-white/5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProduct.mutate({
                                orgId,
                                productId: product.id,
                              });
                            }}
                            disabled={deleteProduct.isPending}
                            className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-950/5 pt-4 dark:border-white/5">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing{" "}
                <span className="font-medium text-zinc-950 dark:text-white">
                  {(page - 1) * pageSize + 1}
                </span>
                –
                <span className="font-medium text-zinc-950 dark:text-white">
                  {Math.min(page * pageSize, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-950 dark:text-white">
                  {total.toLocaleString()}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-zinc-950/10 px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-zinc-950/[2.5%] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page >= totalPages}
                  className="rounded-lg border border-zinc-950/10 px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-zinc-950/[2.5%] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
