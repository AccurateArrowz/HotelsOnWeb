import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GuestRoute } from '../components/ProtectedRoute';
import './Auth.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setError('');
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <GuestRoute>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
          {error && (
            <div className="error-message mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form space-y-4">
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
                {...register('password', { required: 'Password is required' })}
                className={`rounded border px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>
            <button
              type="submit"
              className="auth-button w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer mt-6">
            <p>Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a></p>
          </div>
          <div className="demo-accounts mt-6">
            <h4 className="font-semibold mb-2">Demo Accounts:</h4>
            <div className="demo-account"><strong>User:</strong> alice@example.com / password123</div>
            <div className="demo-account"><strong>Hotel Owner:</strong> bob@example.com / password123</div>
            <div className="demo-account"><strong>Admin:</strong> carol@example.com / password123</div>
            <div className="demo-account"><strong>Guest:</strong> guest@example.com / password123</div>
          </div>
        </div>
  </div>
    </GuestRoute>
);
};

export default Login; 