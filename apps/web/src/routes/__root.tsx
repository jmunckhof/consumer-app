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
  useParams,
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
    links: [
      { rel: "preconnect", href: "https://rsms.me/" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
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
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <HeadContent />
      </head>
      <body>
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
      <div className="flex min-h-svh items-center justify-center text-zinc-500">
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
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
        <AppSidebar
          userName={session?.user?.name ?? ""}
          userEmail={session?.user?.email ?? ""}
          onSignOut={async () => {
            await authClient.signOut();
            navigate({ to: "/login" });
          }}
        />
      </div>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function AppSidebar({
  userName,
  userEmail,
  onSignOut,
}: {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  const location = useLocation();

  // Detect if we're inside an org context: /orgs/:orgId/...
  const orgMatch = location.pathname.match(/^\/orgs\/([^/]+)/);
  const orgId = orgMatch?.[1];
  const isOrgContext = !!orgId;

  return (
    <nav className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5">
        {isOrgContext ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3A1.5 1.5 0 0 1 13 3.5H7ZM3 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm/5 font-semibold text-zinc-950 dark:text-white">
                Organization
              </span>
              <Link
                to="/orgs"
                className="text-xs/5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                &larr; Back to all orgs
              </Link>
            </div>
          </div>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-left"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <span className="text-sm font-bold">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm/5 font-semibold text-zinc-950 dark:text-white">
                Consumer App
              </span>
              <span className="text-xs/5 text-zinc-500 dark:text-zinc-400">
                Platform Admin
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        {isOrgContext ? (
          <OrgSidebarBody orgId={orgId!} pathname={location.pathname} />
        ) : (
          <AdminSidebarBody pathname={location.pathname} />
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {userName}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {userEmail}
            </span>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm/5 font-medium text-zinc-950 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/5"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 text-zinc-500">
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Admin sidebar — platform overview
// ---------------------------------------------------------------------------

function AdminSidebarBody({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex flex-col gap-0.5">
        <SidebarHeading>Overview</SidebarHeading>
        <SidebarLink
          to="/"
          current={pathname === "/"}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Dashboard
        </SidebarLink>
        <SidebarLink
          to="/orgs"
          current={pathname === "/orgs" || pathname === "/orgs/"}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Organizations
        </SidebarLink>
      </div>

      <div className="mt-8 flex-1" aria-hidden="true" />

      <div className="flex flex-col gap-0.5">
        <SidebarHeading>Platform</SidebarHeading>
        <SidebarLink
          to="/"
          current={false}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Settings
        </SidebarLink>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Org sidebar — white-label app configuration
// ---------------------------------------------------------------------------

function OrgSidebarBody({
  orgId,
  pathname,
}: {
  orgId: string;
  pathname: string;
}) {
  const base = `/orgs/${orgId}`;

  return (
    <>
      <div className="flex flex-col gap-0.5">
        <SidebarHeading>Configure</SidebarHeading>
        <SidebarLink
          to={base}
          current={pathname === base}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Overview
        </SidebarLink>
        <SidebarLink
          to={`${base}/apps` as any}
          current={pathname.startsWith(`${base}/apps`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM2.5 9v5.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V9h-15Zm0-1.5h15v-2.25a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v2.25Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Apps
        </SidebarLink>
        <SidebarLink
          to={`${base}/products` as any}
          current={pathname.startsWith(`${base}/products`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Products
        </SidebarLink>
        <SidebarLink
          to={`${base}/categories` as any}
          current={pathname.startsWith(`${base}/categories`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Categories
        </SidebarLink>
        <SidebarLink
          to={`${base}/stores` as any}
          current={pathname.startsWith(`${base}/stores`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.822 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373Zm7.49-8.931a.75.75 0 0 1-.112 1.055l-3.5 2.8a.75.75 0 0 1-1.056-.124l-1.5-2a.75.75 0 1 1 1.2-.9l1.012 1.349 2.9-2.32a.75.75 0 0 1 1.056.14Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Stores
        </SidebarLink>
      </div>

      <div className="mt-8 flex flex-col gap-0.5">
        <SidebarHeading>App Settings</SidebarHeading>
        <SidebarLink
          to={`${base}/page-builder` as any}
          current={pathname.startsWith(`${base}/page-builder`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z" />
            </svg>
          }
        >
          Page Builder
        </SidebarLink>
        <SidebarLink
          to={`${base}/theme` as any}
          current={pathname.startsWith(`${base}/theme`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M3.5 2A1.5 1.5 0 0 0 2 3.5v13A1.5 1.5 0 0 0 3.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-13ZM5 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5Zm8 0a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2ZM5 12a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Theme &amp; Branding
        </SidebarLink>
        <SidebarLink
          to={`${base}/settings` as any}
          current={pathname.startsWith(`${base}/settings`)}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Settings
        </SidebarLink>
      </div>

      <div className="mt-8 flex-1" aria-hidden="true" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared sidebar primitives
// ---------------------------------------------------------------------------

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400">
      {children}
    </h3>
  );
}

function SidebarLink({
  to,
  current,
  icon,
  children,
}: {
  to: string;
  current: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="relative">
      {current && (
        <span className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white" />
      )}
      <Link
        to={to}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium sm:py-2 sm:text-sm/5 ${
          current
            ? "text-zinc-950 dark:text-white [&>svg]:text-zinc-950 dark:[&>svg]:text-white"
            : "text-zinc-950 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/5 [&>svg]:text-zinc-500 dark:[&>svg]:text-zinc-400"
        }`}
      >
        {icon}
        <span className="truncate">{children}</span>
      </Link>
    </span>
  );
}
