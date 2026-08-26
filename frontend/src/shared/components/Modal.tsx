import { useEffect, ReactNode } from 'react';
import '@/styles/modal.css';

interface ModalProps {
  isOpen?: boolean;
  isModalOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function Modal({
  isOpen,
  isModalOpen,
  onClose,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const modalOpen = isOpen ?? isModalOpen;
  if (!modalOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const sizeClasses: Record<string, string> = {
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
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
