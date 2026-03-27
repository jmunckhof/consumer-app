import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader } from "../../../components/page";
import { SectionConfigForm } from "../../../components/sdui/section-forms";
import type { SectionConfig, SectionType, AppConfig } from "@repo/validators";
import { SECTION_TYPES, SECTION_TYPE_LABELS } from "@repo/validators";

export const Route = createFileRoute("/orgs/$orgId/page-builder")({
  component: PageBuilderPage,
});

const DEFAULT_CONFIGS: Record<SectionType, () => SectionConfig> = {
  "store-header": () => ({
    type: "store-header",
    showStoreName: true,
    showLogo: true,
    showSearch: false,
  }),
  "hero-banner": () => ({
    type: "hero-banner",
    imageUrl: "https://placehold.co/800x400",
    title: "Welcome",
  }),
  "category-grid": () => ({
    type: "category-grid",
    title: "Shop by Category",
  }),
  "product-carousel": () => ({
    type: "product-carousel",
    title: "Featured Products",
  }),
  "product-grid": () => ({
    type: "product-grid",
    title: "All Products",
  }),
  "text-block": () => ({
    type: "text-block",
    body: "Enter your text here.",
  }),
  "image-banner": () => ({
    type: "image-banner",
    imageUrl: "https://placehold.co/800x200",
  }),
};

function PageBuilderPage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: apps, isLoading } = useQuery(
    trpc.app.list.queryOptions({ orgId })
  );

  const app = apps?.[0];
  const config = (app?.config as AppConfig) ?? {};
  const savedSections = config?.pages?.home?.sections ?? [];

  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSections(savedSections);
    setDirty(false);
  }, [app?.id]);

  const updateApp = useMutation(
    trpc.app.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.app.list.queryKey({ orgId }),
        });
        setDirty(false);
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
          ...config,
          pages: { home: { sections } },
        },
      },
    });
  }

  function addSection(type: SectionType) {
    const newSection = DEFAULT_CONFIGS[type]();
    setSections([...sections, newSection]);
    setExpandedIndex(sections.length);
    setShowPicker(false);
    setDirty(true);
  }

  function updateSection(index: number, value: SectionConfig) {
    const next = [...sections];
    next[index] = value;
    setSections(next);
    setDirty(true);
  }

  function removeSection(index: number) {
    setSections(sections.filter((_, i) => i !== index));
    setExpandedIndex(null);
    setDirty(true);
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    setExpandedIndex(target);
    setDirty(true);
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }

  if (!app) {
    return (
      <>
        <PageHeader
          title="Page Builder"
          description="Create an app first to configure its home page."
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
        title="Page Builder"
        description={`Configure the home page for "${app.name}". Changes are applied when you save.`}
        actions={
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={updateApp.isPending || !dirty}
              className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              {updateApp.isPending ? "Saving..." : "Save Page"}
            </button>
          </div>
        }
      />

      <div className="mt-8 space-y-3">
        {sections.length === 0 && !showPicker && (
          <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No sections yet. Add sections to build the home page.
            </p>
          </div>
        )}

        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-950/10 dark:border-white/10"
          >
            {/* Section header */}
            <div
              className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]"
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-zinc-600/10 px-1.5 py-0.5 text-xs/5 font-medium text-zinc-700 dark:bg-white/5 dark:text-zinc-400">
                  {index + 1}
                </span>
                <span className="text-sm/6 font-medium text-zinc-950 dark:text-white">
                  {SECTION_TYPE_LABELS[section.type]}
                </span>
                {"title" in section && section.title && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    — {section.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(index, -1);
                  }}
                  disabled={index === 0}
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-300"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(index, 1);
                  }}
                  disabled={index === sections.length - 1}
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-300"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(index);
                  }}
                  className="ml-2 rounded p-1 text-red-400 hover:text-red-600"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Expanded config form */}
            {expandedIndex === index && (
              <div className="border-t border-zinc-950/5 px-4 py-4 dark:border-white/5">
                <SectionConfigForm
                  value={section}
                  onChange={(v) => updateSection(index, v)}
                  orgId={orgId}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add section */}
      <div className="mt-4">
        {showPicker ? (
          <div className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white mb-3">
              Choose a section type
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="rounded-lg border border-zinc-950/10 px-3 py-3 text-left text-sm/6 font-medium text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  {SECTION_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPicker(false)}
              className="mt-3 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full rounded-lg border border-dashed border-zinc-300 py-3 text-sm/6 font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
          >
            + Add Section
          </button>
        )}
      </div>
    </>
  );
}
