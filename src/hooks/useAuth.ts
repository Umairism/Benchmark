import { useState, useEffect } from 'react';
import { db } from '../lib/database';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from local database on app initialization
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      console.log('Initializing authentication...');
      const currentUser = db.getCurrentUser();
      console.log('Current user from database:', currentUser);
      if (currentUser) {
        // Convert database user to app user (remove password field)
        const userForState: User = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.full_name,
          role: currentUser.role,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at
        };
        console.log('Setting initial user state:', userForState);
        setUser(userForState);
      } else {
        console.log('No user found in database');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Starting login process for:', email);
      const authenticatedUser = db.authenticateUser(email, password);
      console.log('User authenticated:', authenticatedUser);
      
      // Convert to User type without password
      const userForState: User = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        full_name: authenticatedUser.full_name,
        role: authenticatedUser.role,
        created_at: authenticatedUser.created_at,
        updated_at: authenticatedUser.updated_at
      };
      
      console.log('Setting user state:', userForState);
      setUser(userForState);
      return userForState;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, inviteCode: string, fullName?: string): Promise<User> => {
    try {
      console.log('Starting registration process...');
      const newUser = db.createUser(email, password, inviteCode, fullName);
      console.log('User created in database:', newUser);
      
      // Convert to User type without password
      const userForState: User = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      };
      
      console.log('Setting user state:', userForState);
      setUser(userForState);
      
      // Force re-check after a small delay to ensure state is set
      setTimeout(() => {
        console.log('Re-checking auth state after registration...');
        const currentUser = db.getCurrentUser();
        console.log('Current user from database:', currentUser);
        if (currentUser && !user) {
          console.log('Updating user state from database check');
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.full_name,
            role: currentUser.role,
            created_at: currentUser.created_at,
            updated_at: currentUser.updated_at
          });
        }
      }, 100);
      
      return userForState;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      db.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refetchUser = () => {
    try {
      console.log('Manually refetching user state...');
      const currentUser = db.getCurrentUser();
      console.log('Current user from manual refetch:', currentUser);
      if (currentUser) {
        const userForState: User = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.full_name,
          role: currentUser.role,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at
        };
        console.log('Setting user state from manual refetch:', userForState);
        setUser(userForState);
      } else {
        console.log('No user found during manual refetch');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refetching user:', error);
      setUser(null);
    }
  };

  // Force update auth state - useful for debugging
  const forceUpdateAuth = () => {
    refetchUser();
  };

  return { 
    user, 
    loading, 
    login, 
    register, 
    logout, 
    refetchUser,
    forceUpdateAuth
  };
};