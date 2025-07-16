import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RequireAuth, RequirePermission, RequireRole, RoleBasedRender } from '../components/RoleBasedComponents';
import { ProtectedRoute } from '../components/ProtectedRoute';
import './Dashboard.css';

const Dashboard = () => {
  const { user, hasPermission } = useAuth();

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <p className="user-role">Role: {user?.role}</p>
        </div>

        <div className="dashboard-content">
          {/* Role-based dashboard sections */}
          <RoleBasedRender
            roleConfigs={{
              guest: (
                <div className="dashboard-section">
                  <h2>Guest Dashboard</h2>
                  <p>Welcome! You can browse hotels and view details.</p>
                  <div className="action-cards">
                    <div className="action-card">
                      <h3>Browse Hotels</h3>
                      <p>Explore our collection of hotels</p>
                      <a href="/hotels" className="action-btn">View Hotels</a>
                    </div>
                  </div>
                </div>
              ),
              user: (
                <div className="dashboard-section">
                  <h2>User Dashboard</h2>
                  <p>Manage your bookings and explore hotels.</p>
                  <div className="action-cards">
                    <RequirePermission permission="view_bookings">
                      <div className="action-card">
                        <h3>My Bookings</h3>
                        <p>View and manage your hotel bookings</p>
                        <a href="/my-bookings" className="action-btn">View Bookings</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="book_hotels">
                      <div className="action-card">
                        <h3>Book a Hotel</h3>
                        <p>Find and book your perfect stay</p>
                        <a href="/booking" className="action-btn">Book Now</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="create_reviews">
                      <div className="action-card">
                        <h3>My Reviews</h3>
                        <p>Write and manage your hotel reviews</p>
                        <a href="/my-reviews" className="action-btn">Manage Reviews</a>
                      </div>
                    </RequirePermission>
                  </div>
                </div>
              ),
              hotelOwner: (
                <div className="dashboard-section">
                  <h2>Hotel Owner Dashboard</h2>
                  <p>Manage your hotels and view bookings.</p>
                  <div className="action-cards">
                    <RequirePermission permission="manage_hotels">
                      <div className="action-card">
                        <h3>Manage Hotels</h3>
                        <p>Add, edit, and manage your hotel properties</p>
                        <a href="/manage-hotels" className="action-btn">Manage Hotels</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="manage_all_bookings">
                      <div className="action-card">
                        <h3>Hotel Bookings</h3>
                        <p>View and manage bookings for your hotels</p>
                        <a href="/hotel-bookings" className="action-btn">View Bookings</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="moderate_reviews">
                      <div className="action-card">
                        <h3>Hotel Reviews</h3>
                        <p>Moderate reviews for your hotels</p>
                        <a href="/hotel-reviews" className="action-btn">Moderate Reviews</a>
                      </div>
                    </RequirePermission>
                    
                    <div className="action-card">
                      <h3>Analytics</h3>
                      <p>View performance metrics for your hotels</p>
                      <a href="/analytics" className="action-btn">View Analytics</a>
                    </div>
                  </div>
                </div>
              ),
              admin: (
                <div className="dashboard-section">
                  <h2>Admin Dashboard</h2>
                  <p>System administration and management.</p>
                  <div className="action-cards">
                    <RequirePermission permission="manage_users">
                      <div className="action-card">
                        <h3>User Management</h3>
                        <p>Manage all users and their roles</p>
                        <a href="/manage-users" className="action-btn">Manage Users</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="manage_hotels">
                      <div className="action-card">
                        <h3>Hotel Management</h3>
                        <p>Manage all hotels in the system</p>
                        <a href="/manage-hotels" className="action-btn">Manage Hotels</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="manage_all_bookings">
                      <div className="action-card">
                        <h3>All Bookings</h3>
                        <p>View and manage all system bookings</p>
                        <a href="/all-bookings" className="action-btn">View All Bookings</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="moderate_reviews">
                      <div className="action-card">
                        <h3>Review Moderation</h3>
                        <p>Moderate all hotel reviews</p>
                        <a href="/moderate-reviews" className="action-btn">Moderate Reviews</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="manage_system">
                      <div className="action-card">
                        <h3>System Settings</h3>
                        <p>Configure system-wide settings</p>
                        <a href="/system-settings" className="action-btn">System Settings</a>
                      </div>
                    </RequirePermission>
                    
                    <RequirePermission permission="access_admin_panel">
                      <div className="action-card">
                        <h3>Admin Panel</h3>
                        <p>Access advanced administrative tools</p>
                        <a href="/admin" className="action-btn">Admin Panel</a>
                      </div>
                    </RequirePermission>
                  </div>
                </div>
              )
            }}
          />

          {/* Permission-based features */}
          <div className="dashboard-section">
            <h2>Your Permissions</h2>
            <div className="permissions-list">
              {hasPermission('view_hotels') && (
                <span className="permission-tag">View Hotels</span>
              )}
              {hasPermission('book_hotels') && (
                <span className="permission-tag">Book Hotels</span>
              )}
              {hasPermission('view_bookings') && (
                <span className="permission-tag">View Bookings</span>
              )}
              {hasPermission('create_bookings') && (
                <span className="permission-tag">Create Bookings</span>
              )}
              {hasPermission('cancel_bookings') && (
                <span className="permission-tag">Cancel Bookings</span>
              )}
              {hasPermission('manage_hotels') && (
                <span className="permission-tag">Manage Hotels</span>
              )}
              {hasPermission('delete_hotels') && (
                <span className="permission-tag">Delete Hotels</span>
              )}
              {hasPermission('view_users') && (
                <span className="permission-tag">View Users</span>
              )}
              {hasPermission('manage_users') && (
                <span className="permission-tag">Manage Users</span>
              )}
              {hasPermission('delete_users') && (
                <span className="permission-tag">Delete Users</span>
              )}
              {hasPermission('create_reviews') && (
                <span className="permission-tag">Create Reviews</span>
              )}
              {hasPermission('moderate_reviews') && (
                <span className="permission-tag">Moderate Reviews</span>
              )}
              {hasPermission('access_admin_panel') && (
                <span className="permission-tag">Access Admin Panel</span>
              )}
              {hasPermission('manage_system') && (
                <span className="permission-tag">Manage System</span>
              )}
            </div>
          </div>
        </div>
  </div>
    </ProtectedRoute>
);
};

export default Dashboard; 