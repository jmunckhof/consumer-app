import "../styles.css";
import { useState } from "react";
import {
  createRootRoute,
  Link,
  Outlet,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { TRPCProvider } from "../utils/trpc";
import { authClient } from "../utils/auth-client";
import type { AppRouter } from "@repo/trpc";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Admin Dashboard" },
    ],
  }),
});

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
          transformer: superjson,
          fetch: (url, opts) =>
            fetch(url, { ...opts, credentials: "include" }),
        }),
      ],
    })
  );

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <QueryClientProvider client={queryClient}>
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            <AuthGate />
            <ReactQueryDevtools buttonPosition="bottom-right" />
          </TRPCProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function AuthGate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const isLoginPage = location.pathname === "/login";

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!session && !isLoginPage) {
    navigate({ to: "/login" });
    return null;
  }

  if (session && isLoginPage) {
    navigate({ to: "/" });
    return null;
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-blue-600 [&.active]:text-blue-600">
            Dashboard
          </Link>
          <Link to="/orgs" className="text-sm font-medium hover:text-blue-600 [&.active]:text-blue-600">
            Organizations
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session?.user?.name}</span>
          <button
            onClick={async () => {
              await authClient.signOut();
              navigate({ to: "/login" });
            }}
            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </>
  );
}
