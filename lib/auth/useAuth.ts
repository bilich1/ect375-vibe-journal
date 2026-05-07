'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, AuthState } from '@/types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for test mode first - simplified for test mode
    const testMode = localStorage.getItem('test_mode');
    const testUser = localStorage.getItem('test_user');

    if (testMode === 'true' && testUser) {
      try {
        const user = JSON.parse(testUser);
        setAuthState({
          user: user as User,
          loading: false,
          error: null,
        });
        return; // Exit early for test mode
      } catch (error) {
        console.error('Error parsing test user:', error);
        localStorage.removeItem('test_mode');
        localStorage.removeItem('test_user');
      }
    }

    // Only run Supabase auth logic if not in test mode
    const supabase = createClient();

    // Check if user is already logged in
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile with role information
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setAuthState({
            user: null,
            loading: false,
            error: error.message,
          });
        } else {
          setAuthState({
            user: profile as User,
            loading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });
  }, []); // Empty dependency array

  return authState;
}
