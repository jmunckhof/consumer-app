import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <div>
        <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 py-8 border-b border-zinc-950/5 last:border-b-0 dark:border-white/5">
      <div>
        <h2 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
      {icon && (
        <div className="mb-4 text-zinc-400 dark:text-zinc-500">{icon}</div>
      )}
      <h3 className="text-sm/6 font-semibold text-zinc-950 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
