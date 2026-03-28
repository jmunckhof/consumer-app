import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../../../../utils/trpc";
import { PageHeader, EmptyState } from "../../../../components/page";

export const Route = createFileRoute("/orgs/$orgId/stores/")({
  component: StoresPage,
});

function StoresPage() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: stores, isLoading } = useQuery(
    trpc.store.list.queryOptions({ orgId })
  );

  const deleteStore = useMutation(
    trpc.store.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey({ orgId }),
        });
      },
    })
  );

  if (isLoading) return <p className="text-sm text-zinc-500">Loading...</p>;

  return (
    <>
      <PageHeader
        title="Stores"
        description="Manage physical store locations shown in the consumer app."
        actions={
          <Link
            to="/orgs/$orgId/stores/new"
            params={{ orgId }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            Add Store
          </Link>
        }
      />

      <div className="mt-8">
        {stores?.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-8">
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            title="No store locations yet"
            description="Add your physical store locations."
            action={
              <Link
                to="/orgs/$orgId/stores/new"
                params={{ orgId }}
                className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800"
              >
                Add Store
              </Link>
            }
          />
        ) : (
          <table className="min-w-full text-left text-sm/6">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">Store</th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">Address</th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">Contact</th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">Status</th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium text-right dark:border-white/10 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {stores?.map((store) => (
                <tr
                  key={store.id}
                  onClick={() =>
                    navigate({
                      to: "/orgs/$orgId/stores/$storeId",
                      params: { orgId, storeId: store.id },
                    })
                  }
                  className="cursor-pointer hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]"
                >
                  <td className="border-b border-zinc-950/5 px-4 py-4 dark:border-white/5">
                    <div className="font-medium text-zinc-950 dark:text-white">{store.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">/{store.slug}</div>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    <div>{store.address}</div>
                    <div>{store.postalCode} {store.city}, {store.country}</div>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    {store.phone && <div>{store.phone}</div>}
                    {store.email && <div>{store.email}</div>}
                    {!store.phone && !store.email && "—"}
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 dark:border-white/5">
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs/5 font-medium ${store.isActive ? "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400"}`}>
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-right dark:border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${store.name}"? This cannot be undone.`)) {
                          deleteStore.mutate({ orgId, storeId: store.id });
                        }
                      }}
                      disabled={deleteStore.isPending}
                      className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
