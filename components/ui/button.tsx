import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Bouton primaire : encre sur chaux, hover inversé
        default:
          'border-encre bg-encre text-chaux hover:bg-transparent hover:text-encre',
        // Variante pour fonds sombres (hero) : chaux sur encre, hover inversé
        onDark:
          'border-chaux bg-chaux text-encre hover:bg-transparent hover:text-chaux',
        outline:
          'border-encre bg-transparent text-encre hover:bg-encre hover:text-chaux',
        outlineOnDark:
          'border-chaux/40 bg-transparent text-chaux hover:border-chaux hover:bg-chaux hover:text-encre',
        ghost:
          'border-transparent bg-transparent text-encre hover:bg-encre/5',
        link: 'border-transparent text-encre underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
