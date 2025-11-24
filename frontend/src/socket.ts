import { io } from 'socket.io-client';

const socket = io('https://gamma-crm-production.onrender.com', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
