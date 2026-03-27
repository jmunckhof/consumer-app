import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../../../utils/trpc";
import { PageHeader } from "../../../components/page";
import { StatGrid, Stat } from "../../../components/stats";
import {
  DescriptionList,
  DescriptionItem,
} from "../../../components/field";

export const Route = createFileRoute("/orgs/$orgId/")({
  component: OrgOverview,
});

function OrgOverview() {
  const { orgId } = Route.useParams();
  const trpc = useTRPC();

  const { data: org, isLoading } = useQuery(
    trpc.org.byId.queryOptions({ orgId })
  );
  const { data: apps } = useQuery(trpc.app.list.queryOptions({ orgId }));
  const { data: productData } = useQuery(
    trpc.product.list.queryOptions({ orgId, page: 1, pageSize: 1 })
  );

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading...</p>;
  }
  if (!org) {
    return <p className="text-sm text-red-500">Organization not found.</p>;
  }

  const liveApps = apps?.filter((a) => a.status === "live").length ?? 0;
  const totalProducts = productData?.total ?? 0;

  return (
    <>
      <PageHeader
        title={org.name}
        description="Organization overview and quick stats."
      />

      <StatGrid>
        <Stat title="Total Apps" value={String(apps?.length ?? 0)} />
        <Stat title="Live Apps" value={String(liveApps)} />
        <Stat title="Products" value={totalProducts.toLocaleString()} />
      </StatGrid>

      <div className="mt-10">
        <h2 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
          Details
        </h2>
        <DescriptionList>
          <DescriptionItem term="Name" detail={org.name} />
          <DescriptionItem term="Slug" detail={org.slug} />
          <DescriptionItem
            term="Status"
            detail={
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs/5 font-medium ${
                  org.isActive
                    ? "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {org.isActive ? "Active" : "Inactive"}
              </span>
            }
          />
          <DescriptionItem
            term="Created"
            detail={new Date(org.createdAt).toLocaleDateString()}
          />
          {org.logoUrl && (
            <DescriptionItem term="Logo URL" detail={org.logoUrl} />
          )}
        </DescriptionList>
      </div>
    </>
  );
}
