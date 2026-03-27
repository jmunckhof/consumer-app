import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "../../utils/trpc";

export const Route = createFileRoute("/orgs/")({
  component: OrgsPage,
});

function OrgsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: orgs, isLoading } = useQuery(trpc.org.list.queryOptions());

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const createOrg = useMutation(
    trpc.org.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.org.list.queryKey() });
        setName("");
        setSlug("");
      },
    })
  );

  const deleteOrg = useMutation(
    trpc.org.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.org.list.queryKey() });
      },
    })
  );

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organizations</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createOrg.mutate({ name, slug });
        }}
        className="flex items-center gap-3 mb-8"
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={createOrg.isPending}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {createOrg.isPending ? "Creating..." : "Create Org"}
        </button>
      </form>

      {orgs?.length === 0 && (
        <p className="text-gray-500">No organizations yet.</p>
      )}

      <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {orgs?.map((org) => (
          <div
            key={org.id}
            className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50"
          >
            <div>
              <Link
                to="/orgs/$orgId"
                params={{ orgId: org.id }}
                className="font-medium text-blue-600 hover:underline"
              >
                {org.name}
              </Link>
              <span className="ml-2 text-sm text-gray-400">{org.slug}</span>
            </div>
            <button
              onClick={() => deleteOrg.mutate({ orgId: org.id })}
              disabled={deleteOrg.isPending}
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
