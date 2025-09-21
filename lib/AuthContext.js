"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, onAuthStateChange } from './supabase';
import { logUserLogin, logUserLogout } from '../utils/analytics';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      // Track login/logout events
      if (event === 'SIGNED_IN' && session?.user) {
        await logUserLogin(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        // Note: We don't have user ID on sign out, but we can still log the event
        // The user ID would need to be stored in state or localStorage for logout tracking
      }

      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
