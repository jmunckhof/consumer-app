import type { ReactNode } from "react";

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}

export function Stat({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change?: string;
}) {
  return (
    <div>
      <div className="text-sm/6 font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl/8 font-semibold text-zinc-950 sm:text-2xl/8 dark:text-white">
          {value}
        </div>
        {change && (
          <span
            className={`text-sm/6 font-medium ${
              change.startsWith("+")
                ? "text-green-600 dark:text-green-400"
                : change.startsWith("-")
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-500"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
