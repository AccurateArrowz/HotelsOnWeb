import {useEffect, useState} from 'react'
import Modal from '../../shared/components/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal({authenticationMode = 'login'}) { //addung default value as it can be opened from (book) rooms component
 const [authMode, setAuthMode] = useState(authenticationMode); //null | 'login' | 'signup' 
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  useEffect(() => {
    console.log('from AuthModal authMode', authMode);
  }, [authMode]);
  
  if (authMode === null) return null;

 
  return (
     <Modal isModalOpen={true} onClose={() => setAuthMode(null)} title={authMode === 'login' ? 'Sign In' : 'Create Account'}>
        {authMode === 'login'
          ? <LoginForm onSwitchToSignup={toggleAuthMode} />
          : <SignupForm onSwitchToLogin={toggleAuthMode} />
        }
      </Modal>
  )
}
