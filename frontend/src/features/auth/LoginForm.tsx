import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from './useAuth';
import Spinner from '@shared/components/Spinner';
import { getAuthErrorMessage } from './getAuthErrorMessage';
import { LoginSchema, type LoginInput } from '@hotelsonweb/shared';
import './authForms.css';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const { login, isLoginLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err: any) {
      const message = getAuthErrorMessage(
        err,
        'Failed to log in. Please check your credentials and try again.'
      );
      setError('root.serverError', { message });
    }
  };

  return (
    <>
      {errors.root?.serverError && (
        <div className="error-message" role="alert">
          {errors.root.serverError.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        <h2 className="form-title">Sign In</h2>

        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email address"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="login-email-error" className="field-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="login-password-error" className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isLoginLoading}>
            {isLoginLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="small" />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>

      <div className="auth-footer">
        <p>
          Don&apos;t have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className="text-button">
            Create New Account
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
