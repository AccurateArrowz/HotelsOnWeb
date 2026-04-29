import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, LogOut, ArrowLeft, Edit3 } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 
                       user.email?.[0]?.toUpperCase() || 'U';

  const profileFields = [
    { label: 'First Name', value: user.firstName, icon: User },
    { label: 'Last Name', value: user.lastName, icon: User },
    { label: 'Email', value: user.email, icon: Mail },
    { label: 'Phone', value: user.phone || 'Not provided', icon: Phone },
    { label: 'Role', value: user.role, icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 transition-colors"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back</span>
          </button>
        </nav>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 sm:h-40"></div>
          <div className="px-6 sm:px-8 pb-6">
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg border-4 border-white"
                  aria-hidden="true"
                >
                  {userInitials}
                </div>
                <div className="text-center sm:text-left sm:mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-500 capitalize">{user.role} Account</p>
                </div>
              </div>

              {/* Edit Button - Placeholder for future functionality */}
              <button
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors sm:mb-2"
                aria-label="Edit profile (coming soon)"
                disabled
              >
                <Edit3 size={18} aria-hidden="true" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <section 
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6"
          aria-labelledby="profile-details-heading"
        >
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <h2 id="profile-details-heading" className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="text-gray-500 text-sm mt-1">Your personal account details</p>
          </div>

          <dl className="divide-y divide-gray-100">
            {profileFields.map((field) => {
              const IconComponent = field.icon;
              return (
                <div 
                  key={field.label}
                  className="px-6 sm:px-8 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                    <dd className="text-base text-gray-900 truncate">{field.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>

        {/* Account Actions Card */}
        <section 
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          aria-labelledby="account-actions-heading"
        >
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <h2 id="account-actions-heading" className="text-xl font-semibold text-gray-900">
              Account Actions
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your account session</p>
          </div>

          <div className="px-6 sm:px-8 py-4">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Log out of your account"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
