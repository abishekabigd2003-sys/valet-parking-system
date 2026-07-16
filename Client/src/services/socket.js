import { io } from 'socket.io-client';

const getCleanSocketUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (rawUrl && typeof rawUrl === 'string') {
    return rawUrl.replace(/^VITE_API_URL=/, '').replace('/api', '').trim();
  }
  return import.meta.env.PROD ? '/' : 'http://localhost:5000';
};

const SOCKET_URL = getCleanSocketUrl();

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;
