# Role-Based Access Control (RBAC) System

This document describes the comprehensive RBAC system implemented in the hotel booking application.

## Overview

The RBAC system provides granular access control based on user roles and permissions. It includes:

- **4 User Roles**: Guest, User, Hotel Owner, Admin
- **14 Permissions**: Granular permissions for different actions
- **Protected Routes**: Route-level access control
- **Conditional Rendering**: Component-level access control
- **Authentication Context**: Centralized auth state management

## User Roles

### 1. Guest
- **Description**: Unauthenticated users
- **Permissions**: 
  - View hotels
- **Access**: Public hotel browsing only

### 2. User
- **Description**: Regular authenticated users
- **Permissions**:
  - View hotels
  - Book hotels
  - View bookings
  - Create bookings
  - Cancel bookings
  - Create reviews
- **Access**: Full booking functionality

### 3. Hotel Owner
- **Description**: Hotel property managers
- **Permissions**:
  - View hotels
  - Manage hotels
  - View bookings
  - Manage all bookings
  - Moderate reviews
- **Access**: Hotel management and booking oversight

### 4. Admin
- **Description**: System administrators
- **Permissions**: All permissions
- **Access**: Complete system control

## Permissions

| Permission | Description | Roles |
|------------|-------------|-------|
| `view_hotels` | View hotel listings | All |
| `book_hotels` | Book hotel rooms | User, Admin |
| `manage_hotels` | Add/edit hotel properties | Hotel Owner, Admin |
| `delete_hotels` | Delete hotel properties | Admin |
| `view_bookings` | View booking history | User, Hotel Owner, Admin |
| `create_bookings` | Create new bookings | User, Admin |
| `cancel_bookings` | Cancel existing bookings | User, Admin |
| `manage_all_bookings` | Manage all system bookings | Hotel Owner, Admin |
| `view_users` | View user list | Admin |
| `manage_users` | Edit user information | Admin |
| `delete_users` | Delete user accounts | Admin |
| `create_reviews` | Write hotel reviews | User, Admin |
| `moderate_reviews` | Moderate user reviews | Hotel Owner, Admin |
| `access_admin_panel` | Access admin dashboard | Admin |
| `manage_system` | System-wide settings | Admin |

## Components

### 1. AuthContext (`contexts/AuthContext.jsx`)
Central authentication state management with role and permission checking.

```jsx
import { useAuth } from '../contexts/AuthContext';

const { user, hasPermission, hasRole, login, logout } = useAuth();
```

### 2. Role-Based Components (`components/RoleBasedComponents.jsx`)
Conditional rendering components based on roles and permissions.

```jsx
import { RequirePermission, RequireRole, RequireAuth } from '../components/RoleBasedComponents';

<RequirePermission permission="book_hotels">
  <BookingButton />
</RequirePermission>

<RequireRole role="admin">
  <AdminPanel />
</RequireRole>
```

### 3. Protected Routes (`components/ProtectedRoute.jsx`)
Route-level access control components.

```jsx
import { ProtectedRoute, PermissionRoute, RoleRoute } from '../components/ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <RoleRoute role="admin">
      <AdminPanel />
    </RoleRoute>
  } 
/>
```

## Usage Examples

### 1. Checking Permissions in Components

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { hasPermission, hasRole } = useAuth();
  
  return (
    <div>
      {hasPermission('book_hotels') && (
        <button>Book Hotel</button>
      )}
      
      {hasRole('admin') && (
        <AdminControls />
      )}
    </div>
  );
};
```

### 2. Conditional Rendering

```jsx
import { RequirePermission, RequireRole } from '../components/RoleBasedComponents';

const HotelCard = ({ hotel }) => (
  <div>
    <h3>{hotel.name}</h3>
    
    <RequirePermission permission="book_hotels">
      <BookButton hotel={hotel} />
    </RequirePermission>
    
    <RequirePermission permission="manage_hotels">
      <EditButton hotel={hotel} />
      <DeleteButton hotel={hotel} />
    </RequirePermission>
    
    <RequireRole role="admin">
      <AdminControls hotel={hotel} />
    </RequireRole>
  </div>
);
```

### 3. Protected Routes

```jsx
import { PermissionRoute, RoleRoute } from '../components/ProtectedRoute';

<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/hotels" element={<Hotels />} />
  
  {/* Permission-based routes */}
  <Route 
    path="/booking" 
    element={
      <PermissionRoute permission="book_hotels">
        <Booking />
      </PermissionRoute>
    } 
  />
  
  {/* Role-based routes */}
  <Route 
    path="/admin" 
    element={
      <RoleRoute role="admin">
        <AdminPanel />
      </RoleRoute>
    } 
  />
</Routes>
```

### 4. Higher-Order Components

```jsx
import { withPermission, withRole } from '../components/RoleBasedComponents';

const AdminOnlyComponent = withRole(MyComponent, 'admin');
const BookingComponent = withPermission(BookingForm, 'book_hotels');
```

## Demo Accounts

For testing the RBAC system, use these demo accounts:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| alice@example.com | password123 | User | Book hotels, view bookings, create reviews |
| bob@example.com | password123 | Hotel Owner | Manage hotels, view bookings, moderate reviews |
| carol@example.com | password123 | Admin | All permissions |
| guest@example.com | password123 | Guest | View hotels only |

## File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context
├── components/
│   ├── RoleBasedComponents.jsx  # Conditional rendering components
│   ├── ProtectedRoute.jsx       # Route protection components
│   └── Navbar.jsx              # Updated with RBAC
├── pages/
│   ├── Login.jsx               # Enhanced login with RBAC
│   ├── Signup.jsx              # Enhanced signup with RBAC
│   ├── Dashboard.jsx           # Role-based dashboard
│   ├── HotelDetails.jsx        # Permission-based features
│   └── Booking.jsx             # Permission-protected booking
├── Auth.css                    # Authentication page styles
├── Dashboard.css               # Dashboard styles
└── App.jsx                     # Updated with protected routes
```

## Best Practices

### 1. Always Check Permissions
```jsx
// Good: Check permission before rendering
{hasPermission('delete_hotels') && <DeleteButton />}

// Bad: Rely only on UI hiding
<DeleteButton style={{ display: 'none' }} />
```

### 2. Use Multiple Permission Checks
```jsx
// Check for any permission
<RequireAnyPermission permissions={['edit_hotels', 'delete_hotels']}>
  <HotelActions />
</RequireAnyPermission>

// Check for all permissions
<RequireAllPermissions permissions={['view_users', 'manage_users']}>
  <UserManagement />
</RequireAllPermissions>
```

### 3. Provide Fallback Content
```jsx
<RequirePermission 
  permission="admin_panel" 
  fallback={<AccessDenied />}
>
  <AdminPanel />
</RequirePermission>
```

### 4. Handle Loading States
```jsx
const { loading, user } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}

if (!user) {
  return <LoginPrompt />;
}
```

## Security Considerations

1. **Client-Side Only**: This implementation is for UI control only. Always implement server-side permission checks.
2. **Token Validation**: In production, validate JWT tokens on the server.
3. **Permission Caching**: Consider caching permissions to reduce API calls.
4. **Audit Logging**: Log permission checks and access attempts.
5. **Session Management**: Implement proper session timeout and refresh.

## Extending the System

### Adding New Roles
1. Add role to `ROLES` object in `AuthContext.jsx`
2. Define permissions in `ROLE_PERMISSIONS`
3. Update components to use new role

### Adding New Permissions
1. Add permission to `PERMISSIONS` object
2. Assign to roles in `ROLE_PERMISSIONS`
3. Use in components with `RequirePermission`

### Custom Permission Logic
```jsx
// Custom permission check
const hasCustomPermission = (resource, action) => {
  return hasPermission(`${action}_${resource}`);
};

// Usage
{hasCustomPermission('hotels', 'delete') && <DeleteButton />}
```

## Testing

Test the RBAC system by:

1. **Login with different accounts** and verify correct access
2. **Navigate to protected routes** and confirm redirects
3. **Check conditional rendering** based on permissions
4. **Verify role-based features** appear/disappear correctly
5. **Test permission combinations** with multiple requirements

The RBAC system provides a robust foundation for access control that can be easily extended and maintained as the application grows. 