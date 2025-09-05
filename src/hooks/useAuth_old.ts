import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

// Helper function to convert database user to our User type
const convertDbUserToUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    role: dbUser.role,
    profile_picture: dbUser.profile_picture,
    bio: dbUser.bio,
    subjects: dbUser.subjects || [],
    likes: dbUser.likes || [],
    dislikes: dbUser.dislikes || [],
    interests: dbUser.interests || [],
    social_media: (typeof dbUser.social_media === 'object' && dbUser.social_media !== null) 
      ? dbUser.social_media as User['social_media']
      : {},
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at
  };
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Auth error:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (data?.user) {
          // Fetch user profile from users table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            // If users table doesn't exist or profile not found, create a basic user object
            const basicUser: User = {
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
              role: 'user',
              subjects: [],
              likes: [],
              dislikes: [],
              interests: [],
              social_media: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUser(basicUser);
          } else if (profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getSession();
    
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error on auth change:', profileError);
            // Create basic user object if profile fetch fails
            const basicUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              role: 'user',
              subjects: [],
              likes: [],
              dislikes: [],
              interests: [],
              social_media: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUser(basicUser);
          } else if (profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) throw error || new Error('Login failed');
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Profile fetch error during login:', profileError);
        // Create basic user object if profile fetch fails
        const basicUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          role: 'user',
          subjects: [],
          likes: [],
          dislikes: [],
          interests: [],
          social_media: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUser(basicUser);
        return basicUser;
      }
      
      if (!profile) throw new Error('User profile not found');
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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