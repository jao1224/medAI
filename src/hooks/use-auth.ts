
"use client";

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User, UserProfile } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/login')) {
        router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    console.log(`Login attempt for: ${email}`);
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
        setUser(foundUser);
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        console.log('User found, navigating to dashboard');
        router.push('/dashboard');
        setLoading(false);
        return true;
    }
    
    console.log('User not found');
    setLoading(false);
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  }, [router]);
  
  const hasRole = (roles: UserProfile | UserProfile[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.perfil);
    }
    return user.perfil === roles;
  };

  return { user, login, logout, loading, hasRole };
}
