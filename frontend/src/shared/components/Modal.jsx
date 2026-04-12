import { useEffect, useState } from 'react';
import './Modal.css';

/**
 * Reusable Modal component with overlay, header, and content wrapper.
 * Handles ESC key closing and click-outside-to-close behavior.
 */
export default function Modal({
  children,
  size = 'md',
  className = '',
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isModalOpen) return null;

  const handleOverlayClick = () => {
    setIsModalOpen(false)
  };


  const sizeClasses = {
    sm: 'modal-content--sm',
    md: 'modal-content--md',
    lg: 'modal-content--lg',
    xl: 'modal-content--xl',
    full: 'modal-content--full'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal-content ${sizeClass} ${className}`}
        onClick={ (e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >

          <div className="modal-header">
              <button
                className="modal-close-button"
                onClick={()=> setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
          </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
