import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader, PageSection } from "../../../components/page";
import { Field, FieldGroup } from "../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useQuery(
    trpc.org.byId.queryOptions({ orgId })
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    if (org) {
      setName(org.name);
      setSlug(org.slug);
      setLogoUrl(org.logoUrl ?? "");
      setCurrency(org.currency ?? "EUR");
    }
  }, [org]);

  const updateOrg = useMutation(
    trpc.org.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.org.byId.queryKey({ orgId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.org.list.queryKey(),
        });
      },
    })
  );

  const deleteOrg = useMutation(
    trpc.org.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.org.list.queryKey(),
        });
        navigate({ to: "/orgs" });
      },
    })
  );

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }
  if (!org) {
    return <p className="text-sm text-red-500">Organization not found.</p>;
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage organization details and configuration."
        actions={
          <button
            onClick={() => {
              updateOrg.mutate({
                orgId,
                data: {
                  name,
                  slug,
                  logoUrl: logoUrl || undefined,
                  currency,
                },
              });
            }}
            disabled={updateOrg.isPending}
            className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {updateOrg.isPending ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <PageSection
        title="General"
        description="Basic organization information."
      >
        <FieldGroup>
          <Field label="Organization Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>
          <Field
            label="Slug"
            description="URL-friendly identifier. Lowercase, hyphens only."
          >
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>
          <Field label="Logo URL" description="Optional URL to the organization logo.">
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            />
          </Field>
          <Field label="Currency" description="Currency used for product pricing.">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF</option>
              <option value="SEK">SEK (kr)</option>
              <option value="NOK">NOK (kr)</option>
              <option value="DKK">DKK (kr)</option>
              <option value="PLN">PLN (zł)</option>
              <option value="CZK">CZK (Kč)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="INR">INR (₹)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </Field>
        </FieldGroup>
      </PageSection>

      <PageSection
        title="Danger Zone"
        description="Irreversible actions. Be careful."
      >
        <div className="rounded-lg border border-red-200 p-6 dark:border-red-900/50">
          <h3 className="text-sm/6 font-semibold text-red-600 dark:text-red-400">
            Delete Organization
          </h3>
          <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-400">
            Permanently delete this organization and all its apps, products,
            and consumer data. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${org.name}"? This cannot be undone.`
                )
              ) {
                deleteOrg.mutate({ orgId });
              }
            }}
            disabled={deleteOrg.isPending}
            className="mt-4 rounded-lg border border-transparent bg-red-600 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteOrg.isPending ? "Deleting..." : "Delete Organization"}
          </button>
        </div>
      </PageSection>
    </>
  );
}
