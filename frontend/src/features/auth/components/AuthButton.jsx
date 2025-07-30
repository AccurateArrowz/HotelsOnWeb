import { useState } from 'react';
import { useAuth } from '../AuthContext';
import './auth.css';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

export const AuthButton = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  if (user) {
    return (
      <div className="auth-button">
        <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={() => setMenuOpen(false)}>Profile</button>
            <button onClick={() => setMenuOpen(false)}>My Bookings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setLoginOpen(true)} className="login-btn">
        Login
      </button>
      <button onClick={() => setSignupOpen(true)} className="signup-btn" style={{ marginLeft: '8px' }}>
        Signup
      </button>
      
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      
      <SignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};
