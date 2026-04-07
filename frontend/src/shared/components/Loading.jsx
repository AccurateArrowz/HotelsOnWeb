import React from 'react';
import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi';

/**
 * Responsive Loading component with customizable size and message
 */
const Loading = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false,
  className = '',
  showIcon = true 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-label="Loading">
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        {showIcon && (
          <div className="animate-spin">
            <FiLoader className={`${sizeClasses[size]} text-blue-600`} />
          </div>
        )}
        {message && (
          <p className={`${textSizes[size]} text-gray-600 text-center font-medium animate-pulse sm:text-sm xs:text-xs`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
  showIcon: PropTypes.bool
};

export default Loading;
