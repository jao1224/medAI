
"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserProfile } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';


export function useAuth() {
  // Hardcode the admin user, so we are always "logged in"
  const [user, setUser] = useState<User | null>(mockUsers.find(u => u.perfil === 'admin') || mockUsers[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const login = useCallback(async (email: string): Promise<boolean> => {
    // Mock login is no longer needed, but we keep the function to avoid breaking changes
    console.log('Login attempted, but authentication is disabled.');
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
        setUser(foundUser);
        router.push('/dashboard');
        return true;
    }
    return true;
  }, [router]);

  const logout = useCallback(() => {
    // Mock logout
    console.log('Logout attempted, but authentication is disabled.');
    // In a real app, you would redirect to login, but here we do nothing.
  }, []);
  
  const hasRole = (roles: UserProfile | UserProfile[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.perfil);
    }
    return user.perfil === roles;
  };

  return { user, login, logout, loading, hasRole };
}
