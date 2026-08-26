import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Invitation } from '@hotelsonweb/shared';
import { Loading } from '@shared/components';
import {
  useGetStaffInvitationByTokenQuery,
  useAcceptStaffInvitationMutation,
} from '@features/owner/api';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { data: invitation, isLoading, error } = useGetStaffInvitationByTokenQuery(token || '', {
    skip: !token,
  });

  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptStaffInvitationMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setFormErrors({ general: 'No invitation token provided' });
    }
  }, [token]);

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await acceptInvitation({
        token: token || '',
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
        phone: formData.phone || undefined,
      }).unwrap();

      setSuccessMessage('Invitation accepted! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to accept invitation:', err);
      setFormErrors({
        submit: err.data?.message || 'Failed to accept invitation. Please try again.',
      });
    }
  };

  const inputClass = (hasError: boolean): string =>
    [
      'w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors',
      hasError
        ? 'border-red-500 focus:ring-red-500'
        : 'border-slate-300 focus:ring-amber-500',
    ].join(' ');

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center py-12 px-6">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Invitation Link</h2>
            <p className="text-sm text-slate-600">
              The invitation link is missing or invalid. Please check your email and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <Loading size="large" message="Loading invitation details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center py-12 px-6">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invitation Not Found</h2>
            <p className="text-sm text-slate-600">
              {(error as any).data?.message || 'This invitation is invalid, expired, or has already been used.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 sm:p-8 rounded-t-lg">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-amber-400">
            <span className="text-3xl">🏨</span>
            <div>
              <p className="font-semibold text-sm mb-1">{(invitation as any)?.hotelName}</p>
              <p className="text-xs opacity-90">{(invitation as any)?.roleName}</p>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to HotelsOnWeb!</h1>
          <p className="text-sm opacity-95 leading-relaxed">
            {(invitation as any)?.inviterName} has invited you to join {(invitation as any)?.hotelName} as a{' '}
            {(invitation as any)?.roleName}. Complete your profile below to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm mb-4">
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          {formErrors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
              <AlertCircle size={16} />
              {formErrors.submit}
            </div>
          )}

          {formErrors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
              <AlertCircle size={16} />
              {formErrors.general}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              value={(invitation as any)?.email || ''}
              disabled
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                placeholder="John"
                className={inputClass(!!formErrors.firstName)}
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (formErrors.firstName) {
                    setFormErrors({ ...formErrors, firstName: '' });
                  }
                }}
              />
              {formErrors.firstName && (
                <span className="block text-xs text-red-600 mt-1">{formErrors.firstName}</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className={inputClass(!!formErrors.lastName)}
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (formErrors.lastName) {
                    setFormErrors({ ...formErrors, lastName: '' });
                  }
                }}
              />
              {formErrors.lastName && (
                <span className="block text-xs text-red-600 mt-1">{formErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={inputClass(false)}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className={inputClass(!!formErrors.password)}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (formErrors.password) {
                    setFormErrors({ ...formErrors, password: '' });
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <span className="block text-xs text-red-600 mt-1">{formErrors.password}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={inputClass(!!formErrors.confirmPassword)}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (formErrors.confirmPassword) {
                    setFormErrors({ ...formErrors, confirmPassword: '' });
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <span className="block text-xs text-red-600 mt-1">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 w-full py-3 text-base"
            disabled={isAccepting}
          >
            {isAccepting ? 'Creating Account...' : 'Accept Invitation & Create Account'}
          </button>
        </form>

        <div className="px-8 py-4 border-t border-slate-200 text-center text-sm text-slate-600 rounded-b-lg bg-slate-50">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
