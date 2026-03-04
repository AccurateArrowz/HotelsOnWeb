// API service for hotel data requests using axios
// Handles: hotels by city (with pagination), hotel by id
// Assumes BASE_URL = 'http://localhost:3001/api'

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Handle successful responses (2xx status codes)
    return response;
  },
  (error) => {
    // Handle error responses (4xx, 5xx status codes)
    if (error.response?.status === 401) {
      // Token expired or invalid - clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden access
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch hotels by city with pagination
 * @param {Object} params
 * @param {string} params.city - City name
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.limit - Items per page
 * @returns {Promise<{hotels: Array, total: number, page: number, limit: number}>}
 */
export async function fetchHotelsByCity({ city, page = 1, limit = 20 }) {
  try {
    const response = await api.get('/hotels', {
      params: { city, page, limit },
    });
    return response.data;
  } catch (error) {
    // Error should be handled by UI (e.g., show error and Try Again button)
    throw error;
  }
}

/**
 * Fetch a single hotel by its ID
 * @param {string|number} id - Hotel ID
 * @returns {Promise<Object>} Hotel data
 */
export async function fetchHotelById(id) {
  try {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  } catch (error) {
    // Error should be handled by UI (e.g., show error and Try Again button)
    throw error;
  }
}

// Export the configured api instance for use by other services
export { api, BASE_URL };
