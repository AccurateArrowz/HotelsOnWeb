// API service for hotel data requests using axios
// Handles: hotels by city (with pagination), hotel by id
// Assumes BASE_URL = 'http://localhost:3001/api'

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

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
    const response = await axios.get(`${BASE_URL}/hotels`, {
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
    const response = await axios.get(`${BASE_URL}/hotels/${id}`);
    return response.data;
  } catch (error) {
    // Error should be handled by UI (e.g., show error and Try Again button)
    throw error;
  }
}
