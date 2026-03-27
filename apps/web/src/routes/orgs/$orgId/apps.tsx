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

export const Route = createFileRoute("/orgs/$orgId/apps")({
  component: AppsPage,
});

function AppsPage() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: apps, isLoading } = useQuery(
    trpc.app.list.queryOptions({ orgId })
  );

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [bundleId, setBundleId] = useState("");

  const createApp = useMutation(
    trpc.app.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.app.list.queryKey({ orgId }),
        });
        setName("");
        setBundleId("");
        setShowForm(false);
      },
    })
  );

  const deleteApp = useMutation(
    trpc.app.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.app.list.queryKey({ orgId }),
        });
      },
    })
  );

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }

  const statusColor: Record<string, string> = {
    draft:
      "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400",
    building:
      "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
    live: "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    disabled:
      "bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <>
      <PageHeader
        title="Apps"
        description="Manage your white-label mobile app configurations."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          >
            {showForm ? "Cancel" : "New App"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createApp.mutate({
              orgId,
              data: {
                name,
                bundleId: bundleId || undefined,
              },
            });
          }}
          className="mt-8 rounded-lg border border-zinc-950/10 p-6 dark:border-white/10"
        >
          <h3 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
            Create New App
          </h3>
          <div className="mt-4">
            <FieldGroup>
              <Field label="App Name" description="The display name for this app.">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="My Store App"
                  className="w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-white/10 dark:text-white"
                />
              </Field>
              <Field
                label="Bundle ID"
                description="Reverse domain notation (e.g. com.store.app). Optional."
              >
                <input
                  value={bundleId}
                  onChange={(e) => setBundleId(e.target.value)}
                  placeholder="com.example.myapp"
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
              disabled={createApp.isPending}
              className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              {createApp.isPending ? "Creating..." : "Create App"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {apps?.length === 0 ? (
          <EmptyState
            icon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-8"
              >
                <path
                  fillRule="evenodd"
                  d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM2.5 9v5.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V9h-15Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            title="No apps yet"
            description="Create your first app configuration to get started."
            action={
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg border border-transparent bg-zinc-900 px-3 py-2 text-sm/6 font-semibold text-white hover:bg-zinc-800"
              >
                New App
              </button>
            }
          />
        ) : (
          <table className="min-w-full text-left text-sm/6">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                  Name
                </th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                  Bundle ID
                </th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium dark:border-white/10">
                  Status
                </th>
                <th className="border-b border-zinc-950/10 px-4 py-2 font-medium text-right dark:border-white/10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apps?.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]"
                >
                  <td className="border-b border-zinc-950/5 px-4 py-4 font-medium text-zinc-950 dark:border-white/5 dark:text-white">
                    {app.name}
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    {app.bundleId ?? "—"}
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 dark:border-white/5">
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs/5 font-medium ${statusColor[app.status] ?? statusColor.draft}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="border-b border-zinc-950/5 px-4 py-4 text-right dark:border-white/5">
                    <button
                      onClick={() =>
                        deleteApp.mutate({ orgId, appId: app.id })
                      }
                      disabled={deleteApp.isPending}
                      className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
