import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { RequireAuth, RequireRole } from '../auth/components/RoleBasedComponents';
import { LoginModal } from '../auth/components/LoginModal';
  
const ListYourProperty = () => {
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    country: '',
    amenities: [],
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews for selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    // Store the actual files
    setPropertyData(prev => ({
      ...prev,
      images: files
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Append property data
      Object.keys(propertyData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyData[key]);
        }
      });
      
      // Append images
      propertyData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      // Submit to backend
      const response = await fetch('http://localhost:3001/api/hotel-requests/request', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
        }
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setPropertyData({
          name: '',
          description: '',
          street: '',
          city: '',
          country: '',
          amenities: [],
          images: []
        });
        setImagePreviews([]);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to submit property request');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmitError('An error occurred while submitting your property request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show login option
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>List Your Property</h1>
        <p>You need to be logged in to list your property.</p>
        <button 
          onClick={() => setShowLoginModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Login to Continue
        </button>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </div>
    );
  }

  // If user is authenticated but not a hotel owner, show message
  if (user && user.role !== 'hotelOwner') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>List Your Property</h1>
        <p>You need to have a hotel owner account to list properties.</p>
        <p>Please contact support to upgrade your account.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>List Your Property</h1>
      <p>Fill out the form below to list your property on HotelBooker.</p>
      
      {submitSuccess && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Property request submitted successfully! Our team will review your request.
        </div>
      )}
      
      {submitError && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Property Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={propertyData.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={propertyData.description}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="street" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={propertyData.street}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={propertyData.city}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="country" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={propertyData.country}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="images" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Property Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <small>Upload multiple images of your property (optional)</small>
          
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Image Previews:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Property Request'}
        </button>
      </form>
    </div>
  );
};

// Wrap with authentication and role checks
const ListYourPropertyWithAuth = () => {
  return (
    <RequireAuth redirectTo="/login">
      <RequireRole role="hotelOwner" redirectTo="/unauthorized">
        <ListYourProperty />
      </RequireRole>
    </RequireAuth>
  );
};

export default ListYourPropertyWithAuth;
