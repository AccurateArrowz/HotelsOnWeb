import {useState} from 'react'

export default function RoughAuthModal({authenticationMode = 'login'}) {
 const [authMode, setAuthMode] = useState(authenticationMode); //'login' | 'signup' 
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };
//  if (!isOpen) return null;
 
  return (
     <Modal showModal={authMode !== null} onClose={() => setAuthMode(null)}>
        {authMode === 'login'
          ? <LoginForm onSwitchToSignup={toggleAuthMode} />
          : <SignupForm onSwitchToLogin={toggleAuthMode} />
        }
      </Modal>
  )
}
