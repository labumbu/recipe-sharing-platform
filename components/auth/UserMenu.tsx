'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      
      // Sign out on the client side
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      // Update state and redirect
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/recipes/new')}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          + New Recipe
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push('/favorites')}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          Favorites
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          Profile
        </button>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.push('/auth/sign-in')}
        className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push('/auth/sign-up')}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        Sign Up
      </button>
    </div>
  );
}
