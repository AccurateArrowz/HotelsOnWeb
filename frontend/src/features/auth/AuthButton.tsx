import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './auth.css';
import AuthModal from './AuthModal';

type AuthMode = 'login' | 'signup' | null;

const AuthButton = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticationMode, setAuthenticationMode] = useState<AuthMode>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
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
      <button onClick={() => { console.log('login button clicked'); setAuthenticationMode("login") }} className="login-btn">
        Login
      </button>
      <button onClick={() => { console.log('signup button clicked'); setAuthenticationMode("signup") }} className="signup-btn" style={{ marginLeft: '8px' }}>
        Signup
      </button>

      {(authenticationMode !== null) &&
        <AuthModal authenticationMode={authenticationMode} onClose={() => { console.log('onClose Modal of the AuthButton called'); setAuthenticationMode(null) }} />
      }
    </>
  );
};

export default AuthButton;
