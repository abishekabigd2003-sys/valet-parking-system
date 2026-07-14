import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-themeText-secondary">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full bg-themeBg-paper border border-themeBorder rounded-lg px-4 py-2.5 text-themeText placeholder:text-themeText-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
