import { Loader2 } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  ariaLabel?: string;
}

/**
 * Lightweight inline spinner for button and form loading states.
 * Use Loading component for full-page or section-level loading states.
 */
const Spinner = ({
  size = 'medium',
  className = '',
  ariaLabel = 'Loading'
}: SpinnerProps) => {
  const sizeClasses: Record<string, string> = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <Loader2
      className={cn('animate-spin', sizeClasses[size], className)}
      aria-label={ariaLabel}
    />
  );
};

export default Spinner;
