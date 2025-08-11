import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // Fetch user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error || new Error('Login failed');
    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (!profile) throw new Error('User profile not found');
    setUser(profile);
    return profile;
  };

  const register = async (email: string, password: string, inviteCode: string, fullName?: string): Promise<User> => {
    if (inviteCode !== 'BENCHMARK2025') throw new Error('Invalid invite code');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) throw error || new Error('Registration failed');
    // Insert user profile into users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName || null,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (profileError || !profile) throw profileError || new Error('Profile creation failed');
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profile) setUser(profile);
    } else {
      setUser(null);
    }
  };

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
    forceUpdateAuth,
  };
};