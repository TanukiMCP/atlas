import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={`overflow-auto ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';