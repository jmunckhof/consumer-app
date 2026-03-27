import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 sm:[&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border-zinc-950/10 text-zinc-950 hover:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:hover:bg-white/5",
        secondary:
          "border-transparent bg-white text-zinc-950 shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
        ghost:
          "border-transparent text-zinc-950 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/10",
        link: "border-transparent text-zinc-950 underline underline-offset-4 decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white",
      },
      size: {
        default: "",
        sm: "px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.5)-1px)] sm:px-[calc(--spacing(2)-1px)] sm:py-[calc(--spacing(1)-1px)] text-sm/6 sm:text-xs/5",
        lg: "px-[calc(--spacing(4)-1px)] py-[calc(--spacing(3)-1px)] sm:px-[calc(--spacing(3.5)-1px)] sm:py-[calc(--spacing(2.5)-1px)]",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
