
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className, ...props }: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cn("text-3xl font-bold tracking-tight", className)} {...props}>
    {children}
  </h1>
);

export const Subheading = ({ children, className, ...props }: TypographyProps & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const Text = ({ children, className, ...props }: TypographyProps & React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export const Caption = ({ children, className, ...props }: TypographyProps & React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("text-xs text-muted-foreground", className)} {...props}>
    {children}
  </span>
);
