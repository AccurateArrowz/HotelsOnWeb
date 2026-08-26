import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Modal } from '@shared';
import '../../styles/modal.css';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const { user, logout } = useAuth();

  return (
    <Modal isModalOpen={true} onClose={onClose} size="sm" className="profile-modal">
      <h2 className='text-center'>Profile</h2>
      <div className="profile-info">
        <div><strong>Name:</strong> {user?.firstName} {user?.lastName}</div>
        <div><strong>Email:</strong> {user?.email}</div>
      </div>
      <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link 
          to="/profile" 
          className="primary-button text-center" 
          onClick={onClose}
          style={{ textDecoration: 'none' }}
        >
          View Profile
        </Link>
        <button
          className="secondary-button"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
