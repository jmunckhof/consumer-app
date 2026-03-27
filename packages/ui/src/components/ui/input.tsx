import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent px-3 py-1 text-base/6 shadow-sm transition-colors placeholder:text-zinc-500 hover:border-zinc-950/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm/6 dark:border-white/10 dark:text-white dark:hover:border-white/20 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
