import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader, PageSection } from "../../../components/page";
import { Field, FieldGroup } from "../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/theme")({
  component: ThemePage,
});

function ThemePage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: apps, isLoading } = useQuery(
    trpc.app.list.queryOptions({ orgId })
  );

  // Use the first app's config for theming
  const app = apps?.[0];
  const config = (app?.config as any) ?? {};

  const [primaryColor, setPrimaryColor] = useState(
    config?.theme?.primaryColor ?? "#000000"
  );
  const [accentColor, setAccentColor] = useState(
    config?.theme?.accentColor ?? "#3b82f6"
  );
  const [darkMode, setDarkMode] = useState(
    config?.theme?.darkMode ?? false
  );
  const [cart, setCart] = useState(config?.features?.cart ?? true);
  const [wishlist, setWishlist] = useState(
    config?.features?.wishlist ?? false
  );
  const [reviews, setReviews] = useState(
    config?.features?.reviews ?? false
  );

  useEffect(() => {
    if (config?.theme) {
      setPrimaryColor(config.theme.primaryColor ?? "#000000");
      setAccentColor(config.theme.accentColor ?? "#3b82f6");
      setDarkMode(config.theme.darkMode ?? false);
    }
    if (config?.features) {
      setCart(config.features.cart ?? true);
      setWishlist(config.features.wishlist ?? false);
      setReviews(config.features.reviews ?? false);
    }
  }, [app?.id]);

  const updateApp = useMutation(
    trpc.app.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.app.list.queryKey({ orgId }),
        });
      },
    })
  );

  function handleSave() {
    if (!app) return;
    updateApp.mutate({
      orgId,
      appId: app.id,
      data: {
        config: {
          theme: { primaryColor, accentColor, darkMode },
          features: { cart, wishlist, reviews },
        },
      },
    });
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }

  if (!app) {
    return (
      <>
        <PageHeader
          title="Theme & Branding"
          description="Create an app first to configure its theme."
        />
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            No app found. Create an app in the Apps section first.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Theme & Branding"
        description={`Customize the look and feel of "${app.name}".`}
        actions={
          <button
            onClick={handleSave}
            disabled={updateApp.isPending}
            className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {updateApp.isPending ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <PageSection
        title="Colors"
        description="Set the primary and accent colors for the mobile app."
      >
        <FieldGroup>
          <Field label="Primary Color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border border-zinc-950/10 p-0.5 dark:border-white/10"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-28 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </div>
          </Field>
          <Field label="Accent Color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border border-zinc-950/10 p-0.5 dark:border-white/10"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-28 rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
              />
            </div>
          </Field>
        </FieldGroup>
      </PageSection>

      <PageSection
        title="Appearance"
        description="Control the overall app appearance."
      >
        <FieldGroup>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
            />
            <span className="text-sm/6 font-medium text-zinc-950 dark:text-white">
              Enable dark mode by default
            </span>
          </label>
        </FieldGroup>
      </PageSection>

      <PageSection
        title="Features"
        description="Toggle features available in the consumer app."
      >
        <FieldGroup>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={cart}
              onChange={(e) => setCart(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
            />
            <span className="text-sm/6 font-medium text-zinc-950 dark:text-white">
              Shopping Cart
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={wishlist}
              onChange={(e) => setWishlist(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
            />
            <span className="text-sm/6 font-medium text-zinc-950 dark:text-white">
              Wishlist
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={reviews}
              onChange={(e) => setReviews(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
            />
            <span className="text-sm/6 font-medium text-zinc-950 dark:text-white">
              Product Reviews
            </span>
          </label>
        </FieldGroup>
      </PageSection>

      {/* Preview */}
      <div className="mt-8">
        <h2 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
          Preview
        </h2>
        <div
          className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700"
          style={{
            background: darkMode ? "#18181b" : "#ffffff",
            color: darkMode ? "#ffffff" : "#09090b",
          }}
        >
          {/* Fake app header */}
          <div
            className="px-6 py-4"
            style={{ backgroundColor: primaryColor, color: "#ffffff" }}
          >
            <div className="text-lg font-bold">Store Name</div>
            <div className="text-sm opacity-75">Welcome back!</div>
          </div>
          {/* Fake product card */}
          <div className="p-6">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="h-32 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-3 font-medium">Sample Product</div>
              <div className="mt-1 text-sm opacity-60">$29.99</div>
              <button
                className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {cart ? "Add to Cart" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
