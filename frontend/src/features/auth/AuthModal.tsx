import { useEffect, useState } from 'react'
import { Modal } from '@shared/components';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

type AuthMode = 'login' | 'signup' | null;

interface AuthModalProps {
  authenticationMode?: AuthMode;
  onClose?: () => void;
}

export default function AuthModal({ authenticationMode = 'login', onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>(authenticationMode);

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const handleClose = () => {
    setAuthMode(null);
    onClose?.();
  };

  useEffect(() => {
    console.log('from AuthModal authMode', authMode);
  }, [authMode]);

  if (authMode === null) return null;

  return (
    <Modal isModalOpen={true} onClose={handleClose}>
      {authMode === 'login'
        ? <LoginForm onSwitchToSignup={toggleAuthMode} />
        : <SignupForm onSwitchToLogin={toggleAuthMode} />
      }
    </Modal>
  )
}
