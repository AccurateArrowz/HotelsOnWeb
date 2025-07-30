import { useState } from 'react';
import { useAuth } from '../AuthContext';
import '../../../styles/modal.css';

export const LoginModal = ({ open, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sign In</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">Sign In</button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?
            <button onClick={onSwitchToSignup} className="text-button">
              Create New Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
