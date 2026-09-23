"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        destructive: "bg-destructive",
        success: "bg-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof progressVariants> & { value?: number }
>(({ className, variant, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    className={progressVariants({ variant, className })}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all duration-1000"
      style={{ width: `${value}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress, progressVariants }
