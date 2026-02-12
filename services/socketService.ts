// Socket.io service for real-time updates
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';

let socket: Socket | null = null;

/**
 * Initialize Socket.io connection
 */
export function initializeSocket() {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('✅ Connected to election server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from election server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
}

/**
 * Get the socket instance
 */
export function getSocket() {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}

/**
 * Listen for vote updates
 */
export function onVoteUpdate(callback: (data: any) => void) {
  const socket = getSocket();
  socket.on('vote-update', callback);
  return () => socket.off('vote-update', callback);
}

/**
 * Listen for countdown updates
 */
export function onCountdownUpdate(callback: (data: any) => void) {
  const socket = getSocket();
  socket.on('countdown-update', callback);
  return () => socket.off('countdown-update', callback);
}

/**
 * Listen for initial data
 */
export function onInitialData(callback: (data: any) => void) {
  const socket = getSocket();
  socket.on('initial-data', callback);
  return () => socket.off('initial-data', callback);
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
