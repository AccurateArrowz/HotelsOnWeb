import React from 'react';
import { useAuth } from '../AuthContext';
import '../../styles/modal.css';

const ProfileModal = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="profile-info">
          <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
          <div><strong>Role:</strong> {user.role}</div>
        </div>
        <div className="profile-actions">
          <button className="primary-button" onClick={() => { logout(); onClose(); }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
