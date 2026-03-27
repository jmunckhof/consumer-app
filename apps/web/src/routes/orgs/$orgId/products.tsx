import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/orgs/$orgId/products")({
  component: () => <Outlet />,
});
