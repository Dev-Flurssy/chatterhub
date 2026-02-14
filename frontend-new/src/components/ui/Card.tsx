import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, gradient = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl shadow-sm border',
          gradient 
            ? 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 dark:border-secondary/20'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          hover && 'hover:shadow-lg transition-shadow duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('p-6 border-b border-gray-200 dark:border-gray-700', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('p-6', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('p-6 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
