import { cn } from '../utils/cn';

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn("glass p-6 rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
};
