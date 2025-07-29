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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign In</h2>
        
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">Sign In</button>
        </form>
        
        <div className="divider">OR</div>
        
        <button onClick={onSwitchToSignup} className="secondary">
          Create New Account
        </button>
      </div>
    </div>
  );
};
