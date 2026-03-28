import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../../../utils/trpc";
import { PageHeader } from "../../../../components/page";
import { Field, FieldGroup } from "../../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/stores/new")({
  component: NewStorePage,
});

function NewStorePage() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("NL");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const createStore = useMutation(
    trpc.store.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.store.list.queryKey({ orgId }),
        });
        navigate({ to: "/orgs/$orgId/stores", params: { orgId } });
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
        title="Add Store"
        description="Create a new physical store location."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createStore.mutate({
            orgId,
            data: {
              name,
              slug: slug || autoSlug(name),
              address,
              city,
              state: state || undefined,
              postalCode: postalCode || undefined,
              country: country || undefined,
              phone: phone || undefined,
              email: email || undefined,
              website: website || undefined,
            },
          });
        }}
        className="mt-8 max-w-2xl"
      >
        <FieldGroup>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Store Name">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(autoSlug(e.target.value));
                }}
                required
                placeholder="Amsterdam Centrum"
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
                placeholder="amsterdam-centrum"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
          </div>

          <Field label="Address">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Kalverstraat 1"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-4">
            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Amsterdam"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
            <Field label="State / Province">
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Noord-Holland"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
            <Field label="Postal Code">
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="1012 AB"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
            <Field label="Country">
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="NL"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 20 123 4567"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="store@example.com"
                className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </Field>
          </div>

          <Field label="Website">
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>
        </FieldGroup>

        {createStore.isError && (
          <p className="mt-4 text-sm text-red-600">
            Failed to create store. Check that the slug is unique.
          </p>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-950/5 pt-6 dark:border-white/5">
          <button
            type="button"
            onClick={() => navigate({ to: "/orgs/$orgId/stores", params: { orgId } })}
            className="rounded-lg border border-zinc-950/10 px-3 py-2 text-sm/6 font-semibold text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createStore.isPending}
            className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {createStore.isPending ? "Creating..." : "Create Store"}
          </button>
        </div>
      </form>
    </>
  );
}
