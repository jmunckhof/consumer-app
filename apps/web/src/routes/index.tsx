import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Manage your organizations, apps, and products.
      </p>
    </div>
  );
}
