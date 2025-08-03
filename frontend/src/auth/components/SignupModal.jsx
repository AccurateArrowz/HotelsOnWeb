import { useState } from 'react';
import { useAuth } from '../AuthContext';
import '../../styles/modal.css';

export const SignupModal = ({ open, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check all fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.trim() === '') {
        setError('All fields are required');
        return;
      }
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create an account. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal signup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Account</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        
        
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select 
              id="role"
              name="role" 
              value={formData.role}
              onChange={handleChange}
              className="role-selector"
              aria-label="Select account type"
            >
              <option value="customer">Traveler looking to book hotels</option>
              <option value="hotelOwner">Hotel owner listing my property</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password (min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
              aria-required="true"
              aria-describedby="password-requirements"
            />
            <p id="password-requirements" className="helper-text">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Create Account
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <button 
            onClick={onSwitchToLogin} 
            className="text-button"
          >
            Sign In
          </button></p>
        </div>
              </div>
        <div className="signup-modal-bottom">
          {error && <div className="error-message error-bottom">{error}</div>}
        </div>
      </div>
    // </div>
  );
};
