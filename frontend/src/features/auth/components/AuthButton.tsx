import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Modal } from '@shared/components';
import '../auth.css';

type AuthMode = 'login' | 'signup' | null;

const AuthButton = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticationMode, setAuthenticationMode] = useState<AuthMode>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleClose = () => {
    setAuthenticationMode(null);
  };

  if (user) {
    return (
      <div className="auth-button">
        <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
          {user.firstName?.[0]?.toUpperCase() || 'U'}
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setAuthenticationMode('login')} className="login-btn">
        Login
      </button>
      <button onClick={() => setAuthenticationMode('signup')} className="signup-btn" style={{ marginLeft: '8px' }}>
        Signup
      </button>

      {authenticationMode !== null && (
        <Modal
          isOpen={true}
          onClose={handleClose}
          size={authenticationMode === 'signup' ? 'lg' : 'md'}
        >
          {authenticationMode === 'login' ? (
            <LoginForm
              onSuccess={handleClose}
              onSwitchToSignup={() => setAuthenticationMode('signup')}
            />
          ) : (
            <SignupForm
              onSuccess={handleClose}
              onSwitchToLogin={() => setAuthenticationMode('login')}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default AuthButton;
