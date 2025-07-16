import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { 
  ProtectedRoute, 
  PermissionRoute, 
  RoleRoute, 
  GuestRoute 
} from './components/ProtectedRoute';
import { PERMISSIONS, ROLES } from './contexts/AuthContext';
import './pages/Home.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            
            {/* Protected routes */}
            <Route 
              path="/booking" 
              element={
                <PermissionRoute permission={PERMISSIONS.BOOK_HOTELS}>
                  <Booking />
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <RoleRoute role={ROLES.ADMIN}>
                  <div className="admin-panel">
                    <h2>Admin Panel</h2>
                    <p>Welcome to the admin panel. Here you can manage the entire system.</p>
                    <div className="admin-actions">
                      <a href="/manage-users" className="admin-btn">Manage Users</a>
                      <a href="/manage-hotels" className="admin-btn">Manage Hotels</a>
                      <a href="/system-settings" className="admin-btn">System Settings</a>
                    </div>
                  </div>
                </RoleRoute>
              } 
            />
            
            <Route 
              path="/manage-users" 
              element={
                <PermissionRoute permission={PERMISSIONS.MANAGE_USERS}>
                  <div className="manage-users">
                    <h2>User Management</h2>
                    <p>Manage all users in the system.</p>
                    <div className="user-list">
                      <div className="user-item">
                        <span>Alice (user)</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                      <div className="user-item">
                        <span>Bob (hotelOwner)</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                      <div className="user-item">
                        <span>Carol (admin)</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/manage-hotels" 
              element={
                <PermissionRoute permission={PERMISSIONS.MANAGE_HOTELS}>
                  <div className="manage-hotels">
                    <h2>Hotel Management</h2>
                    <p>Manage all hotels in the system.</p>
                    <div className="hotel-list">
                      <div className="hotel-item">
                        <span>Grand Palace Hotel</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                      <div className="hotel-item">
                        <span>Seaside Resort</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                      <div className="hotel-item">
                        <span>Mountain View Inn</span>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                </PermissionRoute>
              } 
            />
            
            {/* Authentication routes */}
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
