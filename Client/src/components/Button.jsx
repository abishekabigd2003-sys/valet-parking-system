import { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const Button = forwardRef(({ className, variant = 'primary', children, ...props }, ref) => {
  const variants = {
    primary: 'bg-primary text-gray-900 hover:bg-primary-dark font-semibold',
    secondary: 'bg-themeBg-paper text-themeText hover:bg-themeBorder border border-themeBorder',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50',
    ghost: 'hover:bg-themeBg-paper text-themeText-secondary hover:text-themeText',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
