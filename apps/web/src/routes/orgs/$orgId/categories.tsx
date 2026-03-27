import { createFileRoute } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader, EmptyState } from "../../../components/page";
import { Field, FieldGroup } from "../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery(
    trpc.category.list.queryOptions({ orgId })
  );

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const createCategory = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.list.queryKey({ orgId }),
        });
        setName("");
        setSlug("");
        setDescription("");
        setImageUrl("");
        setShowForm(false);
      },
    })
  );

  const deleteCategory = useMutation(
    trpc.category.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.list.queryKey({ orgId }),
        });
      },
    })
  );

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize products into categories for browsing in the consumer app."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {showForm ? "Cancel" : "New Category"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCategory.mutate({
              orgId,
              data: {
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                description: description || undefined,
                imageUrl: imageUrl || undefined,
              },
            });
          }}
          className="mt-8 rounded-lg border border-zinc-950/10 p-6 dark:border-white/10"
        >
          <h3 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
            New Category
          </h3>
          <div className="mt-4">
            <FieldGroup>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "")
                        );
                      }
                    }}
                    required
                    placeholder="T-Shirts"
                    className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                  />
                </Field>
                <Field label="Slug" description="URL-friendly identifier.">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="t-shirts"
                    className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 font-mono text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                  />
                </Field>
              </div>
              <Field label="Description" description="Optional description shown in the app.">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Browse our latest collection..."
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field label="Image URL" description="Hero image for the category.">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/category.jpg"
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
            </FieldGroup>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-zinc-950/10 px-3 py-2 text-sm/6 font-semibold text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              {createCategory.isPending ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {categories?.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-8">
                <path
                  fillRule="evenodd"
                  d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            title="No categories yet"
            description="Create categories to organize your product catalog."
            action={
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800"
              >
                New Category
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="group relative rounded-lg border border-zinc-950/10 p-4 hover:border-zinc-950/20 dark:border-white/10 dark:hover:border-white/20"
              >
                {cat.imageUrl && (
                  <div className="mb-3 h-32 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!cat.imageUrl && (
                  <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-8 text-zinc-300 dark:text-zinc-600">
                      <path
                        fillRule="evenodd"
                        d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81V14.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.06l-2.22-2.22a.75.75 0 0 0-1.06 0L9.72 12.97a.75.75 0 0 1-1.06 0l-1.72-1.72a.75.75 0 0 0-1.06 0L2.5 11.06Zm12-1.06a2.25 2.25 0 0 1 3 0V5.25a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v4.56l2.22-2.22a2.25 2.25 0 0 1 3.18 0l1.72 1.72 2.16-2.16Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs/5 text-zinc-500 dark:text-zinc-400">
                      /{cat.slug}
                    </p>
                    {cat.description && (
                      <p className="mt-1 text-xs/5 text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      deleteCategory.mutate({ orgId, categoryId: cat.id })
                    }
                    disabled={deleteCategory.isPending}
                    className="text-xs font-medium text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
