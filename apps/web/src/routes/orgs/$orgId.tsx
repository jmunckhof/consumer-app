import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/orgs/$orgId")({
  component: () => <Outlet />,
});
