import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTRPC } from "../../../../utils/trpc";
import { PageHeader } from "../../../../components/page";
import { Field, FieldGroup } from "../../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/stores/$storeId")({
  component: EditStorePage,
});

function EditStorePage() {
  const { orgId, storeId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: store, isLoading } = useQuery(
    trpc.store.byId.queryOptions({ orgId, storeId })
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("NL");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (store) {
      setName(store.name);
      setSlug(store.slug);
      setAddress(store.address);
      setCity(store.city);
      setState(store.state ?? "");
      setPostalCode(store.postalCode ?? "");
      setCountry(store.country);
      setPhone(store.phone ?? "");
      setEmail(store.email ?? "");
      setWebsite(store.website ?? "");
      setIsActive(store.isActive);
    }
  }, [store]);

  const updateStore = useMutation(
    trpc.store.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.store.byId.queryKey({ orgId, storeId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey({ orgId }),
        });
        navigate({ to: "/orgs/$orgId/stores", params: { orgId } });
      },
    })
  );

  const deleteStore = useMutation(
    trpc.store.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey({ orgId }),
        });
        navigate({ to: "/orgs/$orgId/stores", params: { orgId } });
      },
    })
  );

  if (isLoading) return <p className="text-sm text-zinc-500">Loading...</p>;
  if (!store) return <p className="text-sm text-red-500">Store not found.</p>;

  return (
    <>
      <PageHeader
        title={`Edit: ${store.name}`}
        description="Update store location details."
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (window.confirm(`Delete "${store.name}"? This cannot be undone.`)) {
                  deleteStore.mutate({ orgId, storeId });
                }
              }}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm/6 font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Delete
            </button>
            <button
              onClick={() => {
                updateStore.mutate({
                  orgId,
                  storeId,
                  data: {
                    name,
                    slug,
                    address,
                    city,
                    state: state || undefined,
                    postalCode: postalCode || undefined,
                    country: country || undefined,
                    phone: phone || undefined,
                    email: email || undefined,
                    website: website || undefined,
                    isActive,
                  },
                });
              }}
              disabled={updateStore.isPending}
              className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              {updateStore.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Store Name">
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
            </div>

            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-4">
              <Field label="City">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field label="State / Province">
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field label="Postal Code">
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field label="Country">
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Phone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field label="Email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
            </div>

            <Field label="Website">
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
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
              Inactive stores are hidden from the consumer app.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">Info</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Created</dt>
                <dd className="text-zinc-950 dark:text-white">
                  {new Date(store.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Updated</dt>
                <dd className="text-zinc-950 dark:text-white">
                  {new Date(store.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">ID</dt>
                <dd className="font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
                  {store.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
