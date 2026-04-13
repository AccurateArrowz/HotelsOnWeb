import { useEffect } from 'react';
import '@/styles/modal.css';

export default function Modal({
  isModalOpen,
  onClose,
  title,
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
  }, []);

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

  if (!isModalOpen) return null;

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

          <div className="modal-header flex items-center justify-between px-6 py-4 border-b border-gray-100">
              {title && (
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 m-0">
                  {title}
                </h2>
              )}
              <button
                className="modal-close-button ml-auto"
                onClick={onClose}
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
