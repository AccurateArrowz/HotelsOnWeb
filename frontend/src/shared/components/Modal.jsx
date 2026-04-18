import { useEffect } from 'react';
import '@/styles/modal.css';

export default function Modal({
  isOpen,
  isModalOpen,
  onClose,
  children,
  size = 'md',
  className = '',
}) {
  // const [isModalOpen, setIsModalOpen] = useState(true);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // setIsModalOpen(false)
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Lock body scroll 
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, []);

  const modalOpen = isOpen ?? isModalOpen;
  if (!modalOpen) return null;

  const handleOverlayClick = () => {
    // setIsModalOpen(false)
    console.log('overlay clicked')
    onClose();
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
