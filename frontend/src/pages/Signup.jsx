import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GuestRoute } from '../components/ProtectedRoute';
import './Auth.css';

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setError('');
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <GuestRoute>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
          {error && (
            <div className="error-message mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Full name is required' })}
                className={`rounded border px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="font-medium">Email</label>
              <input
                type="email"
                id="email"
                {...register('email', { required: 'Email is required' })}
                className={`rounded border px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email"
                autoComplete="username"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="font-medium">Password</label>
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className={`rounded border px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className={`rounded border px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
            </div>
            <button
              type="submit"
              className="auth-button w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-footer mt-6">
            <p>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></p>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
};

export default Signup; 