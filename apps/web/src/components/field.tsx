import type { ReactNode } from "react";

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm/5 font-medium text-zinc-950 dark:text-white">
        {label}
      </label>
      {description && (
        <p className="text-sm/5 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function DescriptionList({ children }: { children: ReactNode }) {
  return (
    <dl className="divide-y divide-zinc-950/5 dark:divide-white/5">
      {children}
    </dl>
  );
}

export function DescriptionItem({
  term,
  detail,
}: {
  term: string;
  detail: ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-sm/6 font-medium text-zinc-500 dark:text-zinc-400">
        {term}
      </dt>
      <dd className="text-sm/6 text-zinc-950 dark:text-white">{detail}</dd>
    </div>
  );
}
