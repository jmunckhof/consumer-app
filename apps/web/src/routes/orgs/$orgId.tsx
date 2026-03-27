import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../utils/trpc";

export const Route = createFileRoute("/orgs/$orgId")({
  component: OrgDetailPage,
});

function OrgDetailPage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: org, isLoading: orgLoading } = useQuery(
    trpc.org.byId.queryOptions({ orgId })
  );
  const { data: apps, isLoading: appsLoading } = useQuery(
    trpc.app.list.queryOptions({ orgId })
  );
  const { data: products, isLoading: productsLoading } = useQuery(
    trpc.product.list.queryOptions({ orgId })
  );

  const [appName, setAppName] = useState("");
  const createApp = useMutation(
    trpc.app.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.app.list.queryKey({ orgId }),
        });
        setAppName("");
      },
    })
  );

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const createProduct = useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.list.queryKey({ orgId }),
        });
        setProductName("");
        setProductPrice("");
      },
    })
  );

  if (orgLoading) return <p className="text-gray-500">Loading...</p>;
  if (!org) return <p className="text-red-500">Org not found</p>;

  return (
    <div>
      <Link to="/orgs" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Back to orgs
      </Link>
      <h1 className="text-2xl font-bold mt-2">{org.name}</h1>
      <p className="text-sm text-gray-400 mb-8">Slug: {org.slug}</p>

      {/* Apps */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Apps</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createApp.mutate({ orgId, data: { name: appName } });
          }}
          className="flex items-center gap-3 mb-4"
        >
          <input
            placeholder="App name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createApp.isPending}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            Add App
          </button>
        </form>
        {appsLoading ? (
          <p className="text-gray-500 text-sm">Loading apps...</p>
        ) : apps?.length === 0 ? (
          <p className="text-gray-500 text-sm">No apps yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {apps?.map((app) => (
              <div key={app.id} className="px-4 py-3 bg-white flex items-center justify-between">
                <span className="font-medium">{app.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createProduct.mutate({
              orgId,
              data: {
                name: productName,
                priceInCents: Math.round(parseFloat(productPrice) * 100),
              },
            });
          }}
          className="flex items-center gap-3 mb-4"
        >
          <input
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Price (e.g. 9.99)"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            type="number"
            step="0.01"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            Add Product
          </button>
        </form>
        {productsLoading ? (
          <p className="text-gray-500 text-sm">Loading products...</p>
        ) : products?.length === 0 ? (
          <p className="text-gray-500 text-sm">No products yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {products?.map((product) => (
              <div key={product.id} className="px-4 py-3 bg-white flex items-center justify-between">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-gray-500">
                  ${(product.priceInCents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
