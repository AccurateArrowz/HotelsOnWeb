import React, { useState, useMemo, useEffect } from 'react';
import {
  useGetRoomsByHotelQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '@features/owner/roomsApi';
import { useGetRoomTypesByHotelQuery } from '@features/owner/roomTypesApi';
import './RoomManagement.css';

const statusConfig = {
  available: { label: 'Available', bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  occupied: { label: 'Occupied', bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  cleaning: { label: 'Cleaning', bg: '#fef9c3', text: '#a16207', dot: '#eab308' },
  maintenance: { label: 'Maintenance', bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  reserved: { label: 'Reserved', bg: '#f3e8ff', text: '#6b21a8', dot: '#a855f7' },
};

const RoomManagement = ({ hotelId }) => {
  const { data: rooms, isLoading, error } = useGetRoomsByHotelQuery(hotelId);
  const { data: roomTypes } = useGetRoomTypesByHotelQuery(hotelId);
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    roomTypeId: '',
    adults: 2,
    children: 0,
    status: 'available',
  });
  const [formErrors, setFormErrors] = useState({});

  const roomStats = useMemo(() => {
    if (!rooms) return { available: 0, occupied: 0, cleaning: 0, maintenance: 0, reserved: 0, total: 0 };
    return {
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      cleaning: rooms.filter(r => r.status === 'cleaning').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      reserved: rooms.filter(r => r.status === 'reserved').length,
      total: rooms.length,
    };
  }, [rooms]);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor || '',
        roomTypeId: room.roomTypeId,
        adults: room.adults,
        children: room.children,
        status: room.status,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        floor: '',
        roomTypeId: roomTypes?.[0]?.id || '',
        adults: 2,
        children: 0,
        status: 'available',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Room number is required';
    }
    if (!formData.roomTypeId) {
      errors.roomTypeId = 'Room type is required';
    }
    if (formData.floor && (isNaN(formData.floor) || formData.floor < 0)) {
      errors.floor = 'Floor must be a positive number';
    }
    if (formData.adults < 1) {
      errors.adults = 'At least 1 adult capacity required';
    }
    if (formData.children < 0) {
      errors.children = 'Children capacity cannot be negative';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      roomNumber: formData.roomNumber.trim(),
      floor: formData.floor ? parseInt(formData.floor) : undefined,
      roomTypeId: parseInt(formData.roomTypeId),
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      status: formData.status,
    };

    try {
      if (editingRoom) {
        await updateRoom({
          hotelId,
          roomId: editingRoom.id,
          data: payload,
        }).unwrap();
      } else {
        await createRoom({
          hotelId,
          data: payload,
        }).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      setFormErrors({ submit: err.data?.message || 'Failed to save room' });
    }
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`Are you sure you want to delete Room ${room.roomNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRoom({
        hotelId,
        roomId: room.id,
      }).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to delete room');
    }
  };

  const handleStatusChange = async (room, newStatus) => {
    try {
      await updateRoom({
        hotelId,
        roomId: room.id,
        data: { status: newStatus },
      }).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to update room status');
    }
  };

  if (isLoading) {
    return (
      <div className="room-management">
        <div className="loading-state">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-management">
        <div className="error-state">
          <p>Error loading rooms: {error.data?.message || 'Unknown error'}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-management">
      <div className="section-header">
        <div className="header-content">
          <h2>Room Management</h2>
          <p className="subtitle">Manage your hotel rooms and their status</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">Export Report</button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Room
          </button>
        </div>
      </div>

      <div className="room-stats-grid">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = roomStats[key] || 0;
          return (
            <div key={key} className="room-stat-card" style={{ background: cfg.bg }}>
              <span className="stat-number" style={{ color: cfg.text }}>{count}</span>
              <span className="stat-label" style={{ color: cfg.text }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {rooms?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛏️</div>
          <h3>No Rooms Yet</h3>
          <p>Add rooms to your hotel to start managing them.</p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add First Room
          </button>
        </div>
      ) : (
        <div className="table-container shadow-sm">
          <table className="data-table rooms-table">
            <thead>
              <tr>
                <th scope="col">Room Number</th>
                <th scope="col">Type</th>
                <th scope="col">Floor</th>
                <th scope="col">Status</th>
                <th scope="col">Capacity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms?.map((room) => {
                const cfg = statusConfig[room.status];
                return (
                  <tr key={room.id}>
                    <td className="font-semibold">{room.roomNumber}</td>
                    <td>{room.roomType?.name || 'Unknown'}</td>
                    <td>{room.floor || '-'}</td>
                    <td>
                      <select
                        className="status-select"
                        value={room.status}
                        onChange={(e) => handleStatusChange(room, e.target.value)}
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        {Object.entries(statusConfig).map(([key, sc]) => (
                          <option key={key} value={key}>
                            {sc.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{room.adults} Adults{room.children > 0 ? `, ${room.children} Children` : ''}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-text" onClick={() => handleOpenModal(room)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(room)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
              <button className="btn-close" onClick={handleCloseModal} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="roomNumber">Room Number *</label>
                  <input
                    type="text"
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g., 101, A-05"
                    className={formErrors.roomNumber ? 'error' : ''}
                  />
                  {formErrors.roomNumber && <span className="error-text">{formErrors.roomNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="floor">Floor</label>
                  <input
                    type="number"
                    id="floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g., 1, 2, 3"
                    min="0"
                    className={formErrors.floor ? 'error' : ''}
                  />
                  {formErrors.floor && <span className="error-text">{formErrors.floor}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="roomTypeId">Room Type *</label>
                <select
                  id="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={(e) => setFormData({ ...formData, roomTypeId: e.target.value })}
                  className={formErrors.roomTypeId ? 'error' : ''}
                >
                  <option value="">Select a room type</option>
                  {roomTypes?.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} - ${rt.basePrice}/night
                    </option>
                  ))}
                </select>
                {formErrors.roomTypeId && <span className="error-text">{formErrors.roomTypeId}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adults">Adults Capacity *</label>
                  <input
                    type="number"
                    id="adults"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    min="1"
                    max="10"
                    className={formErrors.adults ? 'error' : ''}
                  />
                  {formErrors.adults && <span className="error-text">{formErrors.adults}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="children">Children Capacity</label>
                  <input
                    type="number"
                    id="children"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    min="0"
                    max="8"
                    className={formErrors.children ? 'error' : ''}
                  />
                  {formErrors.children && <span className="error-text">{formErrors.children}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formErrors.submit && (
                <div className="error-message">{formErrors.submit}</div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
