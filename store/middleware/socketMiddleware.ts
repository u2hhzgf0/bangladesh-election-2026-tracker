import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import {
  setConnectionStatus,
  updateVotes,
  updateReferendum,
  updateCountdown,
  updateAllData,
} from '../slices/realtimeSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://votapi.wixford.com';

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => {
  // Initialize socket connection
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to election server');
      store.dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from election server');
      store.dispatch(setConnectionStatus(false));
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      store.dispatch(setConnectionStatus(false));
    });

    // Data events
    socket.on('initial-data', (data: any) => {
      console.log('📊 Received initial data');
      store.dispatch(updateAllData(data));
    });

    // Listen for 'votes' event from server
    socket.on('votes', (data: any) => {
      console.log('🗳️  Received vote update:', data);
      store.dispatch(updateVotes(data));
    });

    socket.on('vote-update', (data: any) => {
      if (data.votes) {
        store.dispatch(updateVotes(data.votes));
      }
      if (data.referendum) {
        store.dispatch(updateReferendum(data.referendum));
      }
    });

    // Listen for 'countdown' event from server
    socket.on('countdown', (data: any) => {
      store.dispatch(updateCountdown(data));
    });

    socket.on('countdown-update', (data: any) => {
      store.dispatch(updateCountdown(data));
    });
  }

  return (next) => (action) => {
    return next(action);
  };
};

// Export socket instance for external use if needed
export const getSocket = () => socket;
