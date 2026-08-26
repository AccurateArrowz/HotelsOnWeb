import { useState } from 'react';
import { Invitation } from '@hotelsonweb/shared';
import { Loading, TryAgainButton } from '@shared/components';
import Spinner from '@shared/components/Spinner';
import {
  useCreateStaffInvitationMutation,
  useGetPendingStaffInvitationsQuery,
  useResendStaffInvitationMutation,
  useCancelStaffInvitationMutation,
} from '@features/owner/api';
import { Plus, Trash2, RotateCcw, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface FormData {
  invitedEmail: string;
  roleId: string | number;
}

interface FormErrors {
  [key: string]: string;
}

interface InviteStaffProps {
  hotelId: string | number;
}

const InviteStaff = ({ hotelId }: InviteStaffProps) => {
  const { data: invitationsData, isLoading, error, refetch } = useGetPendingStaffInvitationsQuery({
    hotelId,
  });
  const [createInvitation, { isLoading: isCreating }] = useCreateStaffInvitationMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendStaffInvitationMutation();
  const [cancelInvitation] = useCancelStaffInvitationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    invitedEmail: '',
    roleId: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const roles: Role[] = [
    { id: 4, name: 'Manager', description: 'Full access to dashboard, reports, and management' },
    { id: 5, name: 'Receptionist', description: 'Access to bookings, room status, and guest information' },
  ];

  const handleOpenModal = () => {
    setFormData({ invitedEmail: '', roleId: '' });
    setFormErrors({});
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
    setSuccessMessage('');
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.invitedEmail.trim()) {
      errors.invitedEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.invitedEmail)) {
      errors.invitedEmail = 'Invalid email format';
    }
    if (!formData.roleId) {
      errors.roleId = 'Role is required';
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
      await createInvitation({
        hotelId,
        data: {
          invitedEmail: formData.invitedEmail.trim(),
          roleId: parseInt(String(formData.roleId)),
        },
      }).unwrap();

      setSuccessMessage('Invitation sent successfully!');
      setTimeout(() => {
        handleCloseModal();
        refetch();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to send invitation:', err);
      setFormErrors({
        submit: err.data?.message || 'Failed to send invitation',
      });
    }
  };

  const handleResend = async (invitationId: string | number) => {
    try {
      await resendInvitation({ hotelId, invitationId }).unwrap();
      refetch();
    } catch (err: any) {
      console.error('Failed to resend invitation:', err);
      alert(err.data?.message || 'Failed to resend invitation');
    }
  };

  const handleCancel = async (invitationId: string | number) => {
    if (!window.confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    try {
      await cancelInvitation({ hotelId, invitationId }).unwrap();
      refetch();
    } catch (err: any) {
      console.error('Failed to cancel invitation:', err);
      alert(err.data?.message || 'Failed to cancel invitation');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Loading size="large" message="Loading invitations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p>Error loading invitations: {(error as any).data?.message || 'Unknown error'}</p>
          <TryAgainButton onClick={refetch} size="sm" />
        </div>
      </div>
    );
  }

  const invitations = (invitationsData as any)?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6 mb-8 md:flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Invite Staff</h2>
          <p className="text-sm text-slate-600">Add new members to your hotel management team and assign their roles.</p>
        </div>
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
          onClick={handleOpenModal}
          disabled={isCreating}
        >
          <Plus size={16} className="inline mr-2" />
          Send Invitation
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">New Invitation</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            disabled
            value="(Name will be set when they accept)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="jane@example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            value={formData.invitedEmail}
            onChange={(e) => setFormData({ ...formData, invitedEmail: e.target.value })}
            disabled={isModalOpen ? false : true}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            disabled={isModalOpen ? false : true}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
          onClick={handleOpenModal}
          disabled={isCreating}
        >
          {isCreating ? <Spinner size="sm" /> : 'Send Invitation'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Invitations</h3>

        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto mb-4 text-slate-400" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No Pending Invitations</h4>
            <p className="text-sm text-slate-600">Send invitations to team members to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((invitation: any) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors md:flex-col md:items-start md:gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900">{invitation.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {roles.find((r) => r.id === invitation.role)?.name || 'Unknown Role'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      <AlertCircle size={12} />
                      Pending
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 md:ml-0 md:w-full md:justify-end">
                  <button
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    onClick={() => handleResend(invitation.id)}
                    disabled={isResending}
                    title="Resend invitation"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    onClick={() => handleCancel(invitation.id)}
                    title="Cancel invitation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Send Staff Invitation</h3>
              <button className="text-2xl text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer font-light" onClick={handleCloseModal} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
                    formErrors.invitedEmail
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                  value={formData.invitedEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, invitedEmail: e.target.value });
                    if (formErrors.invitedEmail) {
                      setFormErrors({ ...formErrors, invitedEmail: '' });
                    }
                  }}
                />
                {formErrors.invitedEmail && (
                  <span className="block text-xs text-red-600 mt-1">{formErrors.invitedEmail}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
                    formErrors.roleId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                  value={formData.roleId}
                  onChange={(e) => {
                    setFormData({ ...formData, roleId: e.target.value });
                    if (formErrors.roleId) {
                      setFormErrors({ ...formErrors, roleId: '' });
                    }
                  }}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {formErrors.roleId && (
                  <span className="block text-xs text-red-600 mt-1">{formErrors.roleId}</span>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  onClick={handleCloseModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
                  disabled={isCreating}
                >
                  {isCreating ? <Spinner size="sm" /> : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteStaff;
