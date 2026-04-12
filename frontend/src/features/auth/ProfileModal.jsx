import { useAuth } from './useAuth';
import { Modal } from '../../shared';
import './authForms.css';

const ProfileModal = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <Modal isOpen={open} onClose={onClose} title="Profile" size="sm" className="profile-modal">
      <div className="profile-info">
          <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
          <div><strong>Role:</strong> {user.role}</div>
        </div>
      <div className="profile-actions">
        <button className="primary-button" onClick={() => { logout(); onClose(); }}>Logout</button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
