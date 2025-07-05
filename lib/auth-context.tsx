import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  login: (userId: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth on mount
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const [storedUserId, storedToken] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('token')
      ]);

      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  };

  const login = async (newUserId: string, newToken: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userId', newUserId),
        AsyncStorage.setItem('token', newToken)
      ]);
      setUserId(newUserId);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('userId'),
        AsyncStorage.removeItem('token')
      ]);
      setUserId(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth state:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 