import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-400 text-graphite-950 hover:bg-gold-300 active:bg-gold-500",
        whatsapp:
          "bg-whatsapp text-graphite-950 hover:bg-[#1fbe5b] active:bg-whatsapp-dark active:text-white",
        outline:
          "border border-graphite-600 bg-transparent text-ink-100 hover:border-gold-400 hover:text-gold-200",
        ghost: "bg-transparent text-ink-200 hover:bg-graphite-800 hover:text-ink-50",
        danger: "bg-danger text-white hover:brightness-110",
        subtle: "bg-graphite-800 text-ink-100 hover:bg-graphite-700",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-11 rounded-md px-5 text-sm",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-11 w-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

/** Anchor styled as a button. Use for links and external actions. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
ButtonLink.displayName = "ButtonLink";

export { buttonVariants };
