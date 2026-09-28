import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from './useAuth';
import Spinner from '@shared/components/Spinner';
import { getAuthErrorMessage } from './getAuthErrorMessage';
import {
  SignupFormSchema,
  type SignupFormValues,
} from './schemas/signupForm.schema';
import './authForms.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

// Password strength helper
interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password)
    return { score: 0, label: '', color: 'transparent' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  // Bonus for special characters (not required but rewarded)
  if (/[^A-Za-z0-9]/.test(password)) score = Math.min(4, score + 1) as StrengthResult['score'];

  const map: Record<number, Omit<StrengthResult, 'score'>> = {
    1: { label: 'Weak', color: '#ef4444' },
    2: { label: 'Fair', color: '#f97316' },
    3: { label: 'Good', color: '#eab308' },
    4: { label: 'Strong', color: '#22c55e' },
  };
  return { score: score as StrengthResult['score'], ...(map[score] ?? { label: 'Weak', color: '#ef4444' }) };
}

// Component
const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const { register: registerUser, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    },
  });

  // Live watch for strength indicator and role toggle
  const passwordValue = useWatch({ control, name: 'password' }) ?? '';
  const roleValue = watch('role');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      });
      onSuccess?.();
    } catch (err: any) {
      const message = getAuthErrorMessage(
        err,
        'Failed to create an account. Please try again.'
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

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form" noValidate>
        <div className="form-header-container">
          <h2 className="form-title" style={{ marginBottom: '0.2rem' }}>
            Create Account
          </h2>
          <p
            className="form-subtitle"
            style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.9rem',
              marginBottom: '1.2rem',
              marginTop: 0,
            }}
          >
            Join HotelsOnWeb for exclusive rates &amp; effortless reservations
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              autoComplete="given-name"
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p id="firstName-error" className="field-error" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              autoComplete="family-name"
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p id="lastName-error" className="field-error" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="field-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+977 9800000000"
              autoComplete="tel"
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={
                errors.phone ? 'phone-error' : 'phone-hint'
              }
              {...register('phone')}
            />
            {errors.phone ? (
              <p id="phone-error" className="field-error" role="alert">
                {errors.phone.message}
              </p>
            ) : (
              <p id="phone-hint" className="helper-text">
                Include country code, e.g. +1 202 555 0100
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>I am registering as</label>
          <div className="role-toggle-group">
            <button
              type="button"
              className={`role-toggle-btn ${roleValue === 'customer' ? 'active' : ''}`}
              onClick={() => setValue('role', 'customer')}
              aria-pressed={roleValue === 'customer'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Traveler (Book stays)
            </button>

            <button
              type="button"
              className={`role-toggle-btn ${roleValue === 'owner' ? 'active' : ''}`}
              onClick={() => setValue('role', 'owner')}
              aria-pressed={roleValue === 'owner'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
                <path d="M12 10h.01" /><path d="M12 14h.01" />
                <path d="M16 10h.01" /><path d="M16 14h.01" />
                <path d="M8 10h.01" /><path d="M8 14h.01" />
              </svg>
              Hotel Partner / Owner
            </button>
          </div>
          <input type="hidden" {...register('role')} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? 'password-error'
                  : passwordValue
                  ? 'password-strength'
                  : undefined
              }
              {...register('password')}
            />

            {passwordValue && (
              <div id="password-strength" className="password-strength" aria-live="polite">
                <div className="strength-bars">
                  {([1, 2, 3, 4] as const).map((level) => (
                    <span
                      key={level}
                      className="strength-bar"
                      style={{
                        backgroundColor:
                          strength.score >= level ? strength.color : '#e2e8f0',
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-label"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}

            {errors.password && (
              <p id="password-error" className="field-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirmPassword-error' : undefined
              }
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="field-error"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isRegisterLoading}
          >
            {isRegisterLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="small" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-button"
          >
            Sign In
          </button>
        </p>
      </div>
    </>
  );
};

export default SignupForm;
