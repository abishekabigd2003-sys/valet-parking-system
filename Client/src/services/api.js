import axios from 'axios';

const getCleanApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (rawUrl && typeof rawUrl === 'string') {
    return rawUrl.replace(/^VITE_API_URL=/, '').trim();
  }
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getCleanApiUrl(),
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;
