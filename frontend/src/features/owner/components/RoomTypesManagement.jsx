import React, { useState } from 'react';
import {
  useGetRoomTypesByHotelQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
} from '@features/owner/roomTypesApi';
import './RoomTypesManagement.css';

const RoomTypesManagement = ({ hotelId }) => {
  const { data: roomTypes, isLoading, error } = useGetRoomTypesByHotelQuery(hotelId);
  const [createRoomType] = useCreateRoomTypeMutation();
  const [updateRoomType] = useUpdateRoomTypeMutation();
  const [deleteRoomType] = useDeleteRoomTypeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    adults: 2,
    children: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleOpenModal = (roomType = null) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setFormData({
        name: roomType.name,
        description: roomType.description || '',
        basePrice: roomType.basePrice,
        adults: roomType.adults,
        children: roomType.children,
      });
    } else {
      setEditingRoomType(null);
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        adults: 2,
        children: 0,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoomType(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Room type name is required';
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
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
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      basePrice: parseFloat(formData.basePrice),
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
    };

    try {
      if (editingRoomType) {
        await updateRoomType({
          hotelId,
          roomTypeId: editingRoomType.id,
          data: payload,
        }).unwrap();
      } else {
        await createRoomType({
          hotelId,
          data: payload,
        }).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save room type:', err);
      setFormErrors({ submit: err.data?.message || 'Failed to save room type' });
    }
  };

  const handleDelete = async (roomType) => {
    if (!window.confirm(`Are you sure you want to delete "${roomType.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRoomType({
        hotelId,
        roomTypeId: roomType.id,
      }).unwrap();
    } catch (err) {
      console.error('Failed to delete room type:', err);
      alert(err.data?.message || 'Failed to delete room type');
    }
  };

  const handleToggleActive = async (roomType) => {
    try {
      await updateRoomType({
        hotelId,
        roomTypeId: roomType.id,
        data: { isActive: !roomType.isActive },
      }).unwrap();
    } catch (err) {
      console.error('Failed to update room type status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="room-types-management">
        <div className="loading-state">Loading room types...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-types-management">
        <div className="error-state">
          <p>Error loading room types: {error.data?.message || 'Unknown error'}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-types-management">
      <div className="section-header">
        <div className="header-content">
          <h2>Room Types</h2>
          <p className="subtitle">Manage your hotel&apos;s room categories and pricing</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Room Type
        </button>
      </div>

      <div className="room-types-grid">
        {roomTypes?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛏️</div>
            <h3>No Room Types Yet</h3>
            <p>Create your first room type to define the categories of rooms available at your hotel.</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              Create Room Type
            </button>
          </div>
        ) : (
          roomTypes?.map((roomType) => (
            <div
              key={roomType.id}
              className={`room-type-card ${!roomType.isActive ? 'inactive' : ''}`}
            >
              <div className="room-type-header">
                <div className="room-type-title">
                  <h3>{roomType.name}</h3>
                  {!roomType.isActive && <span className="badge inactive">Inactive</span>}
                </div>
                <div className="room-type-price">
                  <span className="price">${parseFloat(roomType.basePrice).toFixed(0)}</span>
                  <span className="per-night">/night</span>
                </div>
              </div>

              {roomType.description && (
                <p className="room-type-description">{roomType.description}</p>
              )}

              <div className="room-type-capacity">
                <div className="capacity-item">
                  <span className="capacity-icon">👤</span>
                  <span>{roomType.adults} Adults</span>
                </div>
                {roomType.children > 0 && (
                  <div className="capacity-item">
                    <span className="capacity-icon">👶</span>
                    <span>{roomType.children} Children</span>
                  </div>
                )}
              </div>

              <div className="room-type-actions">
                <button
                  className="btn btn-text"
                  onClick={() => handleToggleActive(roomType)}
                  title={roomType.isActive ? 'Deactivate' : 'Activate'}
                >
                  {roomType.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleOpenModal(roomType)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(roomType)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoomType ? 'Edit Room Type' : 'Add Room Type'}</h3>
              <button className="btn-close" onClick={handleCloseModal} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Room Type Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Deluxe King, Standard Twin"
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the room features, amenities, etc."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="basePrice">Base Price per Night *</label>
                  <div className="input-prefix">
                    <span className="prefix">$</span>
                    <input
                      type="number"
                      id="basePrice"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={formErrors.basePrice ? 'error' : ''}
                    />
                  </div>
                  {formErrors.basePrice && <span className="error-text">{formErrors.basePrice}</span>}
                </div>

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
              </div>

              {formErrors.submit && (
                <div className="error-message">{formErrors.submit}</div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoomType ? 'Save Changes' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypesManagement;
