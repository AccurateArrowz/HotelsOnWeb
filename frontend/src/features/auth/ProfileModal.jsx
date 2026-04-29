import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Modal } from '../../shared';
import '../../styles/modal.css';

const ProfileModal = ({onClose}) => {
  const { user, logout } = useAuth();

  return (
    <Modal isModalOpen={true} onClose={onClose} size="sm" className="profile-modal">
      <div className="profile-info">
          <h2 className='text-center'>Profile</h2>
          <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
          <div><strong>Role:</strong> {user.role}</div>
        </div>
      <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link 
          to="/my-bookings" 
          className="primary-button text-center" 
          onClick={onClose}
          style={{ textDecoration: 'none' }}
        >
          My Bookings
        </Link>
        <button className="secondary-button" onClick={() => { logout(); 
          onClose(); }}>Logout</button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
