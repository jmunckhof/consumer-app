import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader, EmptyState } from "../../../components/page";
import { Field, FieldGroup } from "../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/stores")({
  component: StoresPage,
});

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

function StoresPage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: storeLocations, isLoading } = useQuery(
    trpc.store.list.queryOptions({ orgId })
  );
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("NL");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const createStore = useMutation(
    trpc.store.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.store.list.queryKey({ orgId }) });
        setName(""); setSlug(""); setAddress(""); setCity("");
        setPostalCode(""); setPhone(""); setEmail("");
        setShowForm(false);
      },
    })
  );

  const deleteStore = useMutation(
    trpc.store.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.store.list.queryKey({ orgId }) });
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {showForm ? "Cancel" : "Add Store"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createStore.mutate({
              orgId,
              data: {
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                address,
                city,
                postalCode: postalCode || undefined,
                country,
                phone: phone || undefined,
                email: email || undefined,
              },
            });
          }}
          className="mt-8 rounded-lg border border-zinc-950/10 p-6 dark:border-white/10"
        >
          <h3 className="text-base/7 font-semibold text-zinc-950 dark:text-white">New Store Location</h3>
          <div className="mt-4">
            <FieldGroup>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Store Name">
                  <input value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} required placeholder="Amsterdam Centrum" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
                <Field label="Slug">
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="amsterdam-centrum" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
              </div>
              <Field label="Address">
                <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Kalverstraat 1" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
              </Field>
              <div className="grid gap-6 sm:grid-cols-3">
                <Field label="City">
                  <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Amsterdam" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
                <Field label="Postal Code">
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1012 AB" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
                <Field label="Country">
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="NL" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Phone">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+31 20 123 4567" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
                <Field label="Email">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="store@example.com" className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white" />
                </Field>
              </div>
            </FieldGroup>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-950/10 px-3 py-2 text-sm/6 font-semibold text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={createStore.isPending} className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500">{createStore.isPending ? "Creating..." : "Add Store"}</button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {storeLocations?.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 20 20" fill="currentColor" className="size-8"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" /></svg>}
            title="No store locations yet"
            description="Add your physical store locations."
            action={<button onClick={() => setShowForm(true)} className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800">Add Store</button>}
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
              {storeLocations?.map((loc) => (
                <tr key={loc.id} className="hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]">
                  <td className="border-b border-zinc-950/5 px-4 py-4 dark:border-white/5">
                    <div className="font-medium text-zinc-950 dark:text-white">{loc.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">/{loc.slug}</div>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    <div>{loc.address}</div>
                    <div>{loc.postalCode} {loc.city}, {loc.country}</div>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    {loc.phone && <div>{loc.phone}</div>}
                    {loc.email && <div>{loc.email}</div>}
                    {!loc.phone && !loc.email && "—"}
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 dark:border-white/5">
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs/5 font-medium ${loc.isActive ? "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400"}`}>
                      {loc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-right dark:border-white/5">
                    <button onClick={() => deleteStore.mutate({ orgId, storeId: loc.id })} disabled={deleteStore.isPending} className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Delete</button>
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
