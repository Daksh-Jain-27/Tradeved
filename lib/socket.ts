import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://94.136.190.104:4000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: async (cb) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      cb({ token, userId });
    } catch (error) {
      console.error('[Socket] Auth error:', error);
      cb({ token: null, userId: null });
    }
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

// Connection lifecycle handlers
socket.on('connect', () => {
  console.log('[Socket] ✅ Connected to server');
});

socket.on('disconnect', (reason) => {
  console.log(`[Socket] ❌ Disconnected: ${reason}`);
});

socket.on('connect_error', (err) => {
  console.error('[Socket] ❌ Connection error:', err.message);
});

// Reconnect handlers
socket.io.on('reconnect_attempt', (attempt) => {
  console.log(`[Socket] 🔄 Reconnect attempt #${attempt}`);
});

socket.io.on('reconnect_error', (err) => {
  console.error('[Socket] ❌ Reconnect error:', err.message);
});

socket.io.on('reconnect_failed', () => {
  console.error('[Socket] ❌ Reconnect failed');
});

export default socket; 