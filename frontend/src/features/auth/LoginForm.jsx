import { useState } from 'react';
import { useAuth } from './useAuth';
import './authForms.css';

const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.log('login error: ', err);
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="form-title">Sign In</h2>
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
        <p>Don&apos;t have an account?
          <button type="button" onClick={onSwitchToSignup} className="text-button">
            Create New Account
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
