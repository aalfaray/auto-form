import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React, { HTMLAttributes } from 'react'

const badgeVariants = cva('font-semibold border-2 border-black', {
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground',
      outline: 'outline-2 outline-foreground text-foreground',
      solid: 'bg-foreground text-background',
      surface: 'outline-2 bg-primary text-primary-foreground',
    },
    size: {
      sm: 'px-2 py-0.5 text-sm',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1 text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

interface ButtonProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({
  children,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}
