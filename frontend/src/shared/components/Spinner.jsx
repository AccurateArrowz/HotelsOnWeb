import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '@shared/utils/cn';
 
/**
 * Lightweight inline spinner for button and form loading states.
 * Use Loading component for full-page or section-level loading states.
 */
const Spinner = ({
  size = 'medium',
  className = '',
  ariaLabel = 'Loading'
}) => {
  const sizeClasses = {
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
 
Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string
};
 
export default Spinner;
 

