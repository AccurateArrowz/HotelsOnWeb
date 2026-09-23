import { useEffect, useRef, ReactNode } from 'react';
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalOpen = isOpen ?? isModalOpen;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modalOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [modalOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
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
    <dialog
      ref={dialogRef}
      className={`modal-content ${sizeClass} ${className}`}
      onClick={handleBackdropClick}
      onClose={onClose}
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
    </dialog>
  );
}
