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
});

let requestCount = 0;
let loaderTimeout;

const triggerShowLoader = () => {
  requestCount++;
  if (requestCount === 1) {
    loaderTimeout = setTimeout(() => {
      window.dispatchEvent(new Event('showLoader'));
    }, 300); // 300ms delay to prevent flicker on fast requests
  }
};

const triggerHideLoader = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    clearTimeout(loaderTimeout);
    window.dispatchEvent(new Event('hideLoader'));
  }
};

api.interceptors.request.use((config) => {
  triggerShowLoader();
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  triggerHideLoader();
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  triggerHideLoader();
  return response;
}, (error) => {
  triggerHideLoader();
  return Promise.reject(error);
});

export default api;
