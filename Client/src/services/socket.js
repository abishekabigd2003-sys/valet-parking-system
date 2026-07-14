import { io } from 'socket.io-client';

// Use environment variable if available, otherwise fallback to standard port
const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;
