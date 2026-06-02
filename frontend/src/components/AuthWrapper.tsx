'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    setSession, 
    fetchInitialData, 
    subscribeRealtime, 
    isLoading 
  } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Initialize session and subscribe to auth state changes
  useEffect(() => {
    // Verify check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchInitialData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchInitialData();
      } else {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, fetchInitialData]);

  // 2. Real-time subscription when user is authenticated
  useEffect(() => {
    if (currentUser?.couple_id) {
      const unsubscribe = subscribeRealtime();
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.couple_id, subscribeRealtime]);

  // 3. Navigation protection
  useEffect(() => {
    if (isLoading) return;

    if (pathname === '/login') {
      if (currentUser?.couple_id) {
        router.push('/');
      }
    } else {
      if (!currentUser) {
        router.push('/login');
      } else if (!currentUser.couple_id) {
        router.push('/login');
      }
    }
  }, [currentUser, pathname, router, isLoading]);

  return <>{children}</>;
}
