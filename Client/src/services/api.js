import axios from 'axios';

const getCleanApiUrl = () => {
  let rawUrl = import.meta.env.VITE_API_URL;
  if (rawUrl && typeof rawUrl === 'string') {
    let clean = rawUrl.replace(/^VITE_API_URL=/, '').replace(/^["']|["']$/g, '').trim();
    clean = clean.replace(/\/+$/, ''); // remove trailing slashes
    if (!clean.endsWith('/api')) {
      clean = `${clean}/api`;
    }
    return clean;
  }
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getCleanApiUrl(),
  timeout: 12000, // 12 seconds fail-fast timeout
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
  // If backend returned HTML (e.g. 404 fallback page on static hosting), reject with clear error
  if (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<!doctype html>')) {
    const error = new Error('Received HTML instead of JSON from API. Check VITE_API_URL.');
    error.response = { status: 502, data: { message: 'API Gateway returned HTML webpage instead of JSON endpoint.' } };
    return Promise.reject(error);
  }
  return response;
}, (error) => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    error.message = 'Server request timed out. The server may be waking up or experiencing high traffic. Please retry.';
  }
  return Promise.reject(error);
});

export default api;
