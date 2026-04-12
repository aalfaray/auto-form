import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = cva(
  'font-head transition-all outline-hidden cursor-pointer duration-200 font-medium flex items-center',
  {
    variants: {
      variant: {
        default:
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none bg-primary text-primary-foreground border-2 border-black transition hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] hover:bg-primary-hover',
        secondary:
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none bg-secondary text-secondary-foreground border-2 border-black transition hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] hover:bg-secondary-hover',
        outline:
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none bg-transparent border-2 border-black transition hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]',
        link: 'bg-transparent hover:underline',
        ghost: 'bg-transparent hover:bg-accent',
      },
      size: {
        sm: 'px-3 py-1 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-6 py-2 text-sm',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      size = 'md',
      className = '',
      variant = 'default',
      asChild = false,
      ...props
    }: IButtonProps,
    forwardedRef
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={forwardedRef}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
