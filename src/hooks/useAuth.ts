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
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session without triggering auth loops
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error && !error.message.includes('session missing')) {
          console.error('Auth session error:', error);
        }
        
        if (mounted) {
          if (session?.user) {
            // Try to fetch user profile, but don't fail if database isn't set up yet
            try {
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile && mounted) {
                setUser(convertDbUserToUser(profile));
              } else {
                // Database not set up yet, use basic user data
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
              }
            } catch (dbError) {
              // Database table doesn't exist yet, use auth data
              if (mounted) {
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
              }
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    // Listen for auth state changes with debouncing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile && mounted) {
            setUser(convertDbUserToUser(profile));
          } else if (mounted) {
            // Use basic user data if profile not found
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
          }
        } catch (error) {
          // Database not ready, use auth data
          if (mounted) {
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
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) throw error || new Error('Login failed');
      
      // Try to fetch user profile, but don't fail if database isn't ready
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          const convertedUser = convertDbUserToUser(profile);
          setUser(convertedUser);
          return convertedUser;
        } else {
          // Profile not found, create basic user
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
      } catch (dbError) {
        // Database not ready, use auth data
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
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, inviteCode: string, fullName?: string): Promise<User> => {
    if (inviteCode !== 'BENCHMARK2025') throw new Error('Invalid invite code');
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error || !data.user) throw error || new Error('Registration failed');
      
      // Try to insert user profile into users table
      try {
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
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Create basic user object if profile creation fails
          const basicUser: User = {
            id: data.user.id,
            email,
            full_name: fullName || data.user.email?.split('@')[0] || 'User',
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
        
        if (!profile) throw new Error('Profile creation failed');
        const convertedUser = convertDbUserToUser(profile);
        setUser(convertedUser);
        return convertedUser;
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
        // Create basic user object as fallback
        const basicUser: User = {
          id: data.user.id,
          email,
          full_name: fullName || data.user.email?.split('@')[0] || 'User',
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
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refetchUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(convertDbUserToUser(profile));
          } else {
            // Create basic user if profile not found
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
          }
        } catch (dbError) {
          // Database not ready
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
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Refetch user error:', error);
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
