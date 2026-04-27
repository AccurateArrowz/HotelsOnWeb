import {useEffect, useState} from 'react'
import Modal from '../../shared/components/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal({authenticationMode = 'login', onClose}) { 
  //adding default value as it can be opened from (book) rooms component; authenticationMode would be signup when opened by signupBtn(from AuthButton)
 const [authMode, setAuthMode] = useState(authenticationMode); //null | 'login' | 'signup' 
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };
 const handleClose = () => {
    setAuthMode(null);
    onClose?.();  //the onClose callback is used to update the AuthBtn state (when the modal is opened by AuthButton)
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
