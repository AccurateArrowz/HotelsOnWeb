import { api, BASE_URL } from './api.js';

const register = (userData) => {
  return api.post('/auth/register', userData);
};

const login = (userData) => {
  return api.post('/auth/login', userData);
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};
